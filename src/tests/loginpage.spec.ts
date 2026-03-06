import { LoginPage } from '@pages/LoginPage';
import { test, expect } from '@playwright/test';
import { container, LoginPageFactory } from '@symbols/loginpage/LoginPage.inversify';
import { LOGIN_PAGE } from '@symbols/loginpage/LoginPage.symbol';
import loginTs from '../resource/testdata/LoginPage.json';
import testData from '../resource/testdata/LoginPage.json';

test.describe('Login Page', () => {

    const homeUrl = testData.urls.login;
    const loginData = loginTs.loginData;
    let loginPage: LoginPage;

    test.beforeEach(async ({ page }) => {
        loginPage = container.get<LoginPageFactory>(LOGIN_PAGE.LoginPageFactory)(page);
    });

    loginData.forEach((testData) => {
        test((`${testData.testId}, ${testData.description}`), async ({ page }) => {
            await page.goto(homeUrl);
            await expect(page.locator('form')).toBeVisible();
            await loginPage.login(testData.email, testData.password);
            await page.waitForLoadState('networkidle');
            expect(await loginPage.isLoginSuccessful()).toBeTruthy();
            await loginPage.logout();
        });
    });
});