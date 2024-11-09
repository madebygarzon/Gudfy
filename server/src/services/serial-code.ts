import { Lifetime } from "awilix";
import SerialCodeRepository from "src/repositories/serial-code";
import { TransactionBaseService, Customer } from "@medusajs/medusa";

class SerialCodeService extends TransactionBaseService {
  static LIFE_TIME = Lifetime.SCOPED;
  protected readonly serialCodeRepository_: typeof SerialCodeRepository;
  protected readonly loggedInCustomer_: Customer | null;

  constructor(container) {
    // @ts-expect-error prefer-rest-params
    super(...arguments);
    this.serialCodeRepository_ = container.serialCodeRepository;
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
          statuses: ["Completed_ID", "Finished_ID"],
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
}
export default SerialCodeService;
