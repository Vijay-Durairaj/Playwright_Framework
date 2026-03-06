import { Container } from "inversify";
import { Page } from "@playwright/test";
import { ProductListingPage } from "@pages/productlistingpage";

export const container = new Container();

container.bind<(page: Page) => ProductListingPage>('ProductListingPageFactory').toFactory(() => {
    return (page: Page) => new ProductListingPage(page);
});
