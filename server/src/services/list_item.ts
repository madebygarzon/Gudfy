import { Lifetime } from "awilix";
import { TransactionBaseService } from "@medusajs/medusa";
import LineItemRepository from "../repositories/line-item";
import ProductVariantRepository from "@medusajs/medusa/dist/repositories/product-variant";
import { error } from "console";

type updateSellerAplication = {
  payload: string;
  customer_id: string;
};

export default class SellerApplicationService extends TransactionBaseService {
  static LIFE_TIME = Lifetime.SCOPED;
  protected readonly lineItemRepository_: typeof LineItemRepository;
  protected readonly productVariantRepository_: typeof ProductVariantRepository;

  constructor(container) {
    // @ts-expect-error prefer-rest-params
    super(...arguments);
    try {
      this.lineItemRepository_ = container.lineItemRepository_;
      this.productVariantRepository_ = container.productVariantRepository_;
    } catch (e) {
      // avoid errors when backend first runs
    }
  }

  async addItem(cartId, variant, store_id, quantity) {
    try {
      const lineItemRepo = this.activeManager_.withRepository(
        this.lineItemRepository_
      );

      const addItem = await lineItemRepo.create({
        cart_id: cartId,
        title: variant.title,
        description: variant.title,
        thumbnail: variant.thumbnail,
        unit_price: variant.price,
        variant_id: variant.id,
        quantity: quantity,
      });
      return addItem;
    } catch (error) {
      console.log("Error al agregar el itemen el servicio", error);
    }
  }
}
