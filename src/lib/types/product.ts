import { ReactNode } from "react";
import {
  ProductCollection,
  ProductSize,
  ProductStatus,
  ProductTag,
} from "../enums/product.enum";

export interface Product {
  _id: string;
  productStatus: ProductStatus;
  productCollection: ProductCollection;
  productName: string;
  productNameKo?: string;
  productPrice: number;
  productLeftCount: number;
  productSize: ProductSize;
  productVolume: number;
  productDesc?: string;
  productDescKo?: string;
  productTags: ProductTag[];
  productSortOrder: number;
  productImages: string[];
  productViews: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductInquiry {
  order: string;
  page: number;
  limit: number;
  productCollection?: ProductCollection;
  search?: string;
}
