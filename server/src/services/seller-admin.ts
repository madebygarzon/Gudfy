import { Lifetime } from "awilix";
import { unlink } from "fs";

import { TransactionBaseService, Customer } from "@medusajs/medusa";
import { SellerApplicationRepository } from "../repositories/seller-application";
import { ApplicationDataRepository } from "../repositories/application-data";
import CustomerRepository from "../repositories/customer";
import { StoreReviewRepository } from "src/repositories/store-review";
import CustomerService from "./customer";

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

  constructor({
    applicationDataRepository,
    sellerApplicationRepository,
    customerRepository,
    storeReviewRepository,
  }) {
    // @ts-expect-error prefer-rest-params
    super(...arguments);
    try {
      this.applicationDataRepository_ = applicationDataRepository;
      this.sellerApplicationRepository_ = sellerApplicationRepository;
      this.customerRepository_ = customerRepository;
      this.storeReviewRepository_ = storeReviewRepository;
    } catch (e) {
      // avoid errors when backend first runs
    }
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
        .where("c.store_id IS NOT NULL")
        .select([
          "s.id AS store_id",
          "s.name AS store_name",
          "c.id AS id_seller",
          "c.first_name AS first_name",
          "c.last_name AS last_name",
          "c.email AS email",
          "c.phone AS phone",
          "COALESCE(review_counts.review_count, 0) AS review_count",
        ])
        .getRawMany();

      const sellersList = sellers.map((seller) => ({
        store_id: seller.store_id,
        store_name: seller.store_name,
        id_seller: seller.id_seller,
        seller_name: `${seller.first_name} ${seller.last_name}`,
        email: seller.email,
        phone: seller.phone,
        review: parseInt(seller.review_count, 10),
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
}
