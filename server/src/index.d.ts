export declare module "@medusajs/medusa/dist/models/store" {
  declare interface Store {
    members?: User[];
    products?: Product[];
  }
}

export declare module "@medusajs/medusa/dist/models/customer" {
  declare interface Customer {
    store_id?: string;
    store?: Store;
    role_id?: number;
    customerRole?: CustomerRole;
    sellerapplication?: SellerApplication[];
  }
}

export declare module "@medusajs/medusa/dist/models/product" {
  declare interface Product {
    store_id?: string;
    store?: Store;
  }
}

export declare module "@medusajs/medusa/dist/models/CustomerRole" {
  declare interface CustomerRole {
    role_id: number;
    nameRole: string;
  }
}
export declare module "@medusajs/medusa/dist/models/selleapplication" {
  declare interface SellerApplication {
    customer_id: string;
    customer: Customer;
    identification_number: string;
    address: string;
    approved: boolean;
    rejected: boolean;
  }
}
