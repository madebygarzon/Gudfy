import { ProductNotificate } from "../models/product-notificate";
import { dataSource } from "@medusajs/medusa/dist/loaders/database";

const ProductNotificateRepository = dataSource.getRepository(ProductNotificate);

export default ProductNotificateRepository;
