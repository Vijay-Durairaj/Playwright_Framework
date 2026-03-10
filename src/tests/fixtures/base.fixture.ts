import { test as base, expect } from '@playwright/test';
import { container } from '@containers/ai/inversify.config';
import { TYPES } from '@containers/ai/types';
import { ILocatorHealer } from '@interfaces/ai/ILocatorHealer';
import { getDOM } from '@utils/domCollector';

const healer = container.get<ILocatorHealer>(TYPES.LocatorHealer);

const PLAYWRIGHT_LOCATOR_APIS = [
    'getByRole',
    'getByText',
    'getByLabel',
    'getByPlaceholder',
    'getByAltText',
    'getByTitle',
    'getByTestId',
    'getByValue',
] as const;

function extractCallExpression(source: string, methodName: string): string | null {
    const start = source.indexOf(`${methodName}(`);
    if (start < 0) return null;

    let depth = 0;
    let quote: '"' | "'" | '`' | null = null;

    for (let i = start; i < source.length; i++) {
        const ch = source[i];
        const prev = source[i - 1];

        if (quote) {
            if (ch === quote && prev !== '\\') {
                quote = null;
            }
            continue;
        }

        if (ch === '"' || ch === "'" || ch === '`') {
            quote = ch;
            continue;
        }

        if (ch === '(') {
            depth++;
            continue;
        }

        if (ch === ')') {
            depth--;
            if (depth === 0) {
                return source.slice(start, i + 1).trim();
            }
        }
    }

    return null;
}

function extractFailedLocator(errorMessage: string | undefined): string | null {
    if (!errorMessage) return null;

    const locatorMatch = errorMessage.match(/locator\((['"`])(.*?)\1\)/s);
    if (locatorMatch?.[2]) {
        return locatorMatch[2].trim();
    }

    const selectorMatch = errorMessage.match(/selector:\s*(['"`])(.*?)\1/s);
    if (selectorMatch?.[2]) {
        return selectorMatch[2].trim();
    }

    for (const api of PLAYWRIGHT_LOCATOR_APIS) {
        const apiLocator = extractCallExpression(errorMessage, api);
        if (apiLocator) {
            return apiLocator;
        }
    }

    return null;
}

type SelfHealFixture = {
    selfHealOnFailure: void;
};

export const test = base.extend<SelfHealFixture>({
    selfHealOnFailure: [
        async ({ page }, use, testInfo) => {
            await use();

            if (testInfo.status !== 'failed') {
                return;
            }

            const dom = await getDOM(page);
            const errorMessage = testInfo.errors?.[0]?.message;
            const failedLocator = extractFailedLocator(errorMessage);

            if (!failedLocator) {
                console.log('Self-heal skipped: unable to detect failed locator from error logs.');
                return;
            }

            const newLocator = await healer.suggestLocator(dom, failedLocator);
            console.log('Failed Locator:', failedLocator);
            console.log('AI Suggested Locator:', newLocator);
        },
        { auto: true },
    ],
});

export { expect };
