import { Lifetime } from "awilix";
import { TransactionBaseService, Customer } from "@medusajs/medusa";
import { SellerApplicationRepository } from "../repositories/seller-application";
import { ApplicationDataRepository } from "../repositories/application-data";
import CustomerRepository from "../repositories/customer";
import CustomerService from "./customer";

type updateSellerAplication = {
  payload: string;
  customer_id: string;
};

export default class SellerApplicationService extends TransactionBaseService {
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

  async create(
    applicationData,
    frontDocument,
    reversDocument,
    addressDocument
  ) {
    try {
      if (!this.loggedInCustomer_)
        throw new Error(
          "Adding the data required for create seller application"
        );

      const sellerApplicationRepository = this.activeManager_.withRepository(
        this.sellerApplicationRepository_
      );
      const ApplicationDataRepository = this.activeManager_.withRepository(
        this.applicationDataRepository_
      );
      const createApplication_data = await ApplicationDataRepository.create({
        ...applicationData,
        front_identity_document: frontDocument,
        revers_identity_document: reversDocument,
        address_proof: addressDocument,
      });

      const saveCreateApplication_data = await ApplicationDataRepository.save(
        createApplication_data
      );

      const dataSellerApplication = {
        customer_id: this.loggedInCustomer_.id,
        application_data_id: saveCreateApplication_data["id"],
        state_application_id: "C",
        role_seller: "suplier",
      };

      const createSellerapplication = await sellerApplicationRepository.create(
        dataSellerApplication
      );
      const sellerapplication = await sellerApplicationRepository.save(
        createSellerapplication
      );

      return sellerapplication;
    } catch (error) {
      console.log("Error in the create application for seller", error);
    }
  }

  async getApplication() {
    if (!this.loggedInCustomer_)
      throw new Error("Adding the data required for the seller application");
    const sellerApplicationRepository = this.activeManager_.withRepository(
      this.sellerApplicationRepository_
    );
    const getApplication = await sellerApplicationRepository.findOne({
      where: {
        customer_id: this.loggedInCustomer_.id,
      },
      relations: ["state_application"],
    });

    // identificar si la persona a aplicado
    if (getApplication) {
      return {
        application: true,
        state: getApplication.state_application.state,
      };
    }
    return { application: false, state: "" };
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
    if (payload === "APPROVED") {
      const sellerApplication = await sellerApplicationRepository.update(
        { customer_id: customer_id },
        {
          state_application_id: "A",
        }
      );

      // se crea una tienda solamente si la solicitud esta aprovada.
      //createStore() tiene una validacion la cual retorna si ya tiene una tienda asociada
      await this.customerService_.createStore(customer_id);

      return sellerApplication;
    } else if (payload === "REJECTED") {
      const sellerApplication = await sellerApplicationRepository.update(
        { customer_id: customer_id },
        {
          state_application_id: "B",
          comment_status: comment_status,
        }
      );
      return sellerApplication;
    } else if (payload === "CORRECT") {
      const sellerApplication = await sellerApplicationRepository.update(
        { customer_id: customer_id },
        {
          state_application_id: "D",
          comment_status: comment_status,
        }
      );
      return sellerApplication;
    } else if (payload === "CORRECT") {
      const sellerApplication = await sellerApplicationRepository.update(
        { customer_id: customer_id },
        {
          state_application_id: "E",
        }
      );
      return sellerApplication;
    }
    return;
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
}
