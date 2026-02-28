import { test, expect } from '@playwright/test';
import { HomePage } from '@pages/homepage';
import { container } from '@symbols/homepage/homepage.inversify';
import { HOME_PAGE } from '@symbols/homepage/Homepage.symbols';

test.describe('Launch Browser', () => {
    let homePage: HomePage;

    test.beforeEach(async ({ page }) => {
        // 1. Get the class instance from Inversify (no Page involved here)
        homePage = container.get<HomePage>(HOME_PAGE.HomePage).init(page); // <-- Call init() immediately after getting the instance

    });

    test('open browser', async () => {
        await homePage.page.goto('https://playwright.dev/docs/getting-started-vscode#');
        await expect(homePage.page).toHaveTitle('Getting started - VS Code | Playwright');
        await homePage.clickSignIn();
    });
});