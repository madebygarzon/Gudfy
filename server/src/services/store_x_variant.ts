import { Lifetime } from "awilix";
import { TransactionBaseService, Customer } from "@medusajs/medusa";
import SerialCodeRepository from "../repositories/serial-code";
import StoreXVariantRepository from "../repositories/store-x-variant";
import ProductRepository from "@medusajs/medusa/dist/repositories/product";
import ProductVariantRepository from "@medusajs/medusa/dist/repositories/product-variant";
import StoreService from "./store";

class StoreXVariantService extends TransactionBaseService {
  static LIFE_TIME = Lifetime.SCOPED;
  protected readonly serialCodeRepository_: typeof SerialCodeRepository;
  protected readonly storeXVariantRepository_: typeof StoreXVariantRepository;
  protected readonly loggedInCustomer_: Customer | null;

  constructor(container, options) {
    // @ts-expect-error prefer-rest-params
    super(...arguments);

    try {
      this.loggedInCustomer_ = container.loggedInCustomer;
      this.storeXVariantRepository_ = container.storeXVariantRepository;
      this.serialCodeRepository_ = container.serialCodeRepository;
    } catch (e) {
      // avoid errors when backend first runs
    }
  }
  async getStoreVariant(id_SPV) {
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
        "sxv.ammount_store AS amount",
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
  async list() {
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
        "sxv.ammount_store AS amount",
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
          ammount_store: data.amount,
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
