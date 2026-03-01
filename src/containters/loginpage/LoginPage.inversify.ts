import { ILoginPage } from "@interfaces/LoginPage";
import { LOGIN_PAGE } from "./LoginPage.symbol";
import { LoginPage } from "@pages/LoginPage";
import { Container } from "inversify";

export const container = new Container();

container.bind<ILoginPage>(LOGIN_PAGE.LoginPage).to(LoginPage);