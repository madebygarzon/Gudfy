import { PayMethodSeller } from "../models/pay-method-seller";
import { dataSource } from "@medusajs/medusa/dist/loaders/database";

const PayMethodSellerRepository = dataSource.getRepository(PayMethodSeller);

export default PayMethodSellerRepository;
