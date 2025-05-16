import { Lifetime } from "awilix";
import { unlink } from "fs";

import { TransactionBaseService, Customer } from "@medusajs/medusa";
import { SellerApplicationRepository } from "../repositories/seller-application";
import { ApplicationDataRepository } from "../repositories/application-data";
import CustomerRepository from "../repositories/customer";
import { StoreReviewRepository } from "src/repositories/store-review";
import CustomerService from "./customer";
import {
  ApprovedEmailSellerApplication,
  CorrectionEmailSellerApplication,
  RejectedEmailSellerApplication,
  SendEmailSellerApplication,
} from "../admin/components/email/index";

type updateSellerAplication = {
  payload: string;
  customer_id: string;
};

export default class SellerAdminService extends TransactionBaseService {
  static LIFE_TIME = Lifetime.SCOPED;
  protected readonly applicationDataRepository_: typeof ApplicationDataRepository;
  protected readonly sellerApplicationRepository_: typeof SellerApplicationRepository;
  protected readonly customerRepository_: typeof CustomerRepository;
  protected readonly storeReviewRepository_: typeof StoreReviewRepository;
  protected readonly customerService_: CustomerService;

  constructor({
    applicationDataRepository,
    sellerApplicationRepository,
    customerRepository,
    storeReviewRepository,
    customerService,
  }) {
    // @ts-expect-error prefer-rest-params
    super(...arguments);
    try {
      this.applicationDataRepository_ = applicationDataRepository;
      this.sellerApplicationRepository_ = sellerApplicationRepository;
      this.customerRepository_ = customerRepository;
      this.storeReviewRepository_ = storeReviewRepository;
      this.customerService_ = customerService;
    } catch (e) {
      // avoid errors when backend first runs
    }
  }

  async getProductsByStore(storeId: string) {
    const manager = this.activeManager_;

    const sql = `
    SELECT
      s.id                          AS store_id,
      s.name                        AS store_name,
      p.title                       AS product,
      pv.title                      AS variant,
      sxv.quantity_store            AS inventory,
      sxv.quantity_reserved         AS reserved,
      (sxv.quantity_store - sxv.quantity_reserved) AS available,
      /* totales por tienda */
      COUNT(*)  OVER (PARTITION BY s.id)                            AS total_variants,
      SUM(sxv.quantity_store)           OVER (PARTITION BY s.id)    AS total_inventory,
      SUM(sxv.quantity_reserved)        OVER (PARTITION BY s.id)    AS total_reserved,
      SUM(sxv.quantity_store - sxv.quantity_reserved)
                                        OVER (PARTITION BY s.id)    AS total_available
    FROM store               s
    JOIN store_x_variant      sxv ON s.id = sxv.store_id
    JOIN product_variant      pv  ON pv.id = sxv.variant_id
    JOIN product              p   ON p.id = pv.product_id
    WHERE s.id = $1
    ORDER BY p.title, pv.title;
  `;

    const rows = await manager.query(sql, [storeId]);

    // devolvemos: {summary, details[]}
    if (!rows.length) return { summary: null, details: [] };

    const first = rows[0];
    const summary = {
      store_id: first.store_id,
      store_name: first.store_name,
      total_variants: Number(first.total_variants),
      total_inventory: Number(first.total_inventory),
      total_reserved: Number(first.total_reserved),
      total_available: Number(first.total_available),
    };

    const details = rows.map((r) => ({
      product: r.product,
      variant: r.variant,
      inventory: Number(r.inventory),
      reserved: Number(r.reserved),
      available: Number(r.available),
    }));

    return { summary, details };
  }

  async getSellerList() {
    try {
      const repoCustomer = this.activeManager_.withRepository(
        this.customerRepository_
      );

      const sellers = await repoCustomer
        .createQueryBuilder("c")
        .innerJoinAndSelect("c.store", "s")
        .leftJoin(
          (qb) =>
            qb
              .from("store_review", "r")
              .select("r.store_id", "store_id")
              .addSelect("COUNT(r.id)", "review_count")
              .groupBy("r.store_id"),
          "review_counts",
          "review_counts.store_id = s.id"
        )

        .leftJoin(
          (qb) =>
            qb
              .from("product", "p")
              .select("p.store_id", "store_id")
              .addSelect("COUNT(DISTINCT p.id)", "product_count")
              .groupBy("p.store_id"),
          "product_counts",
          "product_counts.store_id = s.id"
        )

        .leftJoin(
          (qb) =>
            qb
              .from("store_x_variant", "sxv")
              .select("sxv.store_id", "store_id")
              .addSelect("COALESCE(SUM(sxv.quantity_store),0)", "stock_total")
              .groupBy("sxv.store_id"),
          "stock_totals",
          "stock_totals.store_id = s.id"
        )

        .where("c.store_id IS NOT NULL")

        .select([
          "s.id                       AS store_id",
          "s.name                     AS store_name",
          "c.id                       AS id_seller",
          "c.first_name               AS first_name",
          "c.last_name                AS last_name",
          "c.email                    AS email",
          "c.phone                    AS phone",
          "COALESCE(review_counts.review_count,0)       AS review_count",
          "COALESCE(product_counts.product_count,0)     AS product_count",
          "COALESCE(stock_totals.stock_total,0)         AS stock_total",
        ])
        .getRawMany();

      const sellersList = sellers.map((s) => ({
        store_id: s.store_id,
        store_name: s.store_name,
        id_seller: s.id_seller,
        seller_name: `${s.first_name} ${s.last_name}`,
        email: s.email,
        phone: s.phone,
        review: parseInt(s.review_count, 10),
        product_count: parseInt(s.product_count, 10),
        stock_total: parseInt(s.stock_total, 10),
      }));

      return sellersList;
    } catch (error) {
      console.log("error en el servicio al recuperar los vendedores", error);
      throw error;
    }
  }

  async getSellersReviewsList(id_seller) {
    try {
      const repoStoreReviews = this.activeManager_.withRepository(
        this.storeReviewRepository_
      );
      const listReviews = await repoStoreReviews.find({
        where: { store_id: id_seller },
      });
      return listReviews || [];
    } catch (error) {
      console.log("error en el servicio al recuperar los vendedores", error);
    }
  }

  async getListApplication(order) {
    try {
      const sellerApplicationRepository = this.activeManager_.withRepository(
        this.sellerApplicationRepository_
      );

      const getList = await sellerApplicationRepository.find({
        order: { created_at: order },
        relations: ["state_application", "application_data"],
      });

      const dataList = await Promise.all(
        getList.map(async (data) => {
          const dataCustomer = await this.retrieveCustomer(data.customer_id);
          return {
            ...data,
            customer: dataCustomer,
          };
        })
      );

      return dataList;
    } catch (error) {
      console.log(error);
    }
  }

  async updateSellerAplication(payload, customer_id, comment_status?) {
    const sellerApplicationRepository = this.activeManager_.withRepository(
      this.sellerApplicationRepository_
    );
    if (!payload || !customer_id) {
      throw new Error(
        "Updating a product review requires payload, customer_id"
      );
    }
    if (payload === "REJECTED" && !comment_status) {
      throw new Error("A comment is expected, comment_status");
    }
    const customer = await this.retrieveCustomer(customer_id);
    if (payload === "APPROVED") {
      const sellerApplication = await sellerApplicationRepository.update(
        { customer_id: customer_id },
        {
          state_application_id: "A",
        }
      );

      const sellerApplicationData = await sellerApplicationRepository
        .createQueryBuilder("sa")
        .innerJoinAndSelect("sa.application_data", "ad")
        .where("sa.customer_id = :customer_id", { customer_id })
        .select(["ad.field_payment_method_1 AS wallet_address"])
        .getRawMany();

      // se crea una tienda solamente si la solicitud esta aprovada.
      //createStore() tiene una validacion la cual retorna si ya tiene una tienda asociada
      await this.customerService_.createStoreANDWallet(
        customer_id,
        sellerApplicationData[0].wallet_address
      );
      await ApprovedEmailSellerApplication({
        name: customer.name,
        email: customer.email,
      });
      return sellerApplication;
    } else if (payload === "REJECTED") {
      const sellerApplication = await sellerApplicationRepository.update(
        { customer_id: customer_id },
        {
          state_application_id: "B",
          comment_status: comment_status,
        }
      );
      RejectedEmailSellerApplication({
        name: customer.name,
        email: customer.email,
        message: comment_status,
      });
      return sellerApplication;
    } else if (payload === "CORRECT") {
      const sellerApplication = await sellerApplicationRepository.update(
        { customer_id: customer_id },
        {
          state_application_id: "D",
          comment_status: comment_status,
        }
      );
      await CorrectionEmailSellerApplication({
        name: customer.name,
        email: customer.email,
        message: comment_status,
      });
      return sellerApplication;
    }
    return;
  }
  private async retrieveCustomer(customerId: string) {
    const customerRepository = this.manager_.withRepository(
      this.customerRepository_
    );
    const dataCustomer = await customerRepository.findOne({
      where: {
        id: customerId,
      },
    });
    return {
      name: `${dataCustomer.first_name} ${dataCustomer.last_name}`,
      email: dataCustomer.email,
    };
  }
  async getComment(customer_id) {
    const commentSellerApplication = this.manager_.withRepository(
      this.sellerApplicationRepository_
    );
    const comment = await commentSellerApplication.findOne({
      where: {
        customer_id: customer_id,
      },
    });
    return comment;
  }

  async updateComment(customer_id, comment_status) {
    const sellerApplicationRepository = this.activeManager_.withRepository(
      this.sellerApplicationRepository_
    );
    if (!customer_id) {
      throw new Error("Updating a product review requires  customer_id");
    }

    const sellerApplication = await sellerApplicationRepository.update(
      { customer_id: customer_id },
      { comment_status: comment_status }
    );

    return sellerApplication;
  }
}
