import { LOGIN_PAGE } from "./LoginPage.symbol";
import { LoginPage } from "@pages/LoginPage";
import { Container } from "inversify";
import { Page } from "@playwright/test";

export const container = new Container();

export type LoginPageFactory = (page: Page) => LoginPage;

container.bind<LoginPageFactory>(LOGIN_PAGE.LoginPageFactory).toFactory(() => {
	return (page: Page) => new LoginPage(page);
});