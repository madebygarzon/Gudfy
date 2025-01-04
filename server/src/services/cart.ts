import { Lifetime } from "awilix";
import {
  FindConfig,
  CartService as MedusaCartService,
  Store,
  Customer,
  Cart,
} from "@medusajs/medusa";
import StoreXVariantRepository from "../repositories/store-x-variant";
import { StoreReviewRepository } from "../repositories/store-review";

class CartService extends MedusaCartService {
  static LIFE_TIME = Lifetime.SCOPED;

  constructor(container, options) {
    // @ts-expect-error prefer-rest-params
    super(...arguments);
  }

  async updateUnitPrices_(cart, regionId, customer_id) {
    return;
  }

  async removeLineItem(cartId: string, lineItemId: string): Promise<Cart> {
    return;
  }
}

export default CartService;
