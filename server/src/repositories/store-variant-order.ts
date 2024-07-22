import { StoreVariantOrder } from "../models/store-variant-order";
import { dataSource } from "@medusajs/medusa/dist/loaders/database";

const StoreVariantOrderRepository = dataSource.getRepository(StoreVariantOrder);

export default StoreVariantOrderRepository;
