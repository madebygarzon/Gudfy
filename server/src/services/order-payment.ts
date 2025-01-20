import { Lifetime } from "awilix";
import StoreVariantOrderRepository from "src/repositories/store-variant-order";
import StoreRepository from "src/repositories/store";
import StoreOrderRepository from "src/repositories/store-order";
import OrderPaymentRepository from "src/repositories/order-payment";
import PaymentDetailRepository from "src/repositories/payment-detail";
import SerialCodeRepository from "src/repositories/serial-code";
import StoreXVariantRepository from "src/repositories/store-x-variant";
import { TransactionBaseService } from "@medusajs/medusa";
import { io } from "../websocket";

class OrderPaymentService extends TransactionBaseService {
  static LIFE_TIME = Lifetime.SCOPED;
  protected readonly storeVariantOrderRepository_: typeof StoreVariantOrderRepository;
  protected readonly orderPaymentRepository_: typeof OrderPaymentRepository;
  protected readonly paymentDetailRepository_: typeof PaymentDetailRepository;
  protected readonly storeRepository_: typeof StoreRepository;
  protected readonly serialCodeRepository_: typeof SerialCodeRepository;
  protected readonly storeOrderRepository_: typeof StoreOrderRepository;
  protected readonly storeXVariantRepository_: typeof StoreXVariantRepository;

  constructor(container) {
    // @ts-expect-error prefer-rest-params
    super(...arguments);
    this.storeVariantOrderRepository_ = container.storeVariantOrderRepository;
    this.orderPaymentRepository_ = container.orderPaymentRepository;
    this.paymentDetailRepository_ = container.paymentDetailRepository;
    this.storeRepository_ = container.storeRepository;
    this.serialCodeRepository_ = container.serialCodeRepository;
    this.storeOrderRepository_ = container.storeOrderRepository;
    this.storeXVariantRepository_ = container.storeXVariantRepository;
  }
  async retriveListStoresToPay() {
    try {
      const storeRepo = this.activeManager_.withRepository(
        this.storeRepository_
      );

      const listStore = await storeRepo
        .createQueryBuilder("s")
        .innerJoinAndSelect("s.store_x_variant", "sxv")
        .innerJoinAndSelect("sxv.storeVariantOrder", "svo")
        .innerJoinAndSelect("sxv.variant", "v")
        .innerJoinAndSelect("v.product", "p")
        .innerJoinAndSelect("svo.store_order", "so")
        .innerJoinAndSelect("so.customer", "c")
        .where("svo.variant_order_status_id NOT IN (:...excludedStatus)", {
          excludedStatus: ["Cancel_ID", "Payment_Pending_ID"],
        })
        .select([
          "s.id AS store_id",
          "s.name AS store_name",
          "svo.id AS svo_id",
          "svo.created_at AS date_order",
          "svo.quantity AS quantity",
          "svo.variant_order_status_id AS product_order_status",
          "sxv.price AS price",
          "so.id as order_id",
          "v.title AS product_name",
          "p.thumbnail AS thumbnail",
          "c.first_name AS customer_name",
          "c.last_name AS custommer_last_name",
        ])
        .orderBy("svo.created_at", "DESC")
        .getRawMany();

      const storeMap = new Map();

      listStore.forEach((store) => {
        if (!storeMap.has(store.store_id)) {
          storeMap.set(store.store_id, {
            store_id: store.store_id,
            store_name: store.store_name,
            date_order: store.date_order,
            product: [
              {
                order_id: store.order_id,
                svo_id: store.svo_id,
                product_name: store.product_name,
                thumbnail: store.thumbnail,
                price: store.price,
                quantity: store.quantity,
                customer_name:
                  store.customer_name + " " + store.custommer_last_name,
                product_order_status: store.product_order_status,
              },
            ],
          });
        } else
          storeMap.get(store.store_id).product.push({
            order_id: store.order_id,
            svo_id: store.svo_id,
            product_name: store.product_name,
            thumbnail: store.thumbnail,
            price: store.price,
            quantity: store.quantity,
            customer_name:
              store.customer_name + " " + store.custommer_last_name,
            product_order_status: store.product_order_status,
          });
      });

      const listStoreXproductsPay = Array.from(storeMap.values());
      listStoreXproductsPay.forEach((store) => {
        let outstanding_balance = 0;
        let available_balance = 0;
        let balance_paid = 0;

        // Iteramos sobre los productos de cada tienda
        store.product.forEach((item) => {
          const totalPrice = item.price * item.quantity;

          if (item.product_order_status === "Finished_ID") {
            // Sumar a available_balance
            available_balance += totalPrice;
          } else if (
            item.product_order_status === "Completed_ID" ||
            item.product_order_status === "Discussion_ID"
          ) {
            // Sumar a outstanding_balance
            outstanding_balance += totalPrice;
          } else if (item.product_order_status === "Paid_ID") {
            balance_paid += totalPrice;
          }
        });

        // Añadimos los nuevos atributos al objeto de tienda
        store.available_balance = truncateToThreeDecimals(available_balance);
        store.outstanding_balance =
          truncateToThreeDecimals(outstanding_balance);
        store.balance_paid = truncateToThreeDecimals(balance_paid);
      });

      return listStoreXproductsPay;
    } catch (error) {
      console.log(
        "error en el servicio al intentar enlistar las tiendas para su pago",
        error
      );
    }
  }

  async postAddPayment(dataOrderP, voucher, products) {
    const OrderPaymentRepo = this.activeManager_.withRepository(
      this.orderPaymentRepository_
    );
    const PayDetail = this.activeManager_.withRepository(
      this.paymentDetailRepository_
    );

    const SVORepo = this.activeManager_.withRepository(
      this.storeVariantOrderRepository_
    );
    const createOrderPay = await OrderPaymentRepo.create({
      amount_paid: dataOrderP.amount_paid,
      payment_note: dataOrderP.payment_note,
      store_id: dataOrderP.store_id,
      voucher: `${
        process.env.BACKEND_URL ?? "http://localhost:9000"
      }/${voucher}`,
      commission: dataOrderP.commission,
      subtotal: dataOrderP.subtotal,
      customer_name: dataOrderP.customer_name,
    });

    const saverOrderPay = await OrderPaymentRepo.save(createOrderPay);

    for (const product of products) {
      const update = await SVORepo.update(product.svo_id, {
        variant_order_status_id: "Paid_ID",
      });
      const createPayDetail = await PayDetail.create({
        order_payments_id: saverOrderPay.id,
        product_name: product.product_name,
        store_variant_order_id: product.svo_id,
        product_price: product.product_price,
        quantity: product.quantity,
      });
      const savePaymentDetail = await PayDetail.save(createPayDetail);
    }
  }

  async recoverListOrderPayments(idStore) {
    const OrderPaymentRepo = this.activeManager_.withRepository(
      this.orderPaymentRepository_
    );

    const paidOrders = await OrderPaymentRepo.createQueryBuilder("op")
      .innerJoinAndSelect("op.payment_detail", "pd")
      .innerJoinAndSelect("pd.store_variant_order", "svo")
      .where("op.store_id = :idStore", {
        idStore: idStore,
      })
      .select([
        "op.id AS payment_id",
        "op.amount_paid AS amoun_paid",
        "op.payment_note AS payment_note",
        "op.voucher AS voucher",
        "op.customer_name AS customer_name",
        "op.commission AS commission",
        "op.subtotal AS subtotal",
        "op.created_at AS payment_date",
        "pd.product_name AS product_name",
        "pd.product_price AS product_price",
        "pd.quantity AS  product_quantity",
        "svo.total_price AS total_price",
        "svo.store_order_id AS store_order_id",
      ])
      .orderBy("op.created_at", "DESC")
      .getRawMany();

    const paymentdOrdersMap = new Map();

    paidOrders.forEach((payment) => {
      if (!paymentdOrdersMap.has(payment.payment_id)) {
        paymentdOrdersMap.set(payment.payment_id, {
          payment_id: payment.payment_id,
          amoun_paid: payment.amoun_paid,
          payment_note: payment.payment_note,
          voucher: payment.voucher,
          commission: payment.commission,
          subtotal: payment.subtotal,
          payment_date: payment.payment_date,
          products: [
            {
              name: payment.product_name,
              price: payment.product_price,
              quantity: payment.product_quantity,
              total_price: payment.total_price,
              store_order_id: payment.store_order_id,
              customer_name: payment.customer_name,
            },
          ],
        });
      } else {
        paymentdOrdersMap.get(payment.payment_id).products.push({
          name: payment.product_name,
          price: payment.product_price,
          quantity: payment.product_quantity,
          total_price: payment.total_price,
          store_order_id: payment.store_order_id,
          customer_name: payment.customer_name,
        });
      }
    });

    const listPaymentOrder = Array.from(paymentdOrdersMap.values());

    return listPaymentOrder;
  }

  async successPayOrder(order_id) {
    try {
      const so = this.activeManager_.withRepository(this.storeOrderRepository_);
      const svo = this.activeManager_.withRepository(
        this.storeVariantOrderRepository_
      );
      const sv = this.activeManager_.withRepository(
        this.storeXVariantRepository_
      );

      const sc = this.activeManager_.withRepository(this.serialCodeRepository_);
      const storeOrder = await so.findOne({ where: { id: order_id } });
      if (storeOrder.order_status_id !== "Payment_Pending_ID")
        throw new Error("Order status is not pending payment");

      const ListSVO = await svo.find({
        where: {
          store_order_id: order_id,
        },
      });
      for (const variant of ListSVO) {
        const quantity = variant.quantity;
        const id = variant.id;
        const serialCodesToUpdate = await sc.find({
          where: {
            store_variant_order_id: null,
            store_variant_id: variant.store_variant_id,
          },
          take: quantity,
        });
        for (const serialCode of serialCodesToUpdate) {
          await sc.update(serialCode.id, { store_variant_order_id: id });
        }

        const upDateSVO = await svo.update(variant.id, {
          variant_order_status_id: "Completed_ID",
        });
        const storeVariant = await sv.findOneBy({
          id: variant.store_variant_id,
        });
        const deleteReservation = await sv.update(variant.store_variant_id, {
          quantity_reserved: storeVariant.quantity_reserved - quantity,
        });
      }
      const storeOrderUpdate = await so.update(order_id, {
        order_status_id: "Completed_ID",
      });

      io.emit("success_pay_order", {
        order_id: order_id,
      });
    } catch (error) {
      console.log(
        "error en el servicio para actualizar los datos en la confirmacion de la orden ",
        error
      );
    }
  }
}
export default OrderPaymentService;

function truncateToThreeDecimals(value) {
  return Math.floor(value * 1000) / 1000; // Trunca a 3 decimales
}
