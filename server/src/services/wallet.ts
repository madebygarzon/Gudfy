import { TransactionBaseService, Customer } from "@medusajs/medusa";
import WalletRepository from "../repositories/wallet";
import PayMethodSellerRepository from "src/repositories/pay-method-seller";
import StoreVariantOrderRepository from "src/repositories/store-variant-order";
import { io } from "../websocket";
import { formatPrice } from "./utils/format-price";
import StoreRepository from "src/repositories/store";
import CommissionService from "./commission";

/**
 * WalletService
 * Gestiona los saldos del vendedor teniendo en cuenta la comisión dinámica.
 */
export default class WalletService extends TransactionBaseService {
  protected readonly walletRepository_: typeof WalletRepository;
  protected readonly payMethodSellerRepository_: typeof PayMethodSellerRepository;
  protected readonly storeVariantOrderRepository_: typeof StoreVariantOrderRepository;
  protected readonly loggedInCustomer_: Customer | null;
  protected readonly storeRepository_: typeof StoreRepository;
  protected readonly commissionService_: CommissionService;

  constructor(container, options) {
    // @ts-expect-error prefer-rest-params
    super(...arguments);
    this.walletRepository_ = container.walletRepository;
    this.payMethodSellerRepository_ = container.payMethodSellerRepository;
    this.storeVariantOrderRepository_ = container.storeVariantOrderRepository;
    this.loggedInCustomer_ = container.loggedInCustomer || "";
    this.storeRepository_ = container.storeRepository;
    this.commissionService_ = container.resolve("commissionService");
  }

  /* -------------------------------- CRUD -------------------------------- */

  async create(idSotore, payMethod) {
    const walletRepository = this.activeManager_.withRepository(this.walletRepository_);
    const payMethodRepo = this.activeManager_.withRepository(this.payMethodSellerRepository_);

    const createWallet = await walletRepository.create({
      store_id: idSotore,
      outstanding_balance: 0,
      available_balance: 0,
      balance_paid: 0,
    });

    const saveWallet = await walletRepository.save(createWallet);

    if (Array.isArray(payMethod)) {
      for (const method of payMethod) {
        const createMethod = await payMethodRepo.create({
          wallet_id: saveWallet.id,
          account_number: method.account_number,
          method: method.method,
        });
        await payMethodRepo.save(createMethod);
      }
    } else {
      const createMethod = await payMethodRepo.create({
        wallet_id: saveWallet.id,
        account_number: payMethod.account_number,
        method: payMethod.method,
      });
      await payMethodRepo.save(createMethod);
    }
  }

  /* ------------------------------ Public API ----------------------------- */

  async retriverWallet() {
    const walletRepository = this.activeManager_.withRepository(this.walletRepository_);
    const storeRepository = this.activeManager_.withRepository(this.storeRepository_);

    const wallet = await walletRepository.findOne({
      where: { store_id: this.loggedInCustomer_.store_id },
    });

    const dataUpdate = await this.updateBalance();
    await walletRepository.update(wallet.id, { ...dataUpdate });

    const updatedWallet = await walletRepository.findOne({ where: { id: wallet.id } });
    const store = await storeRepository.findOne({ where: { id: this.loggedInCustomer_.store_id } });
    return { ...updatedWallet, payment_request: store.payment_request };
  }

  async requestPayment() {
    try {
      const storeRepository = this.activeManager_.withRepository(this.storeRepository_);
      await storeRepository.update(this.loggedInCustomer_.store_id, { payment_request: true });
      return true;
    } catch (error) {
      console.error("Error al solicitar pago", error);
      return false;
    }
  }

  /* ----------------------------- Core logic ------------------------------ */

  /**
   * Obtiene la tasa de comisión para cada productId y la cachea en memoria
   * durante la ejecución de la request.
   */
  private async getRates(productIds: string[]) {
    const rates = new Map<string, number>();
    for (const pid of productIds) {
      if (!rates.has(pid)) {
        const rate = await this.commissionService_.getRate({ productId: pid });
        rates.set(pid, rate);
      }
    }
    return rates;
  }

  /**
   * Recalcula saldos (disponible, pendiente, pagado) descontando la comisión
   * dinámica por producto.
   */
  async updateBalance() {
    const SVORepository = this.activeManager_.withRepository(this.storeVariantOrderRepository_);

    const listSVO = await SVORepository.createQueryBuilder("svo")
      .innerJoinAndSelect("svo.store_order", "so")
      .innerJoinAndSelect("svo.store_variant", "sxv")
      .innerJoinAndSelect("sxv.variant", "pv")
      .innerJoinAndSelect("pv.product", "p")
      .where("sxv.store_id = :store_id", { store_id: this.loggedInCustomer_.store_id })
      .select([
        "svo.quantity     AS quantity",
        "svo.unit_price   AS price",
        "so.order_status_id            AS status_id",
        "svo.variant_order_status_id   AS variant_order_status_id",
        "p.id              AS productId",
      ])
      .getRawMany();

    // Cache de tasas
    const productIds = [...new Set(listSVO.map((i) => i.productId))];
    const ratesMap = await this.getRates(productIds);

    const prices = {
      available_balance: 0,
      outstanding_balance: 0,
      balance_paid: 0,
    };

    listSVO.forEach((item) => {
      const rate = ratesMap.get(item.productId) ?? 0.01; // fallback seguro
      const netUnitPrice = item.price * (1 - rate);
      const totalNet = netUnitPrice * item.quantity;

      switch (item.variant_order_status_id) {
        case "Finished_ID":
          prices.available_balance += totalNet;
          break;
        case "Discussion_ID":
        case "Completed_ID":
          prices.outstanding_balance += totalNet;
          break;
        case "Paid_ID":
          prices.balance_paid += totalNet;
          break;
      }
    });

    return {
      available_balance: formatPrice(prices.available_balance),
      outstanding_balance: formatPrice(prices.outstanding_balance),
      balance_paid: formatPrice(prices.balance_paid),
    };
  }

  async updateWallet(walletAddress: string) {
    const walletRepository = this.activeManager_.withRepository(this.walletRepository_);
    const wallet = await walletRepository.findOne({ where: { store_id: this.loggedInCustomer_.store_id } });
    await walletRepository.update(wallet.id, { wallet_address: walletAddress });
    return true;
  }
}

