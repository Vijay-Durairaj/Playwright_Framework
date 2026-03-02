import { Page, Locator } from '@playwright/test';

export class LoginPageObj {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    getUsernameField(): Locator {
        return this.page.locator('#userEmail');
    }

    getPasswordField(): Locator {
        return this.page.locator('#userPassword');
    }

    getSubmitButton(): Locator {
        return this.page.locator('[value="Login"]');
    }

    getHomePageIndicator(): Locator {
        return this.page.getByRole('heading', { name: 'Automation' });
    }

    getLogoutButton(): Locator {
        return this.page.locator('button', {hasText:' Sign Out '});
    }
}