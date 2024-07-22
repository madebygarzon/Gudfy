import { Lifetime } from "awilix";
import { LessThan } from "typeorm";
import {
  AdminPostCollectionsCollectionReq,
  TransactionBaseService,
  Customer,
} from "@medusajs/medusa";
import StoreOrderRepository from "../repositories/store-order";
import StoreVariantOrderRepository from "../repositories/store-variant-order";
import StoreXVariantRepository from "../repositories/store-x-variant";

class StoreOrderService extends TransactionBaseService {
  static LIFE_TIME = Lifetime.SCOPED;
  protected readonly storeOrderRepository_: typeof StoreOrderRepository;
  protected readonly storeVariantOrderRepository_: typeof StoreVariantOrderRepository;
  protected readonly storeXVariantRepository_: typeof StoreXVariantRepository;
  protected readonly loggedInCustomer_: Customer | null;
  constructor({
    storeOrderRepository,
    storeVariantOrderRepository,
    storeXVariantRepository,
    loggedInCustomer,
  }) {
    super(arguments[0]);
    this.loggedInCustomer_ = loggedInCustomer || "";
    this.storeOrderRepository_ = storeOrderRepository;
    this.storeVariantOrderRepository_ = storeVariantOrderRepository;
    this.storeXVariantRepository_ = storeXVariantRepository;
  }

  async listCustomerOrders() {
    const repoStoreOrder = this.activeManager_.withRepository(
      this.storeOrderRepository_
    );
    const listOrder = await repoStoreOrder.find({
      where: { customer_id: this.loggedInCustomer_.id },
    });

    return listOrder;
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
}

export default StoreOrderService;
