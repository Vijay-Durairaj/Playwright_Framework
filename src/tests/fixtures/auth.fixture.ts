import { test as base, expect } from '@playwright/test';
import { container, LoginPageFactory } from '@symbols/loginpage/LoginPage.inversify';
import { LOGIN_PAGE } from '@symbols/loginpage/LoginPage.symbol';
import testData from '../../resource/testdata/LoginPage.json';

type AuthFixtures = {
    loginAs: (email?: string, password?: string) => Promise<void>;
    getToken: (email?: string, password?: string) => Promise<string>;
};

const defaultUser = testData.loginData[0];

export const test = base.extend<AuthFixtures>({
    loginAs: async ({ page }, use) => {
        const loginPage = container.get<LoginPageFactory>(LOGIN_PAGE.LoginPageFactory)(page);

        await use(async (email = defaultUser.email, password = defaultUser.password) => {
            await page.goto(testData.urls.login);
            await loginPage.login(email, password);
            await page.waitForLoadState('networkidle');
        });
    },

    getToken : async ({ page }, use) => {
        await use(async (email = defaultUser.email, password = defaultUser.password) => {
            const response = await page.request.post('https://rahulshettyacademy.com/api/ecom/auth/login', {
                data: {
                    userEmail: email,
                    userPassword: password,
                },
            });

            if (!response.ok()) {
                throw new Error(`Login API failed with status ${response.status()}`);
            }

            const json = await response.json();
            const token = json?.token as string | undefined;

            if (!token) {
                throw new Error('Token not found in login response.');
            }

            return token;
        });
    },
});

export { expect };
