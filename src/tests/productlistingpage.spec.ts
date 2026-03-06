import { test, expect } from './fixtures/auth.fixture';
import productpage from '../resource/api_testdata/productpage.json';
import { ProductListingPage } from '@pages/productlistingpage';

test.describe('Product Listing Page', () => {

    const getAllProducts = productpage?.Products?.allProducts;

    test('should display products correctly', async ({ page, loginAndGetToken }) => {
        const token = await loginAndGetToken();
        const productListingPage = new ProductListingPage(page);
        const products = await productListingPage.getProductList(getAllProducts, token);

        expect(token).toBeTruthy();
        expect(products).toBeDefined();
        expect(products.length).toBeGreaterThan(0);
        console.log('Products:', products);
    });
});