import { ProductComission } from "../models/product-comission";
import { dataSource } from "@medusajs/medusa/dist/loaders/database";

const ProductComissionRepository = dataSource.getRepository(ProductComission);

export default ProductComissionRepository;
