import { LineItem } from "../models/line-item";
import { dataSource } from "@medusajs/medusa/dist/loaders/database";

const LineItemRepository = dataSource.getRepository(LineItem);

export default LineItemRepository;
