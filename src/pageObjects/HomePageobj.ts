import { Page,Locator} from '@playwright/test';

export class HomePageObj {
    page: Page;

    constructor(page:Page) {
        this.page = page;
    }

    getSignInButton(): Locator {
        return this.page.getByRole('link', { name: 'Sign in' });
    }
}