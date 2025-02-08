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
