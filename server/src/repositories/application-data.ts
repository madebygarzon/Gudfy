import { ApplicationData } from "../models/application-data";
import { dataSource } from "@medusajs/medusa/dist/loaders/database";

export const ApplicationDataRepository =
  dataSource.getRepository(ApplicationData);
