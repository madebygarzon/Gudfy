import { StoreXVariant } from "../models/store_x_variant";
import { dataSource } from "@medusajs/medusa/dist/loaders/database";

const StoreXVariantRepository = dataSource.getRepository(StoreXVariant);

export default StoreXVariantRepository;
