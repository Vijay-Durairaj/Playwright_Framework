import 'reflect-metadata';

import { Page } from '@playwright/test';
import { injectable } from 'inversify';          // ← no @inject needed
import { LoginPageObj } from '@pageObjects/LoginPageObj';
import { ILoginPage } from '@interfaces/LoginPage';

@injectable()
export class LoginPage implements ILoginPage {
    
    public page!: Page;
    private loginPageObj!: LoginPageObj;

     init(page: Page): this {
        this.page = page;
        this.loginPageObj = new LoginPageObj(page);
        return this
    }

    async login(username: string, password: string): Promise<void> {
        await this.loginPageObj.getUsernameField().fill(username);
        await this.loginPageObj.getPasswordField().fill(password);
        await this.loginPageObj.getSubmitButton().click();
    }

    async isLoginSuccessful(): Promise<boolean> {
        // Implement logic to check if login was successful, e.g., by checking for a specific element
        return await this.loginPageObj.getHomePageIndicator().isVisible();
    }
}