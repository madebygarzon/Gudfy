import { StoreOrder } from "../models/store-order";
import { dataSource } from "@medusajs/medusa/dist/loaders/database";

const StoreOrderRepository = dataSource.getRepository(StoreOrder);

export default StoreOrderRepository;
