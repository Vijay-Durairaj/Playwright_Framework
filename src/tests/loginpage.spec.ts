import { LoginPage } from '@pages/LoginPage';
import { test, expect } from '@playwright/test';
import { container, LoginPageFactory } from '@symbols/loginpage/LoginPage.inversify';
import { LOGIN_PAGE } from '@symbols/loginpage/LoginPage.symbol';
import { DataHelper } from 'src/helper/DataHelper'; 
import {
    TestData, LoginTestData,
} from '../utils/TestDataTypes';

test.describe('Login Page', () => {

    let loginPage: LoginPage;  
    const urls      = DataHelper.getField<TestData, TestData['urls']>('testdata.json', 'urls');
    const loginData = DataHelper.getAll<TestData, LoginTestData>('testdata.json', 'loginData');

    test.beforeEach(async ({ page }) => {
         loginPage = container.get<LoginPageFactory>(LOGIN_PAGE.LoginPageFactory)(page);
    });

    loginData.forEach((loginData) => {
        test((`${loginData.testId}, ${loginData.description}`), async ({ page }) => {
            await page.goto(urls.login);
            await expect(page.locator('form')).toBeVisible();
            await loginPage.login(loginData.email, loginData.password); 
            await page.waitForLoadState('networkidle');
            expect(await loginPage.isLoginSuccessful()).toBeTruthy();
            await loginPage.logout();
        });
    });
});