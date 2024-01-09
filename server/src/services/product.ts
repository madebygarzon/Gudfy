import { Lifetime } from "awilix";
import {
  ProductService as MedusaProductService,
  Product,
  Customer,
} from "@medusajs/medusa";
import {
  CreateProductInput as MedusaCreateProductInput,
  FindProductConfig,
  ProductSelector as MedusaProductSelector,
} from "@medusajs/medusa/dist/types/product";

type ProductSelector = {
  store_id?: string;
} & MedusaProductSelector;

type CreateProductInput = {
  store_id?: string;
} & MedusaCreateProductInput;

class ProductService extends MedusaProductService {
  static LIFE_TIME = Lifetime.SCOPED;
  protected readonly loggedInCustomer_: Customer | null;

  constructor(container, options) {
    // @ts-expect-error prefer-rest-params
    super(...arguments);

    try {
      this.loggedInCustomer_ = container.loggedInCustomer;
    } catch (e) {
      // avoid errors when backend first runs
    }
  }

  async listAndCountSeller(): Promise<[Product[], number]> {
    let listproduct;

    const selector = { store_id: this.loggedInCustomer_.store_id };
    listproduct = await super.listAndCount(selector);

    return listproduct;
  }

  async retrieve(
    productId: string,
    config?: FindProductConfig
  ): Promise<Product> {
    config.relations = [...(config.relations || []), "store"];

    const product = await super.retrieve(productId, config);

    if (
      product.store?.id &&
      this.loggedInCustomer_?.store_id &&
      product.store.id !== this.loggedInCustomer_.store_id
    ) {
      // Throw error if you don't want a product to be accessible to other stores
      throw new Error("Product does not exist in store.");
    }

    return product;
  }

  async createProductStoreCustomer(
    productObject: CreateProductInput
  ): Promise<Product> {
    if (!productObject.store_id && !this.loggedInCustomer_?.store_id) {
      throw "No hay tienda a la cual relacionar";
    }
    productObject.store_id = this.loggedInCustomer_.store_id;
    return await super.create(productObject);
  }
}

export default ProductService;
