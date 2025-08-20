import { Lifetime } from "awilix";
import SerialCodeRepository from "src/repositories/serial-code";
import StoreXVariantRepository from "src/repositories/store-x-variant";
import { TransactionBaseService, Customer } from "@medusajs/medusa";
import { Not } from "typeorm";
import StoreXVariantService from "./store_x_variant";

class SerialCodeService extends TransactionBaseService {
  static LIFE_TIME = Lifetime.SCOPED;
  protected readonly serialCodeRepository_: typeof SerialCodeRepository;
  protected readonly storeXVariantRepository_: typeof StoreXVariantRepository;
  protected readonly storeXVariantService_: StoreXVariantService;
  protected readonly loggedInCustomer_: Customer | null;

  constructor(container) {
    // @ts-expect-error prefer-rest-params
    super(...arguments);
    this.storeXVariantService_ = container.storeXVariantService;
    this.serialCodeRepository_ = container.serialCodeRepository;
    this.storeXVariantRepository_ = container.storeXVariantRepository;
  }

  async listSerialCode() {
    const repoSerialCode = this.activeManager_.withRepository(
      this.serialCodeRepository_
    );

    try {
      const serialCodes = await repoSerialCode
        .createQueryBuilder("sc")
        .leftJoinAndSelect("sc.store_variant_order", "svo")
        .leftJoinAndSelect("svo.store_order", "so")
        .innerJoinAndSelect("sc.store_variant", "sxv")
        .innerJoinAndSelect("sxv.variant", "v")
        .innerJoinAndSelect("sxv.store", "s")
        // .innerJoinAndSelect("v.product", "p")
        .select([
          "sc.serial AS serial_code",
          "svo.id AS svo_id",
          "so.id AS so_id",
          "s.name AS store_name",
          "v.title AS product_name",
          "sc.created_at as created_at",
        ])
        .orderBy("sc.created_at", "DESC")
        .getRawMany();

      return serialCodes;
    } catch (error) {
      console.log(
        "error en el servicio de serial_codes para enlistar los productos comprados ",
        error
      );
    }
  }
}
export default SerialCodeService;
