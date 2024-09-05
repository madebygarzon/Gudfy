import { NotificationGudfy } from "../models/notification-gudfy";
import { dataSource } from "@medusajs/medusa/dist/loaders/database";

export const NotificationGudfyRepository =
  dataSource.getRepository(NotificationGudfy);
