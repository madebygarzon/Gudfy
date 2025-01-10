import { Lifetime } from "awilix";
import { LessThan } from "typeorm";
import { TransactionBaseService, Customer } from "@medusajs/medusa";
import StoreOrderRepository from "../repositories/store-order";
import StoreVariantOrderRepository from "../repositories/store-variant-order";
import StoreXVariantRepository from "../repositories/store-x-variant";

class JobsService extends TransactionBaseService {
  static LIFE_TIME = Lifetime.SCOPED;
  protected readonly storeOrderRepository_: typeof StoreOrderRepository;
  protected readonly storeVariantOrderRepository_: typeof StoreVariantOrderRepository;
  protected readonly storeXVariantRepository_: typeof StoreXVariantRepository;

  constructor({
    storeOrderRepository,
    storeVariantOrderRepository,
    storeXVariantRepository,
  }) {
    // @ts-expect-error prefer-rest-params
    super(...arguments);
    this.storeOrderRepository_ = storeOrderRepository;
    this.storeVariantOrderRepository_ = storeVariantOrderRepository;
    this.storeXVariantRepository_ = storeXVariantRepository;
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
    const storeVariantsOrder = await repoStoreVariantOrder.find({
      where: {
        store_order_id: idStoreOrder,
      },
    });

    for (let index = 0; index < storeVariantsOrder.length; index++) {
      const storexVariant = await repoStoreXVariant.findOne({
        where: {
          id: storeVariantsOrder[index].store_variant_id,
        },
      });

      await repoStoreXVariant.update(
        storeVariantsOrder[index].store_variant_id,
        {
          quantity_store:
            storexVariant.quantity_store + storeVariantsOrder[index].quantity,
          quantity_reserved:
            storexVariant.quantity_reserved -
            storeVariantsOrder[index].quantity,
        }
      );
    }
  }

  async getOrdersCompletedBefore(date) {
    try {
      const repoStoreOrder = this.activeManager_.withRepository(
        this.storeOrderRepository_
      );

      const listOrdersCompleted = await repoStoreOrder.find({
        where: {
          created_at: LessThan(date),
          order_status_id: "Completed_ID",
        },
      });

      for (const order of listOrdersCompleted) {
        console.log("orden " + order.id + " a finalizar");
        await this.updateOrdersCompleted(order);
        console.log("Actualizada...");
      }

      return true;
    } catch (error) {
      console.log(
        "Error al Actualizar las ordenes Completadas a Finalizadas",
        error
      );
    }
  }

  async updateOrdersCompleted(storeOrder) {
    const repoStoreOrder = this.activeManager_.withRepository(
      this.storeOrderRepository_
    );
    const repoStoreVariantOrder = this.activeManager_.withRepository(
      this.storeVariantOrderRepository_
    );

    const selectStoreVarianOrder = await repoStoreVariantOrder.find({
      where: {
        store_order_id: storeOrder.id,
      },
    });

    if (selectStoreVarianOrder.length) {
      const Ids = selectStoreVarianOrder.map((svo) => svo.id);
      await repoStoreVariantOrder.update(Ids, {
        store_variant_id: "Finished_ID",
      });
    }
    const updateOrder = await repoStoreOrder.update(storeOrder.id, {
      order_status_id: "Finished_ID",
    });
  }
}

export default JobsService;
