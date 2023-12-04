import { TransactionBaseService } from "@medusajs/medusa";
import { SellerApplicationRepository } from "../repositories/seller-application";

export default class SellerApplicationService extends TransactionBaseService {
  protected readonly sellerApplicationRepository_: typeof SellerApplicationRepository;

  constructor({ sellerApplicationRepository }) {
    super(arguments[0]);
    this.sellerApplicationRepository_ = sellerApplicationRepository;
  }

  async create(customer_id, identification_number, address) {
    if (!customer_id || !identification_number || address)
      throw new Error("Adding the data required for create seller application");

    const sellerApplicationRepository = this.activeManager_.withRepository(
      this.sellerApplicationRepository_
    );
    const createSellerapplication = sellerApplicationRepository.create({
      customer_id,
      identification_number,
      address,
      approved: false,
    });
    const sellerapplication = await sellerApplicationRepository.save(
      createSellerapplication
    );
    return sellerapplication;
  }

  async getApplication(customer_id) {
    if (!customer_id)
      throw new Error("Adding the data required for the seller application");
    const sellerApplicationRepository = this.activeManager_.withRepository(
      this.sellerApplicationRepository_
    );
    const getApplication = await sellerApplicationRepository.findOne({
      where: {
        customer_id,
      },
    });

    if (getApplication)
      return { application: true, approved: getApplication.approved };

    return { application: false, approved: false };
  }
}
