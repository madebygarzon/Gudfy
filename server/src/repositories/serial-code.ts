import { SerialCode } from "../models/serial-code";
import { dataSource } from "@medusajs/medusa/dist/loaders/database";

const SerialCodeRepository = dataSource.getRepository(SerialCode);

export default SerialCodeRepository;
