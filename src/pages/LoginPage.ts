import { Page } from '@playwright/test';
import { injectable } from 'inversify';
import { LoginPageObj } from '@pageObjects/LoginPageObj';
import { ILoginPage } from '@interfaces/pages/LoginPage';

@injectable()
export class LoginPage implements ILoginPage {

    private page: Page;
    private loginPageObj: LoginPageObj;

    constructor(page: Page) {
        this.page = page;
        this.loginPageObj = new LoginPageObj(page);
    }

    async login(username: string, password: string): Promise<void> {
        await this.loginPageObj.getUsernameField().fill(username);
        await this.loginPageObj.getPasswordField().fill(password);
        await this.loginPageObj.getSubmitButton().click();
    }

    async isLoginSuccessful(): Promise<boolean> {
        return await this.loginPageObj.getHomePageIndicator().isVisible();
    }

    async logout(): Promise<void> {
        await this.loginPageObj.getLogoutButton().click();
    }
}