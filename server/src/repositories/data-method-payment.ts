import { DataMethodPayment } from "../models/data-method-payment";
import { dataSource } from "@medusajs/medusa/dist/loaders/database";

const DataMethodPaymentRepository = dataSource.getRepository(DataMethodPayment);

export default DataMethodPaymentRepository;
