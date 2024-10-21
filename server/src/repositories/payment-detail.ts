import { PaymentDetail } from "../models/payment-detail";
import { dataSource } from "@medusajs/medusa/dist/loaders/database";

const PaymentDetailRepository = dataSource.getRepository(PaymentDetail);

export default PaymentDetailRepository;
