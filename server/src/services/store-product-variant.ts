import { Lifetime } from "awilix";
import {
  StoreService as MedusaStoreService,
  TransactionBaseService,
  Customer,
} from "@medusajs/medusa";
import ProductRepository from "@medusajs/medusa/dist/repositories/product";
import StoreXVariantRepository from "../repositories/store-x-variant";
import SerialCodeRepository from "../repositories/serial-code";
import ProductVariantRepository from "@medusajs/medusa/dist/repositories/product-variant";
import { formatPrice } from "./utils/format-price";

class StoreProductVariantService extends TransactionBaseService {
  static LIFE_TIME = Lifetime.SCOPED;
  protected readonly productRepository_: typeof ProductRepository;
  protected readonly productVariantRepository_: typeof ProductVariantRepository;
  protected readonly storeXVariantRepository_: typeof StoreXVariantRepository;
  protected readonly loggedInCustomer_: Customer | null;
  protected readonly serialCodeRepository_: typeof SerialCodeRepository;

  constructor(container, options) {
    // @ts-expect-error prefer-rest-params
    super(...arguments);
    try {
      this.loggedInCustomer_ = container.loggedInCustomer;
      this.productRepository_ = container.productRepository;
      this.storeXVariantRepository_ = container.storeXVariantRepository;
      this.productVariantRepository_ = container.productVariantRepository;
      this.serialCodeRepository_ = container.serialCodeRepository;
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
    const listProduct = await product.find({
      relations: {
        product_comission: true,
      },
    });
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
        commission: Number(theProduct.product_comission.percentage),
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
    try {
      const variantRepository = this.manager_.withRepository(
        this.productVariantRepository_
      );
      const serialCodeRepository = this.manager_.withRepository(
        this.serialCodeRepository_
      );

      const rawVariants = await variantRepository
        .createQueryBuilder("pv")
        .innerJoin("pv.store_x_variant", "sxv")
        .innerJoinAndSelect("pv.product", "p")
        .innerJoinAndSelect("p.product_comission", "pc")
        .innerJoinAndSelect("p.categories", "ca")
        .where("COALESCE(sxv.quantity_store, 0) > 0")
        .andWhere("p.status = 'published'")
        .select([
          "sxv.id AS sxv_id",
          "pv.id AS id",
          "pv.title AS title",
          "sxv.price AS price",
          "p.id AS product_id",
          "p.title AS product_parent",
          "p.thumbnail AS thumbnail",
          "p.description AS description",
          "pc.percentage AS commission",
          "ca.id AS category_id",
          "ca.name AS category_name",
        ])
        .getRawMany();

      const salesCounts = await serialCodeRepository
        .createQueryBuilder("sc")
        .select("sc.store_variant_id", "store_variant_id")
        .addSelect("COUNT(sc.id)", "sales_count")
        .where("sc.store_variant_order_id IS NOT NULL")
        .groupBy("sc.store_variant_id")
        .getRawMany();
        
      const salesCountMap = new Map();
      salesCounts.forEach((item) => {
        salesCountMap.set(item.store_variant_id, parseInt(item.sales_count, 10));
      });

      const variantMap = new Map();
      const productSalesMap = new Map();

      rawVariants.forEach((variant) => {
        const number_of_sales = salesCountMap.get(variant.sxv_id) || 0;
        
        if (!productSalesMap.has(variant.product_id)) {
          productSalesMap.set(variant.product_id, number_of_sales);
        } else {
          productSalesMap.set(
            variant.product_id, 
            productSalesMap.get(variant.product_id) + number_of_sales
          );
        }

        if (!variantMap.has(variant.id)) {
          variantMap.set(variant.id, {
            ...variant,
            prices: [formatPrice(variant.price * (1 + Number(variant.commission)))],
            categories: [{id: variant.category_id, name: variant.category_name}],
            number_of_sales: number_of_sales
          });
        } else {
          variantMap.get(variant.id).prices.push(formatPrice(variant.price * (1 + Number(variant.commission))));
          variantMap.get(variant.id).categories.push({id: variant.category_id, name: variant.category_name});
          variantMap.get(variant.id).number_of_sales += number_of_sales;
        }
      });

      const listVariant = Array.from(variantMap.values()).map((variant) => {
        return {
          ...variant,
          prices: variant.prices.sort((a, b) => a - b),
          number_of_sales: variant.number_of_sales,
        };
      });

      const sortedListVariant = listVariant.sort((a, b) => b.number_of_sales - a.number_of_sales);


      return sortedListVariant;
    } catch (error) {
      console.log("error al devolver los productos", error);
    }
  }
}

export default StoreProductVariantService;
