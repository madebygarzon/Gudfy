import { Lifetime } from "awilix";
import { TransactionBaseService } from "@medusajs/medusa";
import ProductNotificateRepository from "../repositories/product-notificate";
import { EmailLowStock } from "../admin/components/email/low-stock-notificate/index";
import { Customer } from "@medusajs/medusa";

export default class ProductNotificateService extends TransactionBaseService {
  static LIFE_TIME = Lifetime.SCOPED;
  protected readonly loggedInCustomer_: Customer | null | undefined;

  protected readonly productNotificateRepository_: typeof ProductNotificateRepository;

  constructor({ productNotificateRepository, loggedInCustomer }) {
    // @ts-expect-error prefer-rest-params
    super(...arguments);
    this.productNotificateRepository_ = productNotificateRepository;
    this.loggedInCustomer_ = loggedInCustomer;

  }

  async stepNotificate(
    store_x_variant_id: string,
    stock_notificate: number,
    activate: boolean
  ) {
    const productNotificate = await this.findNotificate(store_x_variant_id);

    if (!productNotificate) {
      return await this.createNotificate(
        store_x_variant_id,
        stock_notificate,
        activate
      );
    }
    await this.updateNotificate(store_x_variant_id, stock_notificate, activate);
    return;
  }

  async findNotificate(store_x_variant_id: string) {
    const repo = this.manager_.withRepository(
      this.productNotificateRepository_
    );
    const comission = await repo.findOne({ where: { store_x_variant_id } });
    return comission;
  }

  async createNotificate(
    store_x_variant_id: string,
    stock_notificate: number,
    activate: boolean
  ) {
    const repo = this.manager_.withRepository(
      this.productNotificateRepository_
    );
    const comission = await repo.create({
      store_x_variant_id,
      stock_notificate,
      activate,
    });
    await repo.save(comission);
    return comission;
  }

  async updateNotificate(
    store_x_variant_id: string,
    stock_notificate: number,
    activate: boolean
  ) {
    const repo = this.manager_.withRepository(
      this.productNotificateRepository_
    );
    const comission = await repo.findOne({ where: { store_x_variant_id } });
    if (!comission) {
      throw new Error("Comission not found");
    }
    comission.stock_notificate = stock_notificate;
    comission.activate = activate;
    await repo.save(comission);
    return comission;
  }

  async listNotificate(store_id: string) {
    const repo = this.manager_.withRepository(
      this.productNotificateRepository_
    );
    const listNotificate = await repo
      .createQueryBuilder("pn")
      .leftJoinAndSelect("pn.store_x_variant", "sv")
      .leftJoinAndSelect("sv.store", "s")
      .where("s.id = :store_id", { store_id })
      .getMany();
    return listNotificate;
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
    if (!notioficate && !notioficate.activate || notioficate.stock_notificate > quantity) {
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

  async getLowStockForSeller() {
   
    const repo = this.manager_.withRepository(
      this.productNotificateRepository_
    );
    const listNotificate = await repo
      .createQueryBuilder("pn")
      .leftJoinAndSelect("pn.store_x_variant", "sv")
      .leftJoinAndSelect("sv.store", "s")
      .where("s.id = :store_id", { store_id: this.loggedInCustomer_.store_id })
      .andWhere("pn.activate = :activate", { activate: true })
      .select([
        "sv.id as store_x_variant_id",
      ])
      .getRawMany();

    return listNotificate.map((item) => item.store_x_variant_id);
  }
}
