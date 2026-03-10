import { Page } from "@playwright/test";

export async function getDOM(page: Page) {

  return await page.content();

}