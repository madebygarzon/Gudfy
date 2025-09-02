import { Lifetime } from "awilix";
import StoreVariantOrderRepository from "../repositories/store-variant-order";
import StoreRepository from "../repositories/store";
import StoreOrderRepository from "../repositories/store-order";
import OrderPaymentRepository from "../repositories/order-payment";
import PaymentDetailRepository from "../repositories/payment-detail";
import SerialCodeRepository from "../repositories/serial-code";
import StoreXVariantRepository from "../repositories/store-x-variant";
import ProductVariantRepository from "@medusajs/medusa/dist/repositories/product-variant";
import { EmailLowStock } from "../admin/components/email/low-stock-notificate/index";
import { TransactionBaseService } from "@medusajs/medusa";
import { io } from "../websocket";
import {
  EmailPurchaseCompleted,
  EmailPurchaseSellerCompleted,
} from "../admin/components/email/payments";
import { IsNull } from "typeorm";
import { formatPrice } from "./utils/format-price";
import ProductNotificateRepository from "../repositories/product-notificate";


class OrderPaymentService extends TransactionBaseService {
  static LIFE_TIME = Lifetime.SCOPED;
  protected readonly storeVariantOrderRepository_: typeof StoreVariantOrderRepository;
  protected readonly orderPaymentRepository_: typeof OrderPaymentRepository;
  protected readonly paymentDetailRepository_: typeof PaymentDetailRepository;
  protected readonly storeRepository_: typeof StoreRepository;
  protected readonly serialCodeRepository_: typeof SerialCodeRepository;
  protected readonly storeOrderRepository_: typeof StoreOrderRepository;
  protected readonly storeXVariantRepository_: typeof StoreXVariantRepository;
  protected readonly productVariantRepository_: typeof ProductVariantRepository;
  protected readonly productNotificateRepository_: typeof ProductNotificateRepository;


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
    this.productVariantRepository_ = container.productVariantRepository;
    this.productNotificateRepository_ = container.productNotificateRepository;
  }
  async retriveListStoresToPay() {
    try {
      const storeRepo = this.activeManager_.withRepository(
        this.storeRepository_
      );

      const listStore = await storeRepo
        .createQueryBuilder("s")
        .innerJoinAndSelect("s.wallet", "w")
        .innerJoinAndSelect("s.store_x_variant", "sxv")
        .innerJoinAndSelect("sxv.storeVariantOrder", "svo")
        .innerJoinAndSelect("sxv.variant", "v")
        .innerJoinAndSelect("v.product", "p")
        .innerJoinAndSelect("svo.store_order", "so")
        .innerJoinAndSelect("so.customer", "c")
        .innerJoinAndSelect("p.product_comission", "pc")
        .where("svo.variant_order_status_id NOT IN (:...excludedStatus)", {
          excludedStatus: ["Cancel_ID", "Payment_Pending_ID"],
        })
        .select([
          "s.id AS store_id",
          "s.name AS store_name",
          "s.payment_request AS payment_request",
          "svo.id AS svo_id",
          "svo.created_at AS date_order",
          "svo.quantity AS quantity",
          "svo.variant_order_status_id AS product_order_status",
          "svo.original_price_for_uniti AS price",
          "so.id as order_id",
          "v.title AS product_name",
          "p.thumbnail AS thumbnail",
          "c.first_name AS customer_name",
          "c.last_name AS custommer_last_name",
          "w.wallet_address AS wallet_address",
          "svo.commission_order AS commission",
        ])
        .orderBy("svo.created_at", "DESC")
        .getRawMany();

      const storeMap = new Map();

      listStore.forEach((store) => {
        if (!storeMap.has(store.store_id)) {
          storeMap.set(store.store_id, {
            store_id: store.store_id,
            store_name: store.store_name,
            payment_request: store.payment_request,
            date_order: store.date_order,
            wallet_address: store.wallet_address,
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

        store.product.forEach((item) => {
          const totalPrice = item.price * item.quantity;

          if (item.product_order_status === "Finished_ID") {
            available_balance += totalPrice;
          } else if (
            item.product_order_status === "Completed_ID" ||
            item.product_order_status === "Discussion_ID"
          ) {
            outstanding_balance += totalPrice;
          } else if (item.product_order_status === "Paid_ID") {
            balance_paid += totalPrice;
          }
        });
        store.available_balance = formatPrice(available_balance);
        store.outstanding_balance = formatPrice(outstanding_balance);
        store.balance_paid = formatPrice(
          balance_paid / (1 + Number(process.env.COMMISSION))
        );
      });

      return listStoreXproductsPay;
    } catch (error) {
      console.error(
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
    let newIdNumber = 1001;
    let prefix = "MPG-PAY-";

    const orderPay = await OrderPaymentRepo.createQueryBuilder("order_pay")
      .orderBy("order_pay.created_at", "DESC")
      .getOne();

    if (orderPay && orderPay.id) {
      const lastIdNumber = parseInt(orderPay.id.replace(`${prefix}`, ""), 10);

      if (!isNaN(lastIdNumber)) {
        newIdNumber = lastIdNumber + 1;
      }
    }

    const createOrderPay = await OrderPaymentRepo.create({
      id: `${prefix}${newIdNumber}`,
      amount_paid: dataOrderP.amount_paid,
      payment_note: dataOrderP.payment_note,
      store_id: dataOrderP.store_id,
      voucher: `${
        process.env.BACKEND_URL ?? `http://localhost:${
          process.env.BACKEND_PORT ?? 9000
        }`
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

    const storeRepository = this.activeManager_.withRepository(
      this.storeRepository_
    );

    const update = await storeRepository.update(dataOrderP.store_id, {
      payment_request: false,
    });

    return saverOrderPay;
  }

  async recoverListOrderPayments(idStore) {
    const OrderPaymentRepo = this.activeManager_.withRepository(
      this.orderPaymentRepository_
    );

    const paidOrders = await OrderPaymentRepo.createQueryBuilder("op")
      .innerJoinAndSelect("op.payment_detail", "pd")
      .innerJoinAndSelect("pd.store_variant_order", "svo")
      .innerJoinAndSelect("svo.store_variant", "sv")
      .innerJoinAndSelect("sv.variant", "v")
      .innerJoinAndSelect("v.product", "p")
      .innerJoinAndSelect("p.product_comission", "pc")
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
        "svo.original_price_for_uniti AS product_price",
        "pd.quantity AS  product_quantity",
        "svo.total_price AS total_price",
        "svo.store_order_id AS store_order_id",
        "pc.percentage AS commission",
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
              // price: formatPrice(
              //   payment.product_price / (1 + Number(payment.commission))
              // ),
              quantity: payment.product_quantity,

              total_price: formatPrice(
                payment.total_price / (1 + Number(process.env.COMMISSION))
              ),
              store_order_id: payment.store_order_id,
              customer_name: payment.customer_name,
            },
          ],
        });
      } else {
        paymentdOrdersMap.get(payment.payment_id).products.push({
          name: payment.product_name,
          price: payment.product_price,
          // price: formatPrice(
          //   payment.product_price / (1 + Number(payment.commission))
          // ),
          quantity: payment.product_quantity,
          total_price: formatPrice(
            payment.total_price / (1 + Number(process.env.COMMISSION))
          ),
          store_order_id: payment.store_order_id,
          customer_name: payment.customer_name,
        });
      }
    });

    const listPaymentOrder = Array.from(paymentdOrdersMap.values());

    return listPaymentOrder;
  }

  async successPayOrder(order_id: string) {
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
      const insufficientStockVariants = [];

      const storeOrder = await so.findOne({ where: { id: order_id } });
      if (!storeOrder) {
        throw new Error("Order not found");
      }
      if (storeOrder.order_status_id !== "Payment_Pending_ID") {
        throw new Error("Order status is not pending payment");
      }
      

      const ListSVO = await svo.find({ where: { store_order_id: order_id } });
      
      // for (const variant of ListSVO) {
      //   const quantity = variant.quantity;
      //   const storeVariant = await sv.findOneBy({
      //     id: variant.store_variant_id,
      //   });

      //   if (!storeVariant || storeVariant.quantity_reserved < quantity) {
      //     const variantInfo = await sv
      //       .createQueryBuilder("sv")
      //       .innerJoinAndSelect("sv.variant", "v")
      //       .where("sv.id = :id", { id: variant.store_variant_id })
      //       .select(["v.title AS title"])
      //       .getRawOne();

      //     const variantTitle = variantInfo
      //       ? variantInfo.title
      //       : "Unknown variant";
      //     insufficientStockVariants.push({
      //       title: variantTitle,
      //       requested: quantity,
      //       available: storeVariant ? storeVariant.quantity_reserved : 0,
      //       variant_id: variant.store_variant_id,
      //     });
      //   }
      // }
      // if (insufficientStockVariants.length > 0) {
      //   return {
      //     success: false,
      //     message: "No hay suficiente stock para algunas variaciones",
      //     insufficientStockVariants,
      //   };
      // }

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
            `Stock insuficiente: pidió ${quantity} y sólo había ${serialCodesToUpdate.length}`
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
        await this.compareLowStock(
          variant.store_variant_id,
          storeVariant.quantity_reserved - quantity,
          storeInfo.email_store,
          storeInfo.name_store,
          productVariant[0].title
        );
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
      return true;
    } catch (error) {
      console.error(
        "Error en el servicio para actualizar los datos en la confirmación de la orden:",
        error
      );
      throw error;
    }
  }
  async compareLowStock(
      store_x_variant_id: string,
      quantity: number,
      seller_email: string,
      product_title: string,
      store_name: string
    ) {
      const repo = this.manager_.withRepository(
        this.productNotificateRepository_
      );
    
      const notioficate = await repo.findOne({ where: { store_x_variant_id } });
      if (!notioficate.activate || notioficate.stock_notificate > quantity) {
        return;
      }
      if (notioficate.stock_notificate < quantity) {
        await EmailLowStock({
          email: seller_email,
          product_title: product_title,
          name: store_name,
        });
      }
      return;
    }
}

export default OrderPaymentService;

function truncateToThreeDecimals(value: number): number {
  return Math.floor(value * 1000) / 1000;
}

interface data {
  store_id: string;
  store_name: string;
  date_order: string;
  wallet_address: string;
  product: [
    {
      order_id: string;
      svo_id: string;
      product_name: string;
      thumbnail: string;
      price: string;
      quantity: string;
      customer_name: string;
      product_order_status: string;
    }
  ];
  available_balance: number;
  outstanding_balance: number;
  balance_paid: number;
}
