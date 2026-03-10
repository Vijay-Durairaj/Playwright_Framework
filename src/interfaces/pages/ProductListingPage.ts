import { Product } from "../../models/ProductListingPage";
export interface IProductListingPage {
    getProductList(endPoint: string, token: string): Promise<Product[]>;
}