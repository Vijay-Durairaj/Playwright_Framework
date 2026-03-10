// ✅ reflect-metadata MUST be first — before any other import
import 'reflect-metadata';

import { Page } from '@playwright/test';
import { injectable } from 'inversify';          // ← no @inject needed
import { HomePageObj } from '@pageObjects/HomePageobj';
import { IHomePage } from '@interfaces/pages/HomePage';

@injectable()
export class HomePage implements IHomePage {
    // public so the test can assign it: homePage.page = page
    // The ! tells TypeScript "I promise this will be set before use"
    public page!: Page;
    public homePageObj!: HomePageObj;

    // ✅ No constructor parameters — Page comes from Playwright, not Inversify.
    //    Inversify manages this class; Playwright manages Page.
    //    They live in different worlds and must not be mixed.
    constructor() {}

    // Called by your test's beforeEach after container.get()
    // so that page and homePageObj are ready before any test runs
    init(page: Page): this {
        this.page = page;
        this.homePageObj = new HomePageObj(page);
        return this
    }

    async clickSignIn(): Promise<void> {
        await this.homePageObj.getSignInButton().click();
    }
}