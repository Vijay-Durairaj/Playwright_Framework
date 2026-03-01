import * as fs from 'fs';
import * as path from 'path';

type ArrayFields<T> = {
    [K in keyof T]: T[K] extends unknown[] ? K : never;
}[keyof T];

export class DataHelper {

    private static cache = new Map<string, unknown>();

    private static dataDir = path.resolve(__dirname, '../resource/testdata');

    static setDataDir(absolutePath: string): void {
        this.dataDir = absolutePath;
    }

    static load<T>(fileName: string): T {
        console.log('__dirname    =', __dirname);
        console.log('dataDir      =', this.dataDir);
        console.log('looking for  =', path.join(this.dataDir, fileName));
        if (this.cache.has(fileName)) {
            return this.cache.get(fileName) as T;
        }

        const filePath = path.join(this.dataDir, fileName);

        if (!fs.existsSync(filePath)) {
            throw new Error(
                `[DataHelper] File not found: ${filePath}\n` +
                `Make sure the file exists under: ${this.dataDir}`
            );
        }

        try {
            const raw = fs.readFileSync(filePath, 'utf-8');
            const data = JSON.parse(raw) as T;
            this.cache.set(fileName, data);
            return data;
        } catch (e) {
            throw new Error(`[DataHelper] Failed to parse JSON in "${fileName}": ${e}`);
        }
    }

    static getAll<T, I>(fileName: string, arrayKey: ArrayFields<T>): I[] {
        const data = this.load<T>(fileName);
        const items = data[arrayKey] as unknown as I[];

        if (!Array.isArray(items)) {
            throw new Error(
                `[DataHelper] "${String(arrayKey)}" in "${fileName}" is not an array.`
            );
        }

        return items;
    }

    static getById<T, I>(
        fileName: string,
        arrayKey: ArrayFields<T>,
        searchKey: keyof I,
        searchVal: unknown
    ): I {
        const items = this.getAll<T, I>(fileName, arrayKey);
        const found = items.find(item => item[searchKey] === searchVal);

        if (!found) {
            throw new Error(
                `[DataHelper] No item found in "${fileName}" → "${String(arrayKey)}" ` +
                `where ${String(searchKey)} === "${searchVal}"`
            );
        }

        return found;
    }

    static getWhere<T, I>(
        fileName: string,
        arrayKey: ArrayFields<T>,
        filterKey: keyof I,
        filterValue: unknown
    ): I[] {
        return this.getAll<T, I>(fileName, arrayKey)
            .filter(item => item[filterKey] === filterValue);
    }

    static getField<T, F>(fileName: string, fieldKey: keyof T): F {
        const data = this.load<T>(fileName);
        return data[fieldKey] as unknown as F;
    }

    static clearCache(fileName?: string): void {
        fileName ? this.cache.delete(fileName) : this.cache.clear();
    }
}