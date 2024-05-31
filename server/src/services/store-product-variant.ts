import { Lifetime } from "awilix";
import {
  StoreService as MedusaStoreService,
  TransactionBaseService,
  Customer,
} from "@medusajs/medusa";
import ProductRepository from "@medusajs/medusa/dist/repositories/product";
import StoreXVariantRepository from "../repositories/store-x-variant";
import ProductVariantRepository from "@medusajs/medusa/dist/repositories/product-variant";

class StoreProductVariantService extends TransactionBaseService {
  static LIFE_TIME = Lifetime.SCOPED;
  protected readonly productRepository_: typeof ProductRepository;
  protected readonly productVariantRepository_: typeof ProductVariantRepository;
  protected readonly storeXVariantRepository_: typeof StoreXVariantRepository;
  protected readonly loggedInCustomer_: Customer | null;

  constructor(container, options) {
    // @ts-expect-error prefer-rest-params
    super(...arguments);
    try {
      this.loggedInCustomer_ = container.loggedInCustomer;
      this.productRepository_ = container.productRepository;
      this.storeXVariantRepository_ = container.storeXVariantRepository;
      this.productVariantRepository_ = container.productVariantRepository;
    } catch (e) {
      // avoid errors when backend first runs
    }
  }

  async list() {
    const product = this.manager_.withRepository(this.productRepository_);
    const variant = this.manager_.withRepository(
      this.productVariantRepository_
    );
    const storexvariant = this.manager_.withRepository(
      this.storeXVariantRepository_
    );

    const listProduct = await product.find();
    const listVariant = await variant.find();
    const obtainedProducts = await storexvariant.find({
      where: {
        store_id: this.loggedInCustomer_.store_id,
      },
    });

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

    const listFilter = ListProductVariant.filter((v) => {
      const obtained = obtainedProducts.find((pv) => pv.variant_id == v.id);
      if (obtained) return;
      return v;
    });

    return listFilter;
  }

  async listProductVariantWithSellers() {
    const variantRepository = this.manager_.withRepository(
      this.productVariantRepository_
    );

    const rawVariants = await variantRepository
      .createQueryBuilder("pv")
      .innerJoin("pv.store_x_variant", "sxv")
      .innerJoinAndSelect("pv.product", "p")
      .select([
        "pv.id AS id",
        "pv.title AS title",
        "sxv.price AS price",
        "p.title AS productparent",
        "p.thumbnail AS thumbnail",
        "p.description AS desciption",
      ])
      .getRawMany();

    const variantMap = new Map();

    rawVariants.forEach((variant) => {
      if (!variantMap.has(variant.id)) {
        variantMap.set(variant.id, {
          ...variant,
          prices: [variant.price],
        });
      } else variantMap.get(variant.id).prices.push(variant.price);
    });

    const listVariant = Array.from(variantMap.values());

    return listVariant;
  }
}

export default StoreProductVariantService;
