import { Lifetime } from "awilix";
import StoreVariantOrderRepository from "../repositories/store-variant-order";
import StoreRepository from "../repositories/store";
import { TransactionBaseService } from "@medusajs/medusa";
import { io } from "../websocket";
import { EmailPurchaseCompleted } from "../admin/components/email/payments";
import OrderPaymentService from "./order-payment";
import { Email } from "src/admin/components/email/email-recovery-pasword";
import { formatPrice } from "./utils/format-price";

class MetricsService extends TransactionBaseService {
  static LIFE_TIME = Lifetime.SCOPED;
  protected readonly storeVariantOrderRepository_: typeof StoreVariantOrderRepository;
  protected readonly storeRepository_: typeof StoreRepository;

  constructor(container) {
    // @ts-expect-error prefer-rest-params
    super(...arguments);
    this.storeVariantOrderRepository_ = container.storeVariantOrderRepository;
    this.storeRepository_ = container.storeRepository;
  }

  async metricsSellerAdmin() {
    try {
      const dataMetrics = await this.retriveListStoresToPay();

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
          email: e.email,
          phone: e.phone,
        };
      });

      return { metrics: result, table };
    } catch (error) {
      console.log("error en las metricas del administrador para el vendedor");
    }
  }

  async retriveListStoresToPay() {
    try {
      const storeRepo = this.activeManager_.withRepository(
        this.storeRepository_
      );

      const allStores = await storeRepo
        .createQueryBuilder("s")
        .leftJoinAndSelect("s.wallet", "w")
        .leftJoinAndSelect("s.members", "c")
        .select([
          "s.id AS store_id",
          "s.name AS store_name",
          "s.created_at AS date_order",
          "w.wallet_address AS wallet_address",
          "c.first_name AS customer_name",
          "c.last_name AS custommer_last_name",
          "c.email AS email",
          "c.phone AS phone",
        ])
        .getRawMany();

      const listStore = await storeRepo
        .createQueryBuilder("s")
        .leftJoinAndSelect("s.wallet", "w")
        .leftJoinAndSelect("s.store_x_variant", "sxv")
        .leftJoinAndSelect("sxv.storeVariantOrder", "svo")
        .leftJoinAndSelect("sxv.variant", "v")
        .leftJoinAndSelect("v.product", "p")
        .leftJoinAndSelect("svo.store_order", "so")
        .leftJoinAndSelect("s.members", "c")
        .where("svo.variant_order_status_id NOT IN (:...excludedStatus) OR svo.variant_order_status_id IS NULL", {
          excludedStatus: ["Cancel_ID", "Payment_Pending_ID"],
        })
        .select([
          "s.id AS store_id",
          "s.name AS store_name",
          "svo.id AS svo_id",
          "svo.created_at AS date_order",
          "svo.quantity AS quantity",
          "svo.variant_order_status_id AS product_order_status",
          "svo.unit_price AS price",
          "so.id as order_id",
          "c.first_name AS customer_name",
          "c.last_name AS custommer_last_name",
          "c.email AS email",
          "c.phone AS phone",
          "w.wallet_address AS wallet_address",
        ])
        .orderBy("svo.created_at", "DESC")
        .getRawMany();

      // Inicializamos el mapa con todas las tiendas
      const storeMap = new Map();
      
      // Primero agregamos todas las tiendas al mapa (incluso las que no tienen productos)
      allStores.forEach((store) => {
        storeMap.set(store.store_id, {
          store_id: store.store_id,
          store_name: store.store_name,
          date_order: store.date_order,
          wallet_address: store.wallet_address || '',
          email: store.email || '',
          phone: store.phone || '',
          product: [],
          available_balance: 0,
          outstanding_balance: 0,
          balance_paid: 0
        });
      });

      // Luego procesamos los datos de productos para las tiendas que los tienen
      listStore.forEach((store) => {
        // Si el store_id es null o no hay order_id, ignoramos este registro
        if (!store.store_id || !store.order_id) return;
        
        // Si la tienda no está en el mapa (lo cual no debería ocurrir), la agregamos
        if (!storeMap.has(store.store_id)) {
          storeMap.set(store.store_id, {
            store_id: store.store_id,
            store_name: store.store_name,
            date_order: store.date_order,
            wallet_address: store.wallet_address || '',
            email: store.email || '',
            phone: store.phone || '',
            product: [],
            available_balance: 0,
            outstanding_balance: 0,
            balance_paid: 0
          });
        }
        
        // Solo agregamos el producto si tiene todos los datos necesarios
        if (store.svo_id && store.price && store.quantity) {
          storeMap.get(store.store_id).product.push({
            order_id: store.order_id,
            svo_id: store.svo_id,
            price: store.price,
            quantity: store.quantity,
            customer_name: store.customer_name && store.custommer_last_name ? 
              store.customer_name + " " + store.custommer_last_name : 'Sin nombre',
            product_order_status: store.product_order_status || 'Sin estado',
          });
        }
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
        store.available_balance = formatPrice(available_balance);
        store.outstanding_balance = formatPrice(outstanding_balance);
        store.balance_paid = formatPrice(balance_paid);
      });

      return listStoreXproductsPay;
    } catch (error) {
      console.log(
        "error en el servicio al intentar enlistar las tiendas para su pago",
        error
      );
    }
  }
}
export default MetricsService;
