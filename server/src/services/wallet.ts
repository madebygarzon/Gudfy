import { TransactionBaseService, Customer } from "@medusajs/medusa";
import WalletRepository from "../repositories/wallet";
import PayMethodSellerRepository from "src/repositories/pay-method-seller";
import StoreVariantOrderRepository from "src/repositories/store-variant-order";
import { io } from "../websocket";
import { formatPrice } from "./utils/format-price";
import StoreRepository from "src/repositories/store";

export default class WalletService extends TransactionBaseService {
  protected readonly walletRepository_: typeof WalletRepository;
  protected readonly payMethodSellerRepository_: typeof PayMethodSellerRepository;
  protected readonly storeVariantOrderRepository_: typeof StoreVariantOrderRepository;
  protected readonly loggedInCustomer_: Customer | null;
  protected readonly storeRepository_: typeof StoreRepository;

  constructor(container, options) {
    // @ts-expect-error prefer-rest-params
    super(...arguments);
    this.walletRepository_ = container.walletRepository;
    this.payMethodSellerRepository_ = container.payMethodSellerRepository;
    this.storeVariantOrderRepository_ = container.storeVariantOrderRepository;
    this.loggedInCustomer_ = container.loggedInCustomer || "";
    this.storeRepository_ = container.storeRepository;
  }

  async create(idSotore, payMethod) {
    const walletRepository = this.activeManager_.withRepository(
      this.walletRepository_
    );
    const payMethodRepo = this.activeManager_.withRepository(
      this.payMethodSellerRepository_
    );

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
  async retriverWallet() {
    const walletRepository = this.activeManager_.withRepository(
      this.walletRepository_
    );
    const storeRepository = this.activeManager_.withRepository(
      this.storeRepository_
    );
    const store_wallet_id = await walletRepository.findOne({
      where: { store_id: this.loggedInCustomer_.store_id },
    });
    const dataUpdate = await this.updateBalance();
    const update = await walletRepository.update(store_wallet_id.id, {
      ...dataUpdate,
    });

    const updatedWallet = await walletRepository.findOne({
      where: { id: store_wallet_id.id },
    });

   
    const store = await storeRepository.findOne({
      where: { id: this.loggedInCustomer_.store_id },
    });
    return {...updatedWallet, payment_request: store.payment_request};
  }

  async requestPayment() {
    try {
      const storeRepository = this.activeManager_.withRepository(
        this.storeRepository_
      );
      
      const update = await storeRepository.update(this.loggedInCustomer_.store_id, {
        payment_request: true,
      });
      return true;
    } catch (error) {
      console.log("Error al solicitar pago", error);
      return false;
    }
  }

  async updateBalance() {
    const SVORepository = this.activeManager_.withRepository(
      this.storeVariantOrderRepository_
    );
    const walletRepository = this.activeManager_.withRepository(
      this.walletRepository_
    );

    const listSVO = await SVORepository.createQueryBuilder("svo")
      .innerJoinAndSelect("svo.store_order", "so")
      .innerJoinAndSelect("svo.store_variant", "sxv")
      .innerJoinAndSelect("sxv.variant", "pv")
      .innerJoinAndSelect("pv.product", "p")
      .where("sxv.store_id = :store_id", {
        store_id: this.loggedInCustomer_.store_id,
      })
      .select([
        "sxv.id AS storeXVariantId",
        "svo.quantity AS quantity",
        "svo.unit_price AS price",
        "sxv.store_id AS storeId",
        "sxv.variant_id AS variantId",
        "so.order_status_id AS status_id",
        "svo.variant_order_status_id AS variant_order_status_id",
        "pv.id AS productVariantId",
        "pv.title AS productVariantTitle",
        "pv.product_id AS productId",
        "p.title AS productTitle",
        "p.thumbnail AS thumbnail",
        "p.description AS description",
      ])
      .getRawMany();

    const prices = {
      available_balance: 0,
      outstanding_balance: 0,
      balance_paid: 0,
    };

    listSVO.forEach((item) => {
      item.price = formatPrice(item.price - item.price * 0.01);
    })

    listSVO.forEach((item) => {
      const totalProductPrice = item.price * item.quantity;
      if (item.variant_order_status_id === "Finished_ID") {
        // Si el pedido está en estado "Finished_ID"
        prices.available_balance += formatPrice(totalProductPrice - (totalProductPrice * 0.01));
      } else if (
        item.variant_order_status_id === "Discussion_ID" ||
        item.variant_order_status_id === "Completed_ID"
      ) {
        // Si el pedido está en estado "Discussion_ID" o "Completed_ID"
        prices.outstanding_balance += formatPrice(totalProductPrice - (totalProductPrice * 0.01));
      } else if (item.variant_order_status_id == "Paid_ID") {
        prices.balance_paid += formatPrice(totalProductPrice - (totalProductPrice * 0.01));
      }
    });

    return prices;
  }
}
