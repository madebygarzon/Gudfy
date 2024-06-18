import { LineItem } from "@medusajs/medusa";

export declare module "@medusajs/medusa/dist/models/store" {
  declare interface Store {
    members?: Customer[];
    store_x_variant?: StoreXVariant[];
    reviews?: ProductReview[];
    store_line_items?: LineItem[];
  }
}

export declare module "@medusajs/medusa/dist/models/customer" {
  declare interface Customer {
    store_id?: string;
    store?: Store;
    role_id?: number;
    customerRole?: CustomerRole;
    sellerapplications?: SellerApplication[];
    sellerorder?: SellerApplication[];
    customerorder?: SellerApplication[];
  }
}

export declare module "@medusajs/medusa/dist/models/ProductVariant" {
  declare interface ProductVariant {
    store_x_variant?: StoreXVariant[];
  }
}

export declare module "@medusajs/medusa/dist/models/line_item" {
  declare interface LineItem {
    store_id?: string;
    store?: Store;
  }
}

// export declare module "@medusajs/medusa/dist/models/product" {
//   declare interface Product {
//     store_id?: string;
//     store?: Store;
//     typeVirtualProduct_id?: string;
//     typeVirtualProduct?: TypeVirtualProduct;
//   }
// }
