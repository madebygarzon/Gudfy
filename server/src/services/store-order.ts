import { Lifetime } from "awilix";
import { In, LessThan } from "typeorm";
import { TransactionBaseService, Customer } from "@medusajs/medusa";
import StoreOrderRepository from "../repositories/store-order";
import StoreVariantOrderRepository from "../repositories/store-variant-order";
import StoreXVariantRepository from "../repositories/store-x-variant";
import SerialCodeRepository from "src/repositories/serial-code";
import DataMethodPaymentRepository from "src/repositories/data-method-payment";
import coinpal from "coinpal-sdk";
import { formatCommisionCoinpal } from "./utils/formatCommision";
import { formatPrice } from "./utils/format-price";
import CommissionService from "./commission"; // ⬅️ NUEVO

type RateCache = Map<string, number>; // variant_id → rate

class StoreOrderService extends TransactionBaseService {
  static LIFE_TIME = Lifetime.SCOPED;
  protected readonly storeOrderRepository_: typeof StoreOrderRepository;
  protected readonly storeVariantOrderRepository_: typeof StoreVariantOrderRepository;
  protected readonly storeXVariantRepository_: typeof StoreXVariantRepository;
  protected readonly serialCodeRepository_: typeof SerialCodeRepository;
  protected readonly dataMethodPaymentRepository_: typeof DataMethodPaymentRepository;
  protected readonly commissionService_: CommissionService; // ⬅️ NUEVO
  protected readonly loggedInCustomer_: Customer | null;

  // caché simple en memoria para evitar repetir query en un mismo request
  private rateCache_: RateCache = new Map();

  constructor(container) {
    // @ts-expect-error prefer-rest-params
    super(...arguments);
    this.storeOrderRepository_ = container.storeOrderRepository;
    this.storeVariantOrderRepository_ = container.storeVariantOrderRepository;
    this.storeXVariantRepository_ = container.storeXVariantRepository;
    this.serialCodeRepository_ = container.serialCodeRepository;
    this.loggedInCustomer_ = container?.loggedInCustomer ?? null;
    this.dataMethodPaymentRepository_ = container.dataMethodPaymentRepository;
    this.commissionService_ = container.resolve("commissionService");
  }

  /**
   * Devuelve la tasa de comisión usando caché local (por request)
   */
  private async getRateCached_(variantId: string): Promise<number> {
    if (!this.rateCache_.has(variantId)) {
      const rate = await this.commissionService_.getRate({ productId: variantId });
      this.rateCache_.set(variantId, rate);
    }
    return this.rateCache_.get(variantId) as number;
  }

  /** ================== MÉTODOS ================== */
  async currentOrder(store_order_id) {
    try {
      const repoStoreOrder = this.activeManager_.withRepository(this.storeOrderRepository_);
      const repoSerialCode = this.activeManager_.withRepository(this.serialCodeRepository_);

      const listOrder = await repoStoreOrder
        .createQueryBuilder("so")
        .leftJoin("so.storeVariantOrder", "svo")
        .leftJoin("svo.store_variant", "sxv")
        .innerJoinAndSelect("sxv.variant", "pv")
        .leftJoin("sxv.store", "s")
        .where("so.id = :store_order_id AND so.order_status_id = :status", {
          store_order_id,
          status: "Payment_Pending_ID",
        })
        .select([
          "so.id AS id",
          "so.pay_method_id AS pay_method_id",
          "so.quantity_products AS quantity_products",
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
          "pv.id AS variant_id", // ⬅️ NUEVO
          "pv.title AS produc_title",
          "svo.unit_price AS price",
          "s.name AS store_name",
          "s.id AS store_id",
        ])
        .getRawMany();

      const ordersMap = new Map();

      for (const order of listOrder) {
        // caché por variant
        const rate = await this.getRateCached_(order.variant_id);
        const priceWithFee = order.price * (1 + rate);

        if (!ordersMap.has(order.id)) {
          ordersMap.set(order.id, {
            id: order.id,
            pay_method_id: order.pay_method_id,
            created_at: order.created_at,
            quantity_products: order.quantity_products,
            total_price: order.total_price,
            person_name: order.person_name,
            person_last_name: order.person_last_name,
            email: order.email,
            contry: order.contry,
            city: order.city,
            phone: order.phone,
            state_order: "Pendiente de pago",
            store_variant: [],
          });
        }

        const serialCodes = await repoSerialCode.find({
          where: { store_variant_order_id: order.store_variant_order_id },
        });

        ordersMap.get(order.id).store_variant.push({
          store_id: order.store_id,
          store_name: order.store_name,
          store_variant_order_id: order.store_variant_order_id,
          produc_title: order.produc_title,
          price: formatPrice(priceWithFee),
          quantity: order.quantity,
          total_price_for_product: order.total_price_for_product,
          variant_order_status_id: order.variant_order_status_id,
          serial_code_products: serialCodes.map((code) => ({ id: code.id, serial: code.serial })),
        });
      }

      return Array.from(ordersMap.values());
    } catch (error) {
      console.error("Error en currentOrder:", error);
      throw error;
    }
  }

  async listCustomerOrders(customerId) {
    const repoStoreOrder = this.activeManager_.withRepository(this.storeOrderRepository_);
    const listOrder = await repoStoreOrder
      .createQueryBuilder("so")
      .innerJoinAndSelect("so.order_status", "sso")
      .leftJoinAndSelect("so.storeVariantOrder", "svo")
      .leftJoinAndSelect("svo.store_variant", "sxv")
      .innerJoinAndSelect("sxv.variant", "pv")
      .leftJoinAndSelect("sxv.store", "s")
      .where("so.customer_id = :customer_id", { customer_id: customerId })
      .select([
        "so.id AS id",
        "so.pay_method_id AS pay_method_id",
        "so.quantity_products AS quantity_products",
        "so.total_price AS total_price",
        "so.name AS person_name",
        "so.last_name AS person_last_name",
        "so.email AS email",
        "so.contry AS contry",
        "so.city AS city",
        "so.phone AS phone",
        "so.proof_of_payment AS proof_of_payment",
        "so.created_at AS created_at",
        "so.order_status_id AS status_id",
        "svo.id AS store_variant_order_id",
        "svo.quantity AS quantity",
        "svo.total_price AS total_price_for_product",
        "svo.variant_order_status_id AS variant_order_status_id",
        "sso.state AS state_order",
        "pv.id AS variant_id", // ⬅️ NUEVO
        "pv.title AS produc_title",
        "svo.unit_price AS price",
        "s.name AS store_name",
        "s.id AS store_id",
      ])
      .getRawMany();

    const orderMap = new Map();

    for (const order of listOrder) {
      const rate = await this.getRateCached_(order.variant_id);
      const priceWithFee = order.price * (1 + rate);
      const {
        store_id,
        store_name,
        store_variant_order_id,
        produc_title,
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
        price: formatPrice(priceWithFee),
        quantity,
        total_price_for_product: formatPrice(Number(total_price_for_product)),
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
    returnArray.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    return returnArray;
  }

  async listSellerOrders(storeId) {
    const repoStoreOrder = this.activeManager_.withRepository(this.storeOrderRepository_);
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
        "so.name AS person_name",
        "so.last_name AS person_last_name",
        "so.created_at AS created_at",
        "so.order_status_id AS status_id",
        "svo.id AS store_variant_order_id",
        "svo.quantity AS quantity",
        "svo.total_price AS total_price_for_product",
        "svo.variant_order_status_id AS variant_order_status_id",
        "sso.state AS state_order",
        "pv.id AS variant_id", // ⬅️ NUEVO
        "pv.title AS produc_title",
        "svo.unit_price AS price",
      ])
      .orderBy("so.created_at", "DESC")
      .getRawMany();

    // aplicar comisión dinámica ➡️ neto al vendedor
    for (const order of listOrder) {
      const rate = await this.getRateCached_(order.variant_id);
      order.price = formatPrice(order.price * (1 - rate));
      order.total_price_for_product = formatPrice(order.total_price_for_product * (1 - rate));
    }

    const OrderMap = new Map();
    for (const orderData of listOrder) {
      if (!OrderMap.has(orderData.id)) {
        OrderMap.set(orderData.id, {
          id: orderData.id,
          person_name: `${orderData.person_name} ${orderData.person_last_name}`,
          created_at: orderData.created_at,
          state_order: orderData.state_order,
          products: [],
        });
      }
      OrderMap.get(orderData.id).products.push({
        store_variant_order_id: orderData.store_variant_order_id,
        variant_order_status_id: orderData.variant_order_status_id,
        quantity: orderData.quantity,
        total_price: orderData.total_price_for_product,
        produc_title: orderData.produc_title,
        price: orderData.price,
        serial_code_products:
          ["Completed_ID", "Finished_ID", "Paid_ID", "Discussion_ID"].includes(orderData.status_id)
            ? await this.functionRecoverCodes(orderData.store_variant_order_id)
            : [],
      });
    }

    return Array.from(OrderMap.values());
  }

  async listSellerPayOrders() {
    const repoStoreOrder = this.activeManager_.withRepository(this.storeOrderRepository_);
    const listOrder = await repoStoreOrder
      .createQueryBuilder("so")
      .leftJoinAndSelect("so.storeVariantOrder", "svo")
      .leftJoinAndSelect("svo.variant_order_status", "vos")
      .leftJoinAndSelect("svo.store_variant", "sxv")
      .innerJoinAndSelect("sxv.variant", "pv")
      .where(
        "sxv.store_id = :store_id AND svo.variant_order_status_id NOT IN (:...excludedStatus)",
        {
          store_id: this.loggedInCustomer_?.store_id,
          excludedStatus: ["Cancel_ID", "Payment_Pending_ID"],
        }
      )
      .select([
        "so.id AS number_order",
        "so.created_at AS created_date",
        "svo.id AS store_variant_order_id",
        "svo.total_price AS total_price_for_product",
        "svo.quantity AS quantity",
        "vos.state AS state",
        "pv.id AS variant_id", // ⬅️ NUEVO
        "pv.title AS produc_title",
        "svo.unit_price AS unit_price",
      ])
      .orderBy("so.created_at", "DESC")
      .getRawMany();

    for (const order of listOrder) {
      const rate = await this.getRateCached_(order.variant_id);
      order.unit_price = formatPrice(order.unit_price * (1 - rate));
    }
    return listOrder;
  }

  // … Los demás métodos permanecen iguales salvo que quites process.env.COMMISSION en getListSerialCodeforCustomer

  async getListSerialCodeforCustomer() {
    const repoStoreOrder = this.activeManager_.withRepository(this.storeOrderRepository_);
    const listOrder = await repoStoreOrder
      .createQueryBuilder("so")
      .innerJoinAndSelect("so.order_status", "sso")
      .leftJoinAndSelect("so.storeVariantOrder", "svo")
      .leftJoinAndSelect("svo.store_variant", "sxv")
      .innerJoinAndSelect("sxv.variant", "pv")
      .leftJoinAndSelect("sxv.store", "s")
      .where("so.customer_id = :customer_id", { customer_id: this.loggedInCustomer_?.id })
      .select([
        "so.id AS id",
        "so.pay_method_id AS pay_method_id",
        "so.quantity_products AS quantity_products",
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
        "pv.id AS variant_id", // ⬅️ NUEVO
        "pv.title AS produc_title",
        "svo.unit_price AS price",
        "s.name AS store_name",
        "s.id AS store_id",
      ])
      .getRawMany();

    const orderMap = new Map();

    for (const order of listOrder) {
      const rate = await this.getRateCached_(order.variant_id);
      const priceWithFee = order.price * (1 + rate);
      const {
        store_id,
        store_name,
        store_variant_order_id,
        produc_title,
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
        price: formatPrice(priceWithFee),
        quantity,
        total_price_for_product,
      });
    }
    return Array.from(orderMap.values());
  }

  // ⇢ resto sin cambio (deleteOrder, etc.)
  /**
   * Recupera códigos seriales asociados a una variante de orden.
   * Encapsulado para reuso en múltiples vistas.
   */
  private async functionRecoverCodes(store_variant_order_id: string) {
    const repoSerialCode = this.activeManager_.withRepository(this.serialCodeRepository_);
    return await repoSerialCode.find({ where: { store_variant_order_id } });
  }
}

export default StoreOrderService;
