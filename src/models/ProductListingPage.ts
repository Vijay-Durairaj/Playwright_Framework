export interface Product {
    data: Data[];
    count: number;
    message: string;
}

export interface Data {
    id: string;
    productName: string;
    productCategory: string;
    productSubCategory: string;
    productPrice: number;
    productDescription: string;
    productImage: string;
    productRating: string;
    productTotalOrders: string;
    productStatus: boolean;
    productFor: string;
    productAddedBy: string;
}