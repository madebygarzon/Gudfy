import { Lifetime } from "awilix";
import { CustomerService as MedusaCustomerService } from "@medusajs/medusa";
import { Customer } from "../models/customer";
import {
  UpdateCustomerInput as MedusaUpdateCustomerInput,
  AdminListCustomerSelector,
} from "@medusajs/medusa/dist/types/customers";
import StoreRepository from "../repositories/store";

type UpdateCustomerInput = {
  store_id?: string;
} & MedusaUpdateCustomerInput;

class CustomerService extends MedusaCustomerService {
  static LIFE_TIME = Lifetime.SCOPED;
  protected readonly loggedInCustomer_: Customer | null;
  protected readonly storeRepository_: typeof StoreRepository;

  constructor(container, options) {
    // @ts-expect-error prefer-rest-params
    super(...arguments);
    this.storeRepository_ = container.storeRepository;

    try {
      this.loggedInCustomer_ = container.loggedInCustomer;
    } catch (e) {
      // avoid errors when backend first runs
    }
  }

  async retrieve(customerId: string): Promise<Customer | undefined> {
    const customerRepository = this.manager_.withRepository(
      this.customerRepository_
    );
    return await customerRepository.findOne({
      where: {
        id: customerId,
      },
    });
  }

  async createStore(
    customerId: string,
    customer: UpdateCustomerInput
  ): Promise<Customer> {
    console.log(customerId);
    if (!customer.store_id) {
      const storeRepo = this.manager_.withRepository(this.storeRepository_);
      let newStore = storeRepo.create();
      newStore = await storeRepo.save(newStore);

      const updateData: UpdateCustomerInput = {
        ...customer,
        store_id: newStore.id,
      };
      await super
        .update(customerId, updateData)
        .then((e) => console.log("update", e));
      return;
    }
  }
}

export default CustomerService;
