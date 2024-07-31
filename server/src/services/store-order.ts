import { Lifetime } from "awilix";
import { LessThan } from "typeorm";
import {
  AdminPostCollectionsCollectionReq,
  TransactionBaseService,
} from "@medusajs/medusa";
import StoreOrderRepository from "../repositories/store-order";
import StoreVariantOrderRepository from "../repositories/store-variant-order";
import StoreXVariantRepository from "../repositories/store-x-variant";

class StoreOrderService extends TransactionBaseService {
  static LIFE_TIME = Lifetime.SCOPED;
  protected readonly storeOrderRepository_: typeof StoreOrderRepository;
  protected readonly storeVariantOrderRepository_: typeof StoreVariantOrderRepository;
  protected readonly storeXVariantRepository_: typeof StoreXVariantRepository;

  constructor(container) {
    // @ts-expect-error prefer-rest-params
    super(...arguments);
    this.storeOrderRepository_ = container.storeOrderRepository;
    this.storeVariantOrderRepository_ = container.storeVariantOrderRepository;
    this.storeXVariantRepository_ = container.storeXVariantRepository;
  }

  async listCustomerOrders(customerId) {
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
      .where("so.customer_id = :customer_id ", { customer_id: customerId })
      .select([
        "so.id AS id",
        "so.pay_method_id AS pay_method_id ",
        "so.SellerApproved AS SellerApproved",
        "so.CustomerApproved AS CustomerApproved",
        "so.quantity_products AS quantity_products ",
        "so.total_price AS total_price",
        "so.name AS person_name",
        "so.last_name AS person_last_name",
        "so.email AS email",
        "so.conty AS conty",
        "so.city AS city",
        "so.phone AS phone",
        "so.created_at AS created_at",
        "svo.quantity AS quantity",
        "svo.total_price AS total_price_for_product",
        "sso.state AS state_order",
        "pv.title AS produc_title",
        "sxv.price AS price",
        "s.name AS store_name",
      ])
      .getRawMany();

    const orderMap = new Map();

    listOrder.forEach((order) => {
      const {
        produc_title,
        store_name,
        price,
        quantity,
        total_price_for_product,
        ...rest
      } = order;
      if (!orderMap.has(order.id)) {
        orderMap.set(order.id, { ...rest, store_variant: [] });
      }
      orderMap.get(order.id).store_variant.push({
        produc_title,
        quantity,
        total_price_for_product,
        price,
        store_name,
      });
    });

    return Array.from(orderMap.values());
  }

  async deleteOrder(idStoreOrder) {
    const repoStoreOrder = this.activeManager_.withRepository(
      this.storeOrderRepository_
    );
    const repoStoreVariantOrder = this.activeManager_.withRepository(
      this.storeVariantOrderRepository_
    );
    const repoStoreXVariant = this.activeManager_.withRepository(
      this.storeXVariantRepository_
    );

    const order = await repoStoreOrder.findOne({ where: { id: idStoreOrder } });
    if (!order) {
      throw new Error(`Orden con id ${idStoreOrder} no existe`);
    }
    await this.restaureStock(
      repoStoreXVariant,
      repoStoreVariantOrder,
      idStoreOrder
    );
    if (order.customer_id)
      return repoStoreOrder.update(order.id, { order_status_id: "Cancel_ID" });
    return await repoStoreOrder.remove(order);
  }

  async getOrdersCreatedBefore(date) {
    const repoStoreOrder = this.activeManager_.withRepository(
      this.storeOrderRepository_
    );

    return await repoStoreOrder.find({
      where: {
        created_at: LessThan(date),
        order_status_id: "Payment_Pending_ID",
      },
    });
  }

  private async restaureStock(
    repoStoreXVariant,
    repoStoreVariantOrder,
    idStoreOrder
  ) {
    const storeVariants = await repoStoreVariantOrder.find({
      where: {
        store_order_id: idStoreOrder,
      },
    });

    for (let index = 0; index < storeVariants.length; index++) {
      const storexVariant = await repoStoreXVariant.findOne({
        where: {
          id: storeVariants[index].store_variant_id,
        },
      });

      await repoStoreXVariant.update(storeVariants[index].store_variant_id, {
        quantity_store:
          storexVariant.quantity_store + storeVariants[index].quantity,
        quantity_reserved:
          storexVariant.quantity_reserved - storeVariants[index].quantity,
      });
    }
  }

  async updateCancelStoreOrder(orderId) {
    const repoStoreOrder = this.activeManager_.withRepository(
      this.storeOrderRepository_
    );
    const cancelOrder = await repoStoreOrder.update(orderId, {
      order_status_id: "Cancel_ID",
    });
  }
}

export default StoreOrderService;
