import { Lifetime } from "awilix";
import { unlink } from "fs";

import { TransactionBaseService, Customer } from "@medusajs/medusa";
import { SellerApplicationRepository } from "../repositories/seller-application";
import { ApplicationDataRepository } from "../repositories/application-data";
import CustomerRepository from "../repositories/customer";
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

export default class SellerService extends TransactionBaseService {
  static LIFE_TIME = Lifetime.SCOPED;
  protected readonly applicationDataRepository_: typeof ApplicationDataRepository;
  protected readonly sellerApplicationRepository_: typeof SellerApplicationRepository;
  protected readonly customerRepository_: typeof CustomerRepository;
  protected readonly customerService_: CustomerService;
  protected readonly loggedInCustomer_: Customer | null | undefined;

  constructor({
    loggedInCustomer,
    applicationDataRepository,
    sellerApplicationRepository,
    customerRepository,
    customerService,
  }) {
    // @ts-expect-error prefer-rest-params
    super(...arguments);
    try {
      this.loggedInCustomer_ = loggedInCustomer;
      this.applicationDataRepository_ = applicationDataRepository;
      this.sellerApplicationRepository_ = sellerApplicationRepository;
      this.customerRepository_ = customerRepository;
      this.customerService_ = customerService;
    } catch (e) {
      // avoid errors when backend first runs
    }
  }

  async getListSeller() {
    try {
      const repoCustomer = this.activeManager_.withRepository(
        this.customerRepository_
      );

      const sellers = await repoCustomer
        .createQueryBuilder("c")
        .innerJoinAndSelect("c.store", "s")
        .innerJoinAndSelect("s.review", "r")
        .where("c.store_id IS NOT NULL")
        .select([
          "s.id AS store_id ",
          "s.name AS store_name ",
          "c.id AS id_seller",
          "c.first_name AS first_name",
          "c.last_name AS last_name",
          "c.email AS email",
          "c.phone AS phone",
          "r.id AS id_review",
          "r.customer AS customer",
          "r.rating AS rating",
          "r.content AS content",
          "r.approved AS approved",
          "r.created_at AS date",
        ])
        .getRawMany();

      const sellerMap = new Map();

      sellers.forEach((seller) => {
        if (!sellerMap.has(seller.store_id)) {
          sellerMap.set(seller.store_id, {
            store_id: seller.store_id,
            store_name: seller.store_name,
            id_seller: seller.id_seller,
            first_name: seller.first_name,
            last_name: seller.last_name,
            email: seller.email,
            phone: seller.phone,
            review: [
              {
                id_review: seller.id_review,
                customer: seller.customer,
                rating: seller.rating,
                content: seller.content,
                approved: seller.approved,
                date: seller.date,
              },
            ],
          });
        } else {
          sellerMap.get(seller.store_id).review.push({
            id_review: seller.id_review,
            customer: seller.customer,
            rating: seller.rating,
            content: seller.content,
            approved: seller.approved,
            date: seller.date,
          });
        }
      });

      const sellersList = Array.from(sellerMap.values());

      return sellersList;
    } catch (error) {
      console.log("error en el servicio al recuperar los vendedores", error);
    }
  }
}
