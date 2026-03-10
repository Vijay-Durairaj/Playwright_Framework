import { IProductListingPage } from "../interfaces/pages/ProductListingPage";
import { Product } from "../models/ProductListingPage";
import { Page } from '@playwright/test';


export class ProductListingPage implements IProductListingPage {

    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async getProductList(endPoint: string, token: string): Promise<Product[]> {
        if (!token) {
            throw new Error('Token is required to fetch products.');
        }

        const endpointPath = endPoint.startsWith('/') ? endPoint : `/${endPoint}`;
        const origin = new URL(this.page.url()).origin;

        const urlsToTry = [
            `${origin}${endpointPath}`,
            `${origin}/client${endpointPath}`,
        ];

        const authHeaders = [
            { Authorization: token, 'Content-Type': 'application/json' },
            { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        ];

        const errors: string[] = [];

        for (const apiUrl of urlsToTry) {
            for (const headers of authHeaders) {
                const postResponse = await this.page.request.post(apiUrl, {
                    headers,
                    data: {},
                });

                if (postResponse.ok()) {
                    const postData = await postResponse.json();
                    const postProducts = Array.isArray(postData?.data) ? postData.data : [];

                    if (postProducts.length === 0) {
                        throw new Error(`Product API returned empty list. URL: ${apiUrl}`);
                    }

                    return postProducts;
                }

                errors.push(`POST ${apiUrl} -> ${postResponse.status()}`);

                const getResponse = await this.page.request.get(apiUrl, {
                    headers: { Authorization: headers.Authorization },
                });

                if (getResponse.ok()) {
                    const getData = await getResponse.json();
                    const getProducts = Array.isArray(getData?.data) ? getData.data : [];

                    if (getProducts.length === 0) {
                        throw new Error(`Product API returned empty list. URL: ${apiUrl}`);
                    }

                    return getProducts;
                }

                errors.push(`GET ${apiUrl} -> ${getResponse.status()}`);
            }
        }

        throw new Error(`Failed to fetch product list. Attempts: ${errors.join(', ')}`);
    }
}