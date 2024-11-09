import { Lifetime } from "awilix";
import { LessThan } from "typeorm";
import { TransactionBaseService, Customer } from "@medusajs/medusa";
import StoreOrderRepository from "../repositories/store-order";
import StoreVariantOrderRepository from "../repositories/store-variant-order";
import StoreXVariantRepository from "../repositories/store-x-variant";
import SerialCodeRepository from "src/repositories/serial-code";

class StoreOrderService extends TransactionBaseService {
  static LIFE_TIME = Lifetime.SCOPED;
  protected readonly storeOrderRepository_: typeof StoreOrderRepository;
  protected readonly storeVariantOrderRepository_: typeof StoreVariantOrderRepository;
  protected readonly storeXVariantRepository_: typeof StoreXVariantRepository;
  protected readonly serialCodeRepository_: typeof SerialCodeRepository;

  protected readonly loggedInCustomer_: Customer | null;

  constructor(container) {
    // @ts-expect-error prefer-rest-params
    super(...arguments);
    this.storeOrderRepository_ = container.storeOrderRepository;
    this.storeVariantOrderRepository_ = container.storeVariantOrderRepository;
    this.storeXVariantRepository_ = container.storeXVariantRepository;
    this.serialCodeRepository_ = container.serialCodeRepository;
    this.loggedInCustomer_ = container.loggedInCustomer || null;
  }

  async currnetOrder(customerId) {
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
        "so.quantity_products AS quantity_products ",
        "so.total_price AS total_price",
        "so.name AS person_name",
        "so.last_name AS person_last_name",
        "so.email AS email",
        "so.contry AS contry",
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

    const now = new Date();
    const tenMinutesInMillis = 10 * 60 * 1000;
    const validOrder = listOrder.find((order) => {
      if (order.state_order === "Pendiente de pago") {
        const createdAt = new Date(order.created_at);
        return now.getTime() - createdAt.getTime() < tenMinutesInMillis;
      }
    });

    if (!validOrder) {
      return null; // No hay pedidos que cumplan con la condición
    }

    const {
      produc_title,
      store_name,
      price,
      quantity,
      total_price_for_product,
      ...rest
    } = validOrder;

    const result = {
      ...rest,
      store_variant: [
        {
          produc_title,
          quantity,
          total_price_for_product,
          price,
          store_name,
        },
      ],
    };

    return result;
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
        "sso.state AS state_order",
        "pv.title AS produc_title",
        "sxv.price AS price",
        "s.name AS store_name",
        "s.id AS store_id",
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
        serial_code_products:
          order.status_id === "Completed_ID" ||
          order.status_id === "Finished_ID"
            ? await this.functionRecoverCodes(store_variant_order_id)
            : [],
      });
    }

    return Array.from(orderMap.values());
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

  async listSellerOrders(storeId) {
    const repoStoreOrder = this.activeManager_.withRepository(
      this.storeOrderRepository_
    );
    const listOrder = await repoStoreOrder
      .createQueryBuilder("so")
      .innerJoinAndSelect("so.order_status", "sso")
      .leftJoinAndSelect("so.storeVariantOrder", "svo")
      .leftJoinAndSelect("so.customer", "c")
      .leftJoinAndSelect("svo.store_variant", "sxv")
      .innerJoinAndSelect("sxv.variant", "pv")
      .where("sxv.store_id = :store_id", { store_id: storeId })
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
        "svo.id AS store_variant_order_id",
        "svo.quantity AS quantity",
        "svo.total_price AS total_price_for_product",
        "sso.state AS state_order",
        "pv.title AS produc_title",
        "sxv.price AS price",
        "c.first_name AS customer_name",
        "c.last_name AS customer_last_name",
      ])
      .getRawMany();
    return listOrder;
  }

  async listSellerPayOrders() {
    const repoStoreOrder = this.activeManager_.withRepository(
      this.storeOrderRepository_
    );
    const listOrder = await repoStoreOrder
      .createQueryBuilder("so")
      .leftJoinAndSelect("so.storeVariantOrder", "svo")
      .leftJoinAndSelect("svo.variant_order_status", "vos")
      .leftJoinAndSelect("so.customer", "c")
      .leftJoinAndSelect("svo.store_variant", "sxv")
      .innerJoinAndSelect("sxv.variant", "pv")
      .where("sxv.store_id = :store_id", {
        store_id: this.loggedInCustomer_.store_id,
      })
      .select([
        "so.id AS number_order",
        "so.created_at AS created_date",
        "svo.id AS store_variant_order_id",
        "svo.total_price AS total_price_for_product",
        "svo.quantity AS quantity",
        "vos.state AS state",
        "pv.title AS produc_title",
        "sxv.price AS unit_price",
        "c.first_name AS customer_name",
        "c.last_name AS customer_last_name",
      ])
      .getRawMany();
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

  async updateOrderData(store_order_id, dataForm) {
    try {
      if (dataForm.pay_method_id === "automatic_binance_pay") {
        dataForm = {
          ...dataForm,
          pay_method_id: "Secondary_Method_BINANCE_ID",
        };
      }

      const repoStoreOrder = this.activeManager_.withRepository(
        this.storeOrderRepository_
      );

      const updateData = await repoStoreOrder.update(store_order_id, {
        ...dataForm,
      });
      return true;
    } catch (error) {
      console.log("error al actualizar la orden", error);
    }
  }

  async updateStatus(orderId, order_status) {
    const repoStoreOrder = this.activeManager_.withRepository(
      this.storeOrderRepository_
    );
    const storeVariantOrder = this.activeManager_.withRepository(
      this.storeVariantOrderRepository_
    );
    const cancelOrder = await repoStoreOrder.update(orderId, {
      order_status_id: order_status,
    });
    if (order_status === "Finished_ID") {
      const updateVariantOrder = await storeVariantOrder.update(
        {
          store_order_id: orderId,
        },
        {
          variant_order_status_id: "Finished_ID",
        }
      );
    }

    return cancelOrder;
  }

  async updateCancelStoreOrder(orderId) {
    const repoStoreOrder = this.activeManager_.withRepository(
      this.storeOrderRepository_
    );
    const repoStoreVariantOrder = this.activeManager_.withRepository(
      this.storeVariantOrderRepository_
    );
    const repoStoreXVariant = this.activeManager_.withRepository(
      this.storeXVariantRepository_
    );

    await this.restaureStock(repoStoreXVariant, repoStoreVariantOrder, orderId);

    const cancelOrder = await repoStoreOrder.update(orderId, {
      order_status_id: "Cancel_ID",
    });
  }

  async getListSerialCodeforCustomer() {
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
      .where("so.customer_id = :customer_id ", {
        customer_id: this.loggedInCustomer_.id,
      })
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
        "svo.id AS store_variant_order_id",
        "svo.quantity AS quantity",
        "svo.total_price AS total_price_for_product",
        "sso.state AS state_order",
        "pv.title AS produc_title",
        "sxv.price AS price",
        "s.name AS store_name",
        "s.id AS store_id",
      ])
      .getRawMany();

    const orderMap = new Map();

    listOrder.forEach((order) => {
      const {
        store_id,
        store_name,
        store_variant_order_id,
        produc_title,
        price,
        quantity,
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
      });
    });
    return Array.from(orderMap.values());
  }
}

export default StoreOrderService;
