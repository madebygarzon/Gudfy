import { Lifetime } from "awilix";
import { TransactionBaseService, Customer } from "@medusajs/medusa";
import SerialCodeRepository from "../repositories/serial-code";
import StoreXVariantRepository from "../repositories/store-x-variant";
import ProductRepository from "@medusajs/medusa/dist/repositories/product";
import ProductVariantRepository from "@medusajs/medusa/dist/repositories/product-variant";
import StoreService from "./store";
import { map } from "zod";

class StoreXVariantService extends TransactionBaseService {
  static LIFE_TIME = Lifetime.SCOPED;
  protected readonly serialCodeRepository_: typeof SerialCodeRepository;
  protected readonly storeXVariantRepository_: typeof StoreXVariantRepository;
  protected readonly loggedInCustomer_: Customer | null;

  constructor(container, options) {
    // @ts-expect-error prefer-rest-params
    super(...arguments);

    try {
      this.loggedInCustomer_ = container.loggedInCustomer || "";
      this.storeXVariantRepository_ = container.storeXVariantRepository;
      this.serialCodeRepository_ = container.serialCodeRepository;
    } catch (e) {
      // avoid errors when backend first runs
    }
  }

  async product(variantProduct) {
    try {
      const productV = this.manager_.withRepository(
        this.storeXVariantRepository_
      );

      const rawVariants = await productV
        .createQueryBuilder("sxv")
        .innerJoinAndSelect("sxv.variant", "pv")
        .innerJoinAndSelect("pv.product", "p")
        .innerJoinAndSelect("sxv.store", "s")
        .leftJoinAndSelect("s.members", "c")
        .where("pv.title = :title ", {
          title: variantProduct,
        })
        .select([
          "sxv.id AS id",
          "sxv.quantity_store AS quantity",
          "sxv.price AS price",
          "pv.id AS variantid",
          "pv.title AS titlevariant",
          "p.title AS productparent",
          "p.thumbnail AS thumbnail",
          "p.description AS description",
          "s.id AS store_id",
          "s.name AS store_name",
          "c.email AS customer_email",
        ])
        .getRawMany();

      const variantMap = new Map();

      rawVariants.forEach((variant) => {
        if (!variantMap.has(variant.variantid)) {
          variantMap.set(variant.variantid, {
            id: variant.variantid,
            title: variant.titlevariant,
            description: variant.description,
            thumbnail: variant.thumbnail,
            productparent: variant.productparent,
            sellers: [
              {
                store_variant_id: variant.id,
                store_id: variant.store_id,
                store_name: variant.store_name,
                email: variant.customer_email,
                quantity: variant.quantity,
                price: variant.price,
              },
            ],
          });
        } else
          variantMap.get(variant.variantid).sellers.push({
            store_variant_id: variant.id,
            store_id: variant.store_id,
            store_name: variant.store_name,
            email: variant.customer_email,
            quantity: variant.quantity,
            price: variant.price,
          });
      });

      const listSellerxVariant = Array.from(variantMap.values());

      listSellerxVariant.forEach((variant) => {
        variant.sellers.sort((a, b) => a.price - b.price);
      });

      return listSellerxVariant[0];
    } catch (error) {
      console.log(error);
    }
  }

  async listSellersVariant() {
    const productV = this.manager_.withRepository(
      this.storeXVariantRepository_
    );

    const product = await productV
      .createQueryBuilder("sxv")
      .innerJoinAndSelect("sxv.variant", "pv")
      .innerJoinAndSelect("pv.product", "p")
      .innerJoinAndSelect("sxv.store", "s") // Relacionar StoreXVariant con Store
      .leftJoinAndSelect("s.members", "c") // Left join Store con Customer
      .select([
        "sxv.id AS id",
        "sxv.quantity_store AS quantity",
        "sxv.price AS price",
        "pv.id AS variantID",
        "pv.title AS titleVariant",
        "p.title AS productParent",
        "p.thumbnail AS thumbnail",
        "p.description AS desciption",
        "s.id AS storeID",
        "s.name AS storeName",
        "c.id AS customerID",
        "c.email AS customerEmail",
      ])
      .getRawMany();

    return product;
  }

  async listStoreVariant(id_SPV) {
    const productV = this.manager_.withRepository(
      this.storeXVariantRepository_
    );

    const Product = await productV
      .createQueryBuilder("sxv")
      .innerJoinAndSelect("sxv.variant", "pv")
      .innerJoinAndSelect("pv.product", "p")
      .where("sxv.store_id = :storeId AND sxv.id = :storeVariantId", {
        storeId: this.loggedInCustomer_.store_id,
        storeVariantId: id_SPV,
      })
      .select([
        "sxv.id AS id",
        "sxv.quantity_store AS quantity",
        "sxv.price AS price",
        "pv.id AS variantID",
        "pv.title AS titleVariant",
        "p.title AS parentTitle",
        "p.thumbnail AS thumbnail",
        "p.description AS desciption",
      ])
      .getRawMany();
    return Product;
  }
  async listxSeller() {
    const productV = this.manager_.withRepository(
      this.storeXVariantRepository_
    );
    const listProduct = await productV
      .createQueryBuilder("sxv")
      .innerJoinAndSelect("sxv.variant", "pv")
      .innerJoinAndSelect("pv.product", "p")
      .where("sxv.store_id = :storeId", {
        storeId: this.loggedInCustomer_.store_id,
      })
      .select([
        "sxv.id AS storeXVariantId",
        "sxv.quantity_store AS quantity",
        "sxv.price AS price",
        "sxv.store_id AS storeId",
        "sxv.variant_id AS variantId",
        "pv.id AS productVariantId",
        "pv.title AS productVariantTitle",
        "pv.product_id AS productId",
        "p.title AS productTitle",
        "p.thumbnail AS thumbnail",
        "p.description AS description",
      ])
      .getRawMany();

    return listProduct;
  }
  async add(dataAddProduct) {
    try {
      const storeXVaraintRepository = this.manager_.withRepository(
        this.storeXVariantRepository_
      );
      const serialCodeRepository = this.manager_.withRepository(
        this.serialCodeRepository_
      );

      for (let i = 0; i < dataAddProduct.length; i++) {
        const data = dataAddProduct[i];
        const productCreate = await storeXVaraintRepository.create({
          store_id: this.loggedInCustomer_.store_id,
          variant_id: data.variantID,
          price: data.price,
          quantity_store: data.quantity,
        });
        const productSave = await storeXVaraintRepository.save(productCreate);

        data.codes.forEach(async (code) => {
          const productCode = await serialCodeRepository.create({
            serial: code,
            store_variant_id: productSave.id,
          });
          const productCodeSave = await serialCodeRepository.save(productCode);
        });
      }

      return "products added correctly";
    } catch (error) {
      console.log("ERROR EN EL SERVICIO AL AGREGAR LOS PRODUCTOS", error);
    }
  }
}

export default StoreXVariantService;
