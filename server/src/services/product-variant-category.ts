import { Lifetime } from "awilix";
import RequesProductRepository from "../repositories/request-product";
import ProductCategoryRepository from "@medusajs/medusa/dist/repositories/product-category";

import {
  TransactionBaseService,
  Customer,
  AuthService,
} from "@medusajs/medusa";
import { count } from "console";

class ProductVariantCategoryService extends TransactionBaseService {
  static LIFE_TIME = Lifetime.SCOPED;
  protected readonly productCategoryRepository_: typeof ProductCategoryRepository;
  protected readonly requestProductRepository_: typeof RequesProductRepository;

  constructor(container) {
    // @ts-expect-error prefer-rest-params
    super(...arguments);
    this.productCategoryRepository_ = container.productCategoryRepository;
    this.requestProductRepository_ = container.requestProductRepository;
  }

  async listVariantsCategory(limit, offset, category_id) {
    try {
      const repoCategory = await this.activeManager_.withRepository(
        this.productCategoryRepository_
      );

      const listVariant = await repoCategory
        .createQueryBuilder("ctgry")
        .innerJoinAndSelect("ctgry.products", "p")
        .innerJoinAndSelect("p.variants", "v")
        .innerJoinAndSelect("v.store_x_variant", "sxv")
        .where("ctgry.id = :category_id", { category_id })
        .andWhere("COALESCE(sxv.quantity_store, 0) > 0")
        .select([
          "v.id",
          "v.title AS title",
          "p.title AS parent_title",
          "p.thumbnail AS thumbnail ",
        ])
        .groupBy("v.id, v.title, p.title, p.thumbnail")
        .skip(offset)
        .take(limit)
        .getRawMany();

      return { products: listVariant, count: 0, offset };
    } catch (error) {
      console.log(error);
    }
  }
}
export default ProductVariantCategoryService;
