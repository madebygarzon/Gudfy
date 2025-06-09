import { Lifetime } from "awilix";

import { TransactionBaseService } from "@medusajs/medusa";
import StoreOrderRepository from "../repositories/store-order";
import StoreVariantOrderRepository from "../repositories/store-variant-order";
import StoreXVariantRepository from "../repositories/store-x-variant";
import SerialCodeRepository from "src/repositories/serial-code";
import CustomerRepository from "src/repositories/customer";
import { In } from "typeorm";
import {
  EmailPurchaseCompleted,
  EmailPurchaseSellerCompleted,
} from "../admin/components/email/payments";
import { io } from "../websocket";
import JobsService from "./jobs";
import { formatPrice } from "./utils/format-price";

class StoreOrderAdminService extends TransactionBaseService {
  static LIFE_TIME = Lifetime.SCOPED;
  protected readonly storeOrderRepository_: typeof StoreOrderRepository;
  protected readonly storeVariantOrderRepository_: typeof StoreVariantOrderRepository;
  protected readonly storeXVariantRepository_: typeof StoreXVariantRepository;
  protected readonly serialCodeRepository_: typeof SerialCodeRepository;
  protected readonly customerRepository_: typeof CustomerRepository;
  protected readonly jobsService_: JobsService;

  constructor(container) {
    // @ts-expect-error prefer-rest-params
    super(...arguments);
    this.storeOrderRepository_ = container.storeOrderRepository;
    this.storeVariantOrderRepository_ = container.storeVariantOrderRepository;
    this.storeXVariantRepository_ = container.storeXVariantRepository;
    this.serialCodeRepository_ = container.serialCodeRepository;
    this.customerRepository_ = container.customerRepository;
    this.jobsService_ = container.jobsService;
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
          "so.proof_of_payment AS proof_of_payment",
          "svo.id AS store_variant_order_id",
          "svo.quantity AS quantity",
          "svo.unit_price AS price",
          "svo.total_price AS total_price_for_product",
          "svo.variant_order_status_id AS variant_order_status_id",
          "sso.state AS state_order",
          "pv.title AS produc_title",
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

  async listMetricsCustomers() {
    const repoCustomer = this.activeManager_.withRepository(
      this.customerRepository_
    );

    const listOrder = await repoCustomer
      .createQueryBuilder("cus")
      .innerJoinAndSelect("cus.customerorder", "so")
      .where("so.order_status_id IN (:...status_ids)", {
        status_ids: ["Finished_ID", "Completed_ID", "Discussion_ID"],
      })
      .select([
        "cus.id AS id",
        "cus.email AS email",
        "cus.phone AS phone",
        "cus.first_name AS first_name",
        "cus.last_name AS last_name",
        "cus.created_at AS created_at",
        "so.quantity_products AS quantity_products",
        "so.total_price AS total_price",
        "so.created_at AS order_date",
      ])
      .getRawMany();

    const dataMap = new Map();

    for (const order of listOrder) {
      const {
        quantity_products,
        total_price,
        first_name,
        last_name,
        phone,
        order_date,
        ...rest
      } = order;

      if (!dataMap.has(order.id)) {
        dataMap.set(order.id, {
          ...rest,
          customer_name: first_name + " " + last_name,
          num_orders: 0,
          num_products: 0,
          mvp_order: 0,
          expenses: 0,
          total_media_order: 0,
          phone,
          last_order_date: new Date(0),
        });
      }

      const customer = dataMap.get(order.id);

      customer.num_orders += 1;
      customer.num_products += quantity_products;
      customer.mvp_order = formatPrice(
        Math.max(customer.mvp_order, parseFloat(total_price))
      );
      customer.expenses += formatPrice(parseFloat(total_price));

      customer.total_media_order = parseFloat(
        (customer.expenses / customer.num_orders).toFixed(2)
      );

      const orderDate = new Date(order_date);
      if (orderDate > customer.last_order_date) {
        customer.last_order_date = orderDate;
      }
    }

    const result = Array.from(dataMap.values());
    const resultMetricsOrder = await this.listMetricsOrders();
    const addResults = {
      customer_metrics: result,
      order_metrics: resultMetricsOrder,
    };
    return addResults;
  }

  async listMetricsOrders() {
    const repoOrder = this.activeManager_.withRepository(
      this.storeOrderRepository_
    );

    const listMetrics = await repoOrder
      .createQueryBuilder("order")
      .select([
        "TO_CHAR(order.created_at, 'Month YYYY') as month",
        "SUM(order.total_price) as total_spent",
        "COUNT(order.id) as total_orders",
      ])
      .where("order.order_status_id IN (:...statuses)", {
        statuses: ["Finished_ID", "Completed_ID"],
      })
      .groupBy("month")
      .orderBy("month", "ASC")
      .getRawMany();

    return listMetrics;
  }

  async UpdateOrderPendingToComplete(order_id) {
    try {
      const so = this.activeManager_.withRepository(this.storeOrderRepository_);
      const svo = this.activeManager_.withRepository(
        this.storeVariantOrderRepository_
      );
      const sv = this.activeManager_.withRepository(
        this.storeXVariantRepository_
      );
      const sc = this.activeManager_.withRepository(this.serialCodeRepository_);
      const codes = [];
      const storeCodeMap = {};

      const storeOrder = await so.findOne({ where: { id: order_id } });
      if (!storeOrder) {
        throw new Error("Order not found");
      }

      const ListSVO = await svo.find({ where: { store_order_id: order_id } });

      const insufficientStockVariants = [];

      for (const variant of ListSVO) {
        const quantity = variant.quantity;
        const storeVariant = await sv.findOneBy({
          id: variant.store_variant_id,
        });

        if (!storeVariant || storeVariant.quantity_reserved < quantity) {
          const variantInfo = await sv
            .createQueryBuilder("sv")
            .innerJoinAndSelect("sv.variant", "v")
            .where("sv.id = :id", { id: variant.store_variant_id })
            .select(["v.title AS title"])
            .getRawOne();

          const variantTitle = variantInfo
            ? variantInfo.title
            : "Unknown variant";
          insufficientStockVariants.push({
            title: variantTitle,
            requested: quantity,
            available: storeVariant ? storeVariant.quantity_reserved : 0,
            variant_id: variant.store_variant_id,
          });
        }
      }

      if (insufficientStockVariants.length > 0) {
        return {
          success: false,
          message: "No hay suficiente stock para algunas variaciones",
          insufficientStockVariants,
        };
      }

      for (const variant of ListSVO) {
        const quantity = variant.quantity;
        const id = variant.id;

        const result = await sc
          .createQueryBuilder()
          .update()
          .set({ store_variant_order_id: id })
          .where(
            `id IN (
              SELECT id
              FROM serial_code
              WHERE store_variant_order_id IS NULL
                AND store_variant_id = :svId
              LIMIT :q
              FOR UPDATE SKIP LOCKED
            )`,
            { svId: variant.store_variant_id, q: quantity }
          )
          .returning(["id", "serial"])
          .execute();

        const serialCodesToUpdate = result.raw as {
          id: string;
          serial: string;
        }[];

        if (serialCodesToUpdate.length < quantity) {
          throw new Error(
            `Stock insuficiente: pidió ${quantity} y sólo había ${serialCodesToUpdate.length} códigos disponibles`
          );
        }

        const productVariant = await sv
          .createQueryBuilder("sv")
          .innerJoinAndSelect("sv.variant", "v")
          .innerJoinAndSelect("sv.store", "s")
          .innerJoinAndSelect("s.members", "c")
          .where("sv.id = :id", { id: variant.store_variant_id })
          .select([
            "v.title AS title",
            "s.name AS store_name",
            "c.email AS email_store",
            "s.name AS name_store",
            "sv.id AS store_id",
          ])
          .getRawMany();

        const storeId = variant.store_variant_id;
        const storeInfo = {
          store_id: productVariant[0].store_id,
          store_name: productVariant[0].store_name,
          email_store: productVariant[0].email_store,
          name_store: productVariant[0].name_store,
        };

        if (!storeCodeMap[storeId]) {
          storeCodeMap[storeId] = {
            ...storeInfo,
            codes: [],
          };
        }

        for (const serialCode of serialCodesToUpdate) {
          codes.push({
            serialCodes: serialCode.serial,
            title: productVariant[0].title,
          });

          storeCodeMap[storeId].codes.push({
            serialCodes: serialCode.serial,
            title: productVariant[0].title,
          });

          await sc.update(serialCode.id, { store_variant_order_id: id });
        }

        await svo.update(variant.id, {
          variant_order_status_id: "Completed_ID",
        });
        const storeVariant = await sv.findOneBy({
          id: variant.store_variant_id,
        });
        await sv.update(variant.store_variant_id, {
          quantity_reserved: storeVariant.quantity_reserved - quantity,
        });
      }

      const storesWithCodes = Object.values(storeCodeMap);

      await EmailPurchaseSellerCompleted({
        storesWithCodes: storesWithCodes as any,
        order_id: order_id,
      });

      await EmailPurchaseCompleted({
        email: storeOrder.email,
        serialCodes: codes,
        name: storeOrder.name + " " + storeOrder.last_name,
        order: storeOrder.id,
      });

      await so.update(order_id, { order_status_id: "Completed_ID" });
      io.emit("success_pay_order", { order_id: order_id });
      return {
        success: true,
        message: "Orden completada exitosamente",
        order_id,
        codes,
      };
    } catch (error) {
      console.error(
        "Error en el servicio para actualizar los datos en la confirmación de la orden:",
        error
      );
      return {
        success: false,
        message: error.message || "Error desconocido al procesar la orden",
        error: error.toString(),
      };
    }
  }

  async UpdateOrderToComplete(order_id) {
    try {
      const so = this.activeManager_.withRepository(this.storeOrderRepository_);
      const svo = this.activeManager_.withRepository(
        this.storeVariantOrderRepository_
      );
      const sv = this.activeManager_.withRepository(
        this.storeXVariantRepository_
      );
      const sc = this.activeManager_.withRepository(this.serialCodeRepository_);
      const codes = [];
      const storeCodeMap: Record<string, any> = {};

      const storeOrder = await so.findOne({ where: { id: order_id } });
      if (!storeOrder) {
        throw new Error("Order not found");
      }

      const ListSVO = await svo.find({ where: { store_order_id: order_id } });

      const insufficientStockVariants = [];

      for (const variant of ListSVO) {
        const quantity = variant.quantity;
        const storeVariant = await sv.findOneBy({
          id: variant.store_variant_id,
        });

        if (!storeVariant || storeVariant.quantity_store < quantity) {
          const variantInfo = await sv
            .createQueryBuilder("sv")
            .innerJoinAndSelect("sv.variant", "v")
            .where("sv.id = :id", { id: variant.store_variant_id })
            .select(["v.title AS title"])
            .getRawOne();

          const variantTitle = variantInfo
            ? variantInfo.title
            : "Unknown variant";
          insufficientStockVariants.push({
            title: variantTitle,
            requested: quantity,
            available: storeVariant ? storeVariant.quantity_store : 0,
            variant_id: variant.store_variant_id,
          });
        }
      }

      if (insufficientStockVariants.length > 0) {
        return {
          success: false,
          message: "No hay suficiente stock para algunas variaciones",
          insufficientStockVariants,
        };
      }

      for (const variant of ListSVO) {
        const quantity = variant.quantity;
        const id = variant.id;

        const result = await sc
          .createQueryBuilder()
          .update()
          .set({ store_variant_order_id: id })
          .where(
            `id IN (
              SELECT id
              FROM serial_code
              WHERE store_variant_order_id IS NULL
                AND store_variant_id = :svId
              LIMIT :q
              FOR UPDATE SKIP LOCKED
            )`,
            { svId: variant.store_variant_id, q: quantity }
          )
          .returning(["id", "serial"])
          .execute();

        const serialCodesToUpdate = result.raw as {
          id: string;
          serial: string;
        }[];

        if (serialCodesToUpdate.length < quantity) {
          throw new Error(
            `Stock insuficiente: pidió ${quantity} y sólo había ${serialCodesToUpdate.length} códigos disponibles`
          );
        }

        const productVariant = await sv
          .createQueryBuilder("sv")
          .innerJoinAndSelect("sv.variant", "v")
          .innerJoinAndSelect("sv.store", "s")
          .innerJoinAndSelect("s.members", "c")
          .where("sv.id = :id", { id: variant.store_variant_id })
          .select([
            "v.title AS title",
            "s.name AS store_name",
            "c.email AS email_store",
            "s.name AS name_store",
            "sv.id AS store_id",
          ])
          .getRawMany();

        const storeId = variant.store_variant_id;
        const storeInfo = {
          store_id: productVariant[0].store_id,
          store_name: productVariant[0].store_name,
          email_store: productVariant[0].email_store,
          name_store: productVariant[0].name_store,
        };

        if (!storeCodeMap[storeId]) {
          storeCodeMap[storeId] = {
            ...storeInfo,
            codes: [],
          };
        }

        for (const serialCode of serialCodesToUpdate) {
          codes.push({
            serialCodes: serialCode.serial,
            title: productVariant[0].title,
          });

          storeCodeMap[storeId].codes.push({
            serialCodes: serialCode.serial,
            title: productVariant[0].title,
          });

          await sc.update(serialCode.id, { store_variant_order_id: id });
        }

        await svo.update(variant.id, {
          variant_order_status_id: "Completed_ID",
        });
        const storeVariant = await sv.findOneBy({
          id: variant.store_variant_id,
        });
        await sv.update(variant.store_variant_id, {
          quantity_store: storeVariant.quantity_store - quantity,
        });
      }
      const storesWithCodes = Object.values(storeCodeMap);

      await EmailPurchaseSellerCompleted({
        storesWithCodes: storesWithCodes as any,
        order_id: order_id,
      });

      await EmailPurchaseCompleted({
        email: storeOrder.email,
        serialCodes: codes,
        name: storeOrder.name + " " + storeOrder.last_name,
        order: storeOrder.id,
      });

      await so.update(order_id, { order_status_id: "Completed_ID" });
      io.emit("success_pay_order", { order_id: order_id });
      return {
        success: true,
        message: "Orden completada exitosamente",
        order_id,
        codes,
      };
    } catch (error) {
      console.error(
        "Error en el servicio para actualizar los datos en la confirmación de la orden:",
        error
      );
      return {
        success: false,
        message: error.message || "Error desconocido al procesar la orden",
        error: error.toString(),
      };
    }
  }
  async UpdateOrderToCancel(order_id) {
    const result = await this.jobsService_.deleteOrder(order_id);
    return result;
  }
}
export default StoreOrderAdminService;
