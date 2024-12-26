import { RequestProduct } from "../models/request-product";
import { dataSource } from "@medusajs/medusa/dist/loaders/database";

const RequestProductRepository = dataSource.getRepository(RequestProduct);

export default RequestProductRepository;
