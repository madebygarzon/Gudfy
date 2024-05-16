import { Lifetime } from "awilix";
import {
  StoreService as MedusaStoreService,
  TransactionBaseService,
  Product,
} from "@medusajs/medusa";
import ProductRepository from "@medusajs/medusa/dist/repositories/product";
import ProductVariantRepository from "@medusajs/medusa/dist/repositories/product-variant";

class StoreProductVariantService extends TransactionBaseService {
  static LIFE_TIME = Lifetime.SCOPED;
  protected readonly productRepository_: typeof ProductRepository;
  protected readonly productVariantRepository_: typeof ProductVariantRepository;

  constructor(container, options) {
    // @ts-expect-error prefer-rest-params
    super(...arguments);
    this.productRepository_ = container.productRepository;
    this.productVariantRepository_ = container.productVariantRepository;
  }

  async list() {
    const product = this.manager_.withRepository(this.productRepository_);
    const listProduct = await product.find();

    const variant = this.manager_.withRepository(
      this.productVariantRepository_
    );
    const listVariant = await variant.find();

    const ListProductVariant = listVariant.map((v) => {
      const theProduct = listProduct.find((p) => p.id === v.product_id);
      return {
        id: v.id,
        titulo: theProduct.title,
        decription: theProduct.description,
        thumbnail: theProduct.thumbnail,
        titleVariant: v.title,
        product_id: v.product_id,
      };
    });

    return ListProductVariant;
  }
}

export default StoreProductVariantService;
