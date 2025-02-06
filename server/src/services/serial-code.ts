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
    this.loggedInCustomer_ = container.loggedInCustomer || null;
  }

  async recoverListSerialCode() {
    const repoSerialCode = this.activeManager_.withRepository(
      this.serialCodeRepository_
    );

    try {
      const serialCodes = await repoSerialCode
        .createQueryBuilder("sc")
        .innerJoinAndSelect("sc.store_variant_order", "svo")
        .innerJoinAndSelect("svo.store_order", "so")
        .innerJoinAndSelect("sc.store_variant", "sxv")
        .innerJoinAndSelect("sxv.variant", "v")
        .innerJoinAndSelect("sxv.store", "s")
        .innerJoinAndSelect("v.product", "p")
        .where("so.customer_id = :customer_id ", {
          customer_id: this.loggedInCustomer_.id,
        })
        .andWhere("so.order_status_id IN (:...statuses)", {
          statuses: ["Completed_ID", "Finished_ID", "Discussion_ID"],
        })
        .select([
          "sc.serial AS serial_code",
          "svo.id AS svo_id",
          "so.id AS so_id",
          "svo.quantity AS codes_ammount",
          "s.name AS store_name",
          "v.title AS product_name",
          "p.thumbnail AS thumbnail",
        ])
        .getRawMany();

      const serialMap = new Map();

      serialCodes.forEach((data) => {
        if (!serialMap.has(data.svo_id)) {
          serialMap.set(data.svo_id, {
            store_variant_order: data.svo_id,
            quantity: data.quantity,
            order_number: data.so_id,
            store_name: data.store_name,
            product_name: data.product_name,
            thumbnail: data.thumbnail,
            serial_codes: [data.serial_code],
          });
        } else {
          serialMap.get(data.svo_id).serial_codes.push(data.serial_code);
        }
      });

      const listSerialCodes = Array.from(serialMap.values());

      return listSerialCodes;
    } catch (error) {
      console.log(
        "error en el servicio de serial_codes para enlistar los productos comprados ",
        error
      );
    }
  }

  async addListCodesStoreVariant(dataCodes) {
    if (!dataCodes.codes.length) return;
    const repoSerialCode = this.activeManager_.withRepository(
      this.serialCodeRepository_
    );

    const repostoreVariant = this.activeManager_.withRepository(
      this.storeXVariantRepository_
    );

    for (const codes of dataCodes.codes) {
      const createCode = await repoSerialCode.create({
        serial: codes,
        store_variant_id: dataCodes.productvariantid,
      });
      await repoSerialCode.save(createCode);
    }

    await repostoreVariant.increment(
      { id: dataCodes.productvariantid },
      "quantity_store",
      dataCodes.codes.length
    );
    return true;
  }

  async getAvailableProductSerial(store_variant_id) {
    const repoSerialCode = this.activeManager_.withRepository(
      this.serialCodeRepository_
    );

    try {
      const serialCodes = await repoSerialCode
        .createQueryBuilder("sc")
        .leftJoinAndSelect("sc.store_variant_order", "svo")
        .where("sc.store_variant_id = :store_variant_id ", {
          store_variant_id: store_variant_id,
        })
        .select([
          "sc.serial AS serial",
          "sc.id AS id",
          "sc.store_variant_id AS store_variant_id",
          "sc.created_at AS created_at",
          "sc.store_variant_order_id AS store_variant_order_id",
          "svo.store_order_id AS store_order_id",
        ])
        .getRawMany();
      // const serialCodes = await repoSerialCode.find({
      //   where: {
      //     store_variant_id: store_variant_id,
      //     store_variant_order_id: null,
      //   },
      // });
      const data = serialCodes.map((data) => {
        return {
          ...data,
          store_variant_order_id: data.store_variant_order_id ? true : false,
        };
      });
      return data;
    } catch (error) {
      console.log(
        "error en el servicio de serial_codes para enlistar los productos del vendedor ",
        error
      );
    }
  }

  async deleteSerialCode(idSerialCodes: string[] | string) {
    const repoSerialCode = this.activeManager_.withRepository(
      this.serialCodeRepository_
    );

    const ids = Array.isArray(idSerialCodes) ? idSerialCodes : [idSerialCodes];

    const IdSerial = Array.isArray(idSerialCodes)
      ? idSerialCodes[0]
      : idSerialCodes;

    const serial = await repoSerialCode.findOneBy({
      id: IdSerial,
    });

    if (!ids || ids.length === 0) {
      throw new Error("El array de IDs de seriales está vacío.");
    }

    try {
      const deleteCodes = await repoSerialCode
        .createQueryBuilder()
        .delete()
        .where("id IN (:...ids)", { ids })
        .andWhere("store_variant_order_id IS NULL")
        .execute();

      const updateStock = await this.storeXVariantService_.updateProductStock(
        serial.store_variant_id
      );

      return deleteCodes;
    } catch (error) {
      console.error("Error al eliminar los seriales:", error);
      throw new Error(
        "No se pudieron eliminar los seriales. Intente nuevamente."
      );
    }
  }
}
export default SerialCodeService;
