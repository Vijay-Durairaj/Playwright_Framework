import { test as base, expect } from '@playwright/test';
import { container, LoginPageFactory } from '@symbols/loginpage/LoginPage.inversify';
import { LOGIN_PAGE } from '@symbols/loginpage/LoginPage.symbol';
import testData from '../../resource/testdata/LoginPage.json';

type AuthFixtures = {
    loginAs: (email?: string, password?: string) => Promise<void>;
    loginAndGetToken: (email?: string, password?: string) => Promise<string>;
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
    loginAndGetToken: async ({ page }, use) => {
        const loginPage = container.get<LoginPageFactory>(LOGIN_PAGE.LoginPageFactory)(page);

        await use(async (email = defaultUser.email, password = defaultUser.password) => {
            const loginResponsePromise = page.waitForResponse((response) => {
                const url = response.url();
                return response.status() === 200 && /auth\/login/i.test(url);
            }, { timeout: 20000 }).catch(() => null);

            await page.goto(testData.urls.login);
            await loginPage.login(email, password);
            await page.waitForLoadState('networkidle');

            const loginResponse = await loginResponsePromise;

            let token = '';

            if (loginResponse) {
                try {
                    const loginPayload = await loginResponse.json();
                    token = loginPayload?.token
                        ?? loginPayload?.accessToken
                        ?? loginPayload?.data?.token
                        ?? loginPayload?.data?.accessToken
                        ?? '';
                } catch {
                }
            }

            if (!token) {
                token = await page.evaluate(() => {
                    const local = localStorage.getItem('token')
                        ?? localStorage.getItem('accessToken')
                        ?? localStorage.getItem('authToken');

                    if (local) {
                        return local;
                    }

                    return sessionStorage.getItem('token')
                        ?? sessionStorage.getItem('accessToken')
                        ?? sessionStorage.getItem('authToken')
                        ?? '';
                });
            }

            if (!token) {
                const cookies = await page.context().cookies();
                const tokenCookie = cookies.find((cookie) => /token|auth|jwt/i.test(cookie.name));
                token = tokenCookie?.value ?? '';
            }

            if (!token) {
                throw new Error('Token not found after login from login response, storage, or cookies.');
            }

            return token;
        });
    },
});

export { expect };
