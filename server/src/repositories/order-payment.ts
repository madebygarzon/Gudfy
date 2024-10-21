import { OrderPayments } from "../models/order-payments";
import { dataSource } from "@medusajs/medusa/dist/loaders/database";

const OrderPaymentsRepository = dataSource.getRepository(OrderPayments);

export default OrderPaymentsRepository;
