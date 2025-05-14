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

class StoreOrderService extends TransactionBaseService {
  static LIFE_TIME = Lifetime.SCOPED;
  protected readonly storeOrderRepository_: typeof StoreOrderRepository;
  protected readonly storeVariantOrderRepository_: typeof StoreVariantOrderRepository;
  protected readonly storeXVariantRepository_: typeof StoreXVariantRepository;
  protected readonly serialCodeRepository_: typeof SerialCodeRepository;
  protected readonly dataMethodPaymentRepository_: typeof DataMethodPaymentRepository;
  protected readonly loggedInCustomer_: Customer | null;

  constructor(container) {
    // @ts-expect-error prefer-rest-params
    super(...arguments);
    this.storeOrderRepository_ = container.storeOrderRepository;
    this.storeVariantOrderRepository_ = container.storeVariantOrderRepository;
    this.storeXVariantRepository_ = container.storeXVariantRepository;
    this.serialCodeRepository_ = container.serialCodeRepository;
    this.loggedInCustomer_ = container?.loggedInCustomer ?? null;
    this.dataMethodPaymentRepository_ = container.dataMethodPaymentRepository;
  }

  async currentOrder(store_order_id) {
    try {
      const repoStoreOrder = this.activeManager_.withRepository(
        this.storeOrderRepository_
      );
      const repoSerialCode = this.activeManager_.withRepository(
        this.serialCodeRepository_
      );

      const listOrder = await repoStoreOrder
        .createQueryBuilder("so")
        .leftJoin("so.storeVariantOrder", "svo")
        .leftJoin("svo.store_variant", "sxv")
        .innerJoinAndSelect("sxv.variant", "pv")
        .leftJoin("sxv.store", "s")
        .where(
          "so.id = :store_order_id AND so.order_status_id = :status",
          {
            store_order_id: store_order_id,
            status: "Payment_Pending_ID",
          }
        )
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
          "pv.title AS produc_title",
          "sxv.price AS price",
          "s.name AS store_name",
          "s.id AS store_id",
        ])
        .getRawMany();

      // Agrupar las órdenes y sus variantes
      const ordersMap = new Map();

      for (const order of listOrder) {
        if (!ordersMap.has(order.id)) {
          // Crear nueva orden
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

        // Obtener códigos seriales para esta variante
        const serialCodes = await repoSerialCode.find({
          where: { store_variant_order_id: order.store_variant_order_id },
        });

        // Agregar variante a la orden
        ordersMap.get(order.id).store_variant.push({
          store_id: order.store_id,
          store_name: order.store_name,
          store_variant_order_id: order.store_variant_order_id,
          produc_title: order.produc_title,
          price: formatPrice(order.price + order.price * Number(process.env.COMMISSION)),
          quantity: order.quantity,
          total_price_for_product: order.total_price_for_product,
          variant_order_status_id: order.variant_order_status_id,
          serial_code_products: serialCodes.map((code) => ({
            id: code.id,
            serial: code.serial,
          })),
        });
      }

      return Array.from(ordersMap.values());
    } catch (error) {
      console.error("Error en currentOrder:", error);
      throw error;
    }
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
        "so.proof_of_payment AS proof_of_payment",
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
        price: formatPrice(price + price * Number(process.env.COMMISSION)),
        quantity,
        total_price_for_product: formatPrice(Number(total_price_for_product) ),
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
        "so.name AS person_name",
        "so.last_name AS person_last_name",
        "so.created_at AS created_at",
        "so.order_status_id AS status_id",
        "svo.id AS store_variant_order_id",
        "svo.quantity AS quantity",
        "svo.total_price AS total_price_for_product",
        "svo.variant_order_status_id AS variant_order_status_id",
        "sso.state AS state_order",
        "pv.title AS produc_title",
        "sxv.price AS price",
      ])
      .orderBy("so.created_at", "DESC")
      .getRawMany();

    const OrderMap = new Map();

    for (const orderData of listOrder) {
      if (!OrderMap.has(orderData.id)) {
        OrderMap.set(orderData.id, {
          id: orderData.id,
          person_name: orderData.person_name + " " + orderData.person_last_name,
          created_at: orderData.created_at,
          state_order: orderData.state_order,
          products: [
            {
              store_variant_order_id: orderData.store_variant_order_id,
              variant_order_status_id: orderData.variant_order_status_id,
              quantity: orderData.quantity,
              total_price: orderData.total_price_for_product,
              produc_title: orderData.produc_title,
              price: formatPrice(orderData.price ),
              serial_code_products:
                orderData.status_id === "Completed_ID" ||
                orderData.status_id === "Finished_ID" ||
                orderData.status_id === "Paid_ID" ||
                orderData.status_id === "Discussion_ID"
                  ? await this.functionRecoverCodes(
                      orderData.store_variant_order_id
                    )
                  : [],
            },
          ],
        });
      } else {
        OrderMap.get(orderData.id).products.push({
          store_variant_order_id: orderData.store_variant_order_id,
          variant_order_status_id: orderData.variant_order_status_id,
          quantity: orderData.quantity,
          total_price: orderData.total_price_for_product,
          produc_title: orderData.produc_title,
          price: formatPrice(orderData.price ),
          serial_code_products:
            orderData.status_id === "Completed_ID" ||
            orderData.status_id === "Finished_ID" ||
            orderData.status_id === "Paid_ID" ||
            orderData.status_id === "Discussion_ID"
              ? await this.functionRecoverCodes(
                  orderData.store_variant_order_id
                )
              : [],
        });
      }
    }

    const returnArray = Array.from(OrderMap.values());

    return returnArray;
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
      .where(
        "sxv.store_id = :store_id AND svo.variant_order_status_id NOT IN (:...excludedStatus) ",
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
        "pv.title AS produc_title",
        "sxv.price AS unit_price",
        "c.first_name AS customer_name",
        "c.last_name AS customer_last_name",
      ])
      .orderBy("so.created_at", "DESC")
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
      if (dataForm.pay_method_id === "coinpal_pay") {
        dataForm = {
          ...dataForm,
          pay_method_id: "Method_COINPAL_ID",
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
    try {
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
            variant_order_status_id: "Completed_ID",
          },
          {
            variant_order_status_id: "Finished_ID",
          }
        );
      }

      return cancelOrder;
    } catch (error) {
      console.log("Error al cambiar la orden de estado a discuccion", error);
    }
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

    const storeOrder = await repoStoreOrder.findOne({
      where: {
        id: orderId,
      },
    });

    if (storeOrder.order_status_id !== "Payment_Pending_ID") {
      throw new Error("No se puedo cancelar la orden porque su estado es diferente a Payment_Pending_ID");
    }

    await this.restaureStock(repoStoreXVariant, repoStoreVariantOrder, orderId);

    const cancelOrder = await repoStoreOrder.update(orderId, {
      order_status_id: "Cancel_ID",
    });

    return cancelOrder;
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
        customer_id: this.loggedInCustomer_?.id,
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
        price : formatPrice(price + price * Number(process.env.COMMISSION)),
        quantity,
        total_price_for_product,
      });
    });
    return Array.from(orderMap.values());
  }

  async updateFinishVariantOrder(store_variant_order_id) {
    const repoStoreVariantOrder = this.activeManager_.withRepository(
      this.storeVariantOrderRepository_
    );

    const getDtaSVO = await repoStoreVariantOrder.findOne({
      where: {
        id: store_variant_order_id,
      },
    });

    const upDateFinish = await repoStoreVariantOrder.update(
      store_variant_order_id,
      {
        variant_order_status_id: "Finished_ID",
      }
    );

    await this.validateOrderreadyToFinished(getDtaSVO.store_order_id);

    return upDateFinish;
  }

  async validateOrderreadyToFinished(store_order_id) {
    const repoStoreOrder = this.activeManager_.withRepository(
      this.storeOrderRepository_
    );

    const repoStoreVariantOrder = this.activeManager_.withRepository(
      this.storeVariantOrderRepository_
    );

    const getClamis = await repoStoreVariantOrder.find({
      where: {
        store_order_id: store_order_id,
        variant_order_status_id: In(["Completed_ID", "Discussion_ID"]),
      },
    });

    if (!getClamis.length) {
      await repoStoreOrder.update(store_order_id, {
        order_status_id: "Finished_ID",
      });
    }
  }

  async getPaymentOrders(customer_id, order_id) {
    const repoStoreOrder = this.activeManager_.withRepository(
      this.storeOrderRepository_
    );
    const repoMethodPay = this.activeManager_.withRepository(
      this.dataMethodPaymentRepository_
    );

    try {
      const getOrder = await repoStoreOrder.findOne({
        where: {
          customer_id,
          id: order_id,
          order_status_id: "Payment_Pending_ID",
        },
        relations: ["storeVariantOrder"],
      });
      if (getOrder) {
        const methodPay = await repoMethodPay.findOne({
          where: {
            order_id: getOrder.id,
          },
        });
        
        let total = getOrder.storeVariantOrder.map((sv) => {
          return  typeof sv.total_price === "string" ? parseFloat(sv.total_price) : sv.total_price}).reduce((a, b) => a + b, 0);
        total = formatCommisionCoinpal(total);
        return { order: {...getOrder,total_price: total }, dataPay: methodPay };
      } else {
        return { order: null, dartaPay: null };
      }
    } catch (error) {
      console.log("error al buscar la orden de coinpal", error);
    }
  }

  async postMethodPaymentOrder(
    store_order_id: string,
    method: string,
    reference: string
  ) {
    const repoDataMethodPayment = this.activeManager_.withRepository(
      this.dataMethodPaymentRepository_
    );
    if (method === "coinpal_pay") {
      const data = await repoDataMethodPayment.create({
        order_id: store_order_id,
        coinpal: reference,
      });
      const saveData = await repoDataMethodPayment.save(data);
      return saveData;
    }
    return;
  }


  async updateOrderDataWhitManualPay(formData: any, store_order_id: string, image: any) {
   
    try {
     
      if (formData.pay_method_id === "manual_binance_pay") {
        formData = {
          ...formData,
          pay_method_id: "Method_Manual_Pay_ID",
          proof_of_payment: image.path,
        };
      }
      else{
        return false;
      }

      const repoStoreOrder = this.activeManager_.withRepository(
        this.storeOrderRepository_
      );

      const updateData = await repoStoreOrder.update(store_order_id, {
        ...formData,
      });
      return true;
    } catch (error) {
      console.log("error al actualizar la orden", error);
    }
    
  }
}

export default StoreOrderService;
