import { Lifetime } from "awilix";

import { TransactionBaseService } from "@medusajs/medusa";
import StoreOrderRepository from "../repositories/store-order";
import StoreVariantOrderRepository from "../repositories/store-variant-order";
import StoreXVariantRepository from "../repositories/store-x-variant";
import SerialCodeRepository from "src/repositories/serial-code";

class StoreOrderAdminService extends TransactionBaseService {
  static LIFE_TIME = Lifetime.SCOPED;
  protected readonly storeOrderRepository_: typeof StoreOrderRepository;
  protected readonly storeVariantOrderRepository_: typeof StoreVariantOrderRepository;
  protected readonly storeXVariantRepository_: typeof StoreXVariantRepository;
  protected readonly serialCodeRepository_: typeof SerialCodeRepository;

  constructor(container) {
    // @ts-expect-error prefer-rest-params
    super(...arguments);
    this.storeOrderRepository_ = container.storeOrderRepository;
    this.storeVariantOrderRepository_ = container.storeVariantOrderRepository;
    this.storeXVariantRepository_ = container.storeXVariantRepository;
    this.serialCodeRepository_ = container.serialCodeRepository;
  }

  async listCustomersOrders() {
    try {
      const repoStoreOrder = this.activeManager_.withRepository(
        this.storeOrderRepository_
      );
      const listOrder = await repoStoreOrder
        .createQueryBuilder("so")
        .innerJoinAndSelect("so.order_status", "sso")
        .leftJoinAndSelect("so.storeVariantOrder", "svo")
        .leftJoinAndSelect("svo.store_variant", "sxv")
        .innerJoinAndSelect("sxv.variant", "pv")
        .leftJoinAndSelect("sxv.store", "s")
        .leftJoinAndSelect("s.members", "c")
        .select([
          "so.id AS id",
          "so.pay_method_id AS pay_method_id ",
          "so.quantity_products AS quantity_products ",
          "so.total_price AS total_price",
          "so.name AS person_name",
          "so.last_name AS person_last_name",
          "so.email AS email",
          "so.contry AS contry",
          "so.city AS city",
          "so.phone AS phone",
          "so.created_at AS created_at",
          "so.order_status_id AS status_id",
          "svo.id AS store_variant_order_id",
          "svo.quantity AS quantity",
          "svo.total_price AS total_price_for_product",
          "svo.variant_order_status_id AS variant_order_status_id",
          "sso.state AS state_order",
          "pv.title AS produc_title",
          "sxv.price AS price",
          "s.name AS store_name",
          "s.id AS store_id",
          "c.first_name AS person_name",
          "c.last_name AS person_last_name",
          "c.email AS email",
        ])
        .getRawMany();

      const orderMap = new Map();

      for (const order of listOrder) {
        const {
          store_id,
          store_name,
          store_variant_order_id,
          produc_title,
          price,
          quantity,
          variant_order_status_id,
          total_price_for_product,
          ...rest
        } = order;
        if (!orderMap.has(order.id)) {
          orderMap.set(order.id, { ...rest, store_variant: [] });
        }

        orderMap.get(order.id).store_variant.push({
          store_id,
          store_name,
          store_variant_order_id,
          produc_title,
          price,
          quantity,
          total_price_for_product,
          variant_order_status_id,
          serial_code_products:
            order.status_id === "Completed_ID" ||
            order.status_id === "Finished_ID" ||
            order.status_id === "Discussion_ID"
              ? await this.functionRecoverCodes(store_variant_order_id)
              : [],
        });
      }
      const returnArray = Array.from(orderMap.values());
      returnArray.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      return returnArray;
    } catch (error) {}
  }

  async functionRecoverCodes(store_variant_order_id) {
    const repoSerialCode = this.activeManager_.withRepository(
      this.serialCodeRepository_
    );

    const serialCodesForProduct = await repoSerialCode.find({
      where: {
        store_variant_order_id,
      },
    });
    return serialCodesForProduct;
  }
}

export default StoreOrderAdminService;
