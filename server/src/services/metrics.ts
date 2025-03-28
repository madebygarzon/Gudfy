import { Lifetime } from "awilix";
import StoreVariantOrderRepository from "../repositories/store-variant-order";

import { TransactionBaseService } from "@medusajs/medusa";
import { io } from "../websocket";
import { EmailPurchaseCompleted } from "../admin/components/email/payments";
import OrderPaymentService from "./order-payment";

class MetricsService extends TransactionBaseService {
  static LIFE_TIME = Lifetime.SCOPED;
  protected readonly storeVariantOrderRepository_: typeof StoreVariantOrderRepository;
  protected readonly orderPaymentService_: OrderPaymentService;

  constructor(container) {
    // @ts-expect-error prefer-rest-params
    super(...arguments);
    this.storeVariantOrderRepository_ = container.storeVariantOrderRepository;
    this.orderPaymentService_ = container.orderPaymentService;
  }

  async metricsSellerAdmin() {
    try {
      const dataMetrics =
        await this.orderPaymentService_.retriveListStoresToPay();

      const result = dataMetrics.map((store) => {
        return {
          store_name: store.store_name,
          total_products_sold: store.product.reduce(
            (acc, prod) => acc + parseInt(prod.quantity),
            0
          ),
          total_balance_paid: store.balance_paid,
        };
      });
      const table = dataMetrics.map((e) => {
        return {
          store_id: e.id,
          store_name: e.store_name,
          date_order: e.date_order,
          wallet_address: e.wallet_address,
          product: e.product.length,
          available_balance: e.available_balance,
          outstanding_balance: e.outstanding_balance,
          balance_paid: e.balance_paid,
        };
      });

      return { metrics: result, table };
    } catch (error) {
      console.log("error en las metricas del administrador para el vendedor");
    }
  }
}
export default MetricsService;
