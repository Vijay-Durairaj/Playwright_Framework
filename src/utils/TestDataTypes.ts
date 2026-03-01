// src/interfaces/TestDataTypes.ts
// ─────────────────────────────────────────────────────────────────────────────
// ADD NEW INTERFACES HERE WHEN YOU ADD A NEW JSON FILE.
// Never touch DataHelper.ts — only this file grows over time.
// ─────────────────────────────────────────────────────────────────────────────

// ── Login ─────────────────────────────────────────────────────────────────────
export interface LoginTestData {
    testId:         string;
    description:    string;
    email:          string;
    password:       string;
    expectedResult: 'success' | 'failure';
}

export interface TestData {
    loginData: LoginTestData[];
    urls: {
        login:     string;
        dashboard: string;
    };
}

// ── Products (example of a second JSON file) ──────────────────────────────────
export interface Product {
    id:       number;
    name:     string;
    price:    number;
    category: string;
}

export interface ProductData {
    products: Product[];
}

// ── Users (example of a third JSON file) ──────────────────────────────────────
export interface UserTestData {
    userId:   string;
    username: string;
    role:     'admin' | 'user' | 'guest';
    active:   boolean;
}

export interface UserData {
    users: UserTestData[];
}

// ── Add more below as your suite grows ────────────────────────────────────────