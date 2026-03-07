import { test, expect } from './fixtures/auth.fixture';
import productpage from '../resource/api_testdata/productpage.json';
import { ProductListingPage } from '@pages/productlistingpage';
import product from '../resource/api_testdata/productpage.json';
import { Endpoints } from 'src/models/ProductListingPage';
import testData from '../resource/testdata/LoginPage.json';

test.describe('Product Listing Page', () => {

    const loginData = testData.loginData[0];

    test('should display products correctly', async ({ page, getToken, loginAs }) => {

        const endpoints: Endpoints = {
            apiEndpoint: `**/${productpage?.Products?.allProducts}`,
            Products: {
                allProducts: productpage?.Products?.allProducts,
            },
        };

        let productsResponseBody: any;

        // Register route before login so the product list request can be intercepted.
        await page.route(endpoints.apiEndpoint, async (route) => {
            const apiResponse = await route.fetch();
            productsResponseBody = await apiResponse.json();
            await route.fulfill({ response: apiResponse });
        });

        const productsResponsePromise = page.waitForResponse(
            (res) => res.url().includes(endpoints.Products.allProducts) && res.ok()
        );
        
        await loginAs(loginData.email, loginData.password);
        await productsResponsePromise;

        const allProducts = Array.isArray(productsResponseBody?.data)
            ? productsResponseBody.data
            : [];

        console.log('First product:', allProducts[0].productDescription);

        expect(allProducts.length).toBeGreaterThan(0);
    
    });
});