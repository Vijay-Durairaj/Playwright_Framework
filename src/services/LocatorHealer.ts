import { injectable } from "inversify";
import OpenAI from "openai";
import { ILocatorHealer } from "@interfaces/ai/ILocatorHealer";
import { createHash } from "crypto";

type RagChunk = {
  id: string;
  text: string;
  embedding: number[];
};

type RetrievedChunk = {
  text: string;
  score: number;
};

@injectable()
export class LocatorHealer implements ILocatorHealer {

  private client: OpenAI | null = null;

  private static readonly domIndex = new Map<string, RagChunk[]>();

  private static readonly MAX_DOM_CHARS = 32000;

  private static readonly CHUNK_SIZE = 1400;

  private static readonly CHUNK_OVERLAP = 200;

  private static readonly MAX_CHUNKS_TO_EMBED = 16;

  private static readonly TOP_K = 4;

  private getClient(): OpenAI {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY is not set. Configure it in environment variables.");
    }

    if (!this.client) {
      this.client = new OpenAI({ apiKey });
    }

    return this.client;
  }

  private hash(value: string): string {
    return createHash("sha1").update(value).digest("hex");
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length || a.length === 0) return 0;

    let dot = 0;
    let magA = 0;
    let magB = 0;

    for (let i = 0; i < a.length; i++) {
      dot += a[i] * b[i];
      magA += a[i] * a[i];
      magB += b[i] * b[i];
    }

    const denom = Math.sqrt(magA) * Math.sqrt(magB);
    return denom === 0 ? 0 : dot / denom;
  }

  private chunkDom(dom: string): string[] {
    const trimmed = dom.slice(0, LocatorHealer.MAX_DOM_CHARS);
    const chunks: string[] = [];
    const step = LocatorHealer.CHUNK_SIZE - LocatorHealer.CHUNK_OVERLAP;

    for (let start = 0; start < trimmed.length; start += step) {
      const chunk = trimmed.slice(start, start + LocatorHealer.CHUNK_SIZE);
      if (chunk.trim().length > 0) {
        chunks.push(chunk);
      }
      if (chunks.length >= LocatorHealer.MAX_CHUNKS_TO_EMBED) {
        break;
      }
    }

    return chunks;
  }

  private async createEmbedding(input: string): Promise<number[]> {
    const client = this.getClient();
    const embeddingResponse = await client.embeddings.create({
      model: "text-embedding-3-small",
      input,
    });

    return embeddingResponse.data[0]?.embedding ?? [];
  }

  private async indexDom(dom: string): Promise<RagChunk[]> {
    const domHash = this.hash(dom);
    const existing = LocatorHealer.domIndex.get(domHash);
    if (existing) {
      return existing;
    }

    const chunks = this.chunkDom(dom);
    const indexedChunks: RagChunk[] = [];

    for (let i = 0; i < chunks.length; i++) {
      const chunkText = chunks[i];
      const embedding = await this.createEmbedding(chunkText);

      indexedChunks.push({
        id: `${domHash}-${i}`,
        text: chunkText,
        embedding,
      });
    }

    LocatorHealer.domIndex.set(domHash, indexedChunks);
    return indexedChunks;
  }

  private async retrieveRelevantChunks(dom: string, query: string): Promise<RetrievedChunk[]> {
    const indexedChunks = await this.indexDom(dom);
    if (indexedChunks.length === 0) {
      return [];
    }

    const queryEmbedding = await this.createEmbedding(query);

    return indexedChunks
      .map((chunk) => ({
        text: chunk.text,
        score: this.cosineSimilarity(queryEmbedding, chunk.embedding),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, LocatorHealer.TOP_K);
  }

  async suggestLocator(dom: string, failedLocator: string): Promise<string> {
    const client = this.getClient();

    const retrieved = await this.retrieveRelevantChunks(dom, failedLocator);
    const ragContext = retrieved
      .map((chunk, idx) => `Chunk ${idx + 1} (score ${chunk.score.toFixed(3)}):\n${chunk.text}`)
      .join("\n\n");

    const prompt = `
    The following locator failed: ${failedLocator}

    Use the retrieved DOM snippets below to propose a resilient Playwright locator.
    Prefer getByRole/getByLabel/getByTestId patterns when possible.

    Retrieved context:
    ${ragContext || "No retrieved context available."}

    Return only the locator string. Do not include explanation.
    `;

    const response = await client.chat.completions.create({
      model: "gpt-4.1",
      messages: [
        { role: "user", content: prompt }
      ]
    });

    console.log("[RAG] indexedChunks:", LocatorHealer.domIndex.size > 0 ? "available" : "none");
    console.log("[RAG] retrievedChunks:", retrieved.length);
    console.log("[RAG] topScores:", retrieved.map((c) => c.score.toFixed(3)).join(", "));

    return response.choices[0].message.content || "";

  }

}