import { Lifetime } from "awilix";
import { CustomerService as MedusaCustomerService } from "@medusajs/medusa";
import { Customer } from "../models/customer";
import {
  UpdateCustomerInput as MedusaUpdateCustomerInput,
  CreateCustomerInput as MedusaCreateCustomerInput,
} from "@medusajs/medusa/dist/types/customers";
import StoreRepository from "../repositories/store";
import CustomerRoleRepository from "../repositories/customer-role";
import StoreOrderRepository from "../repositories/store-order";
import WalletRepository from "../repositories/wallet";

type UpdateCustomerInput = {
  store_id?: string;
} & MedusaUpdateCustomerInput;

type CreateCustomerInput = {
  role_id?: number;
} & MedusaCreateCustomerInput;

class CustomerService extends MedusaCustomerService {
  static LIFE_TIME = Lifetime.SCOPED;

  protected readonly storeRepository_: typeof StoreRepository;
  protected readonly customerRoleRepository_: typeof CustomerRoleRepository;
  protected readonly storeOrderRepository_: typeof StoreOrderRepository;
  protected readonly walletRepository_: typeof WalletRepository;

  constructor(container, options) {
    // @ts-expect-error prefer-rest-params
    super(...arguments);
    this.storeRepository_ = container.storeRepository;
    this.customerRoleRepository_ = container.customerRoleRepository;
    this.storeOrderRepository_ = container.storeOrderRepository;
    this.walletRepository_ = container.walletRepository;
  }

  async createStoreANDWallet(
    customerId: string,
    wallet_address: string
  ): Promise<Customer> {
    const customerRepository = this.manager_.withRepository(
      this.customerRepository_
    );
    const walletRepository = this.manager_.withRepository(
      this.walletRepository_
    );

    const customer = await customerRepository.findOne({
      where: {
        id: customerId,
      },
    });

    if (customer.store_id) return;

    const storeRepo = this.manager_.withRepository(this.storeRepository_);
    let newStore = await storeRepo.create({
      name: generateRandomStoreName(),
      avatar: "/account/avatars/avatar_aguila.png",
    });
    newStore = await storeRepo.save(newStore);

    let newWallet = await walletRepository.create({
      wallet_address,
      store_id: newStore.id,
      available_balance: 0,
      outstanding_balance: 0,
      balance_paid: 0,
    });

    newWallet = await walletRepository.save(newWallet);

    const updateData: UpdateCustomerInput = {
      ...customer,
      store_id: newStore.id,
    };

    await super.update(customerId, updateData);
    return;
  }

  async create(customer: CreateCustomerInput): Promise<Customer> {
    const dataCustomer: CreateCustomerInput = {
      ...customer,
      role_id: 1,
    };

    return await super.create(dataCustomer);
  }
  async numberOfCompletedOrders(id) {
    const storeOrderRepository = this.manager_.withRepository(
      this.storeOrderRepository_
    );
    const customer_id = id;

    const count = await storeOrderRepository
      .createQueryBuilder("so")
      .where("so.customer_id = :customer_id", { customer_id })
      .andWhere("so.order_status_id IN (:...statuses)", {
        statuses: ["Finished_ID", "Completed_ID"],
      })
      .getCount();

    return count || 0;
  }
}
const adjectives = [
  "Happy",
  "Sad",
  "Bright",
  "Dark",
  "Strong",
  "Weak",
  "Fast",
  "Slow",
  "Big",
  "Small",
  "Friendly",
  "Angry",
  "Quiet",
  "Loud",
  "Sharp",
  "Soft",
  "Clean",
  "Dirty",
  "Brave",
  "Calm",
];

// Animals list
const animals = [
  "Lion",
  "Tiger",
  "Elephant",
  "Giraffe",
  "Zebra",
  "Kangaroo",
  "Penguin",
  "Dolphin",
  "Shark",
  "Eagle",
  "Owl",
  "Rabbit",
  "Bear",
  "Wolf",
  "Fox",
  "Snake",
  "Turtle",
  "Frog",
  "Horse",
  "Monkey",
];

const generateRandomStoreName = (): string => {
  const randomAdjective =
    adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomAnimal = animals[Math.floor(Math.random() * animals.length)];
  return `${randomAdjective} ${randomAnimal}`;
};

export default CustomerService;
