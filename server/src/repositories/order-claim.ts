import { OrderClaim } from "../models/order-claim";
import { dataSource } from "@medusajs/medusa/dist/loaders/database";

export const OrderClaimRepository = dataSource.getRepository(OrderClaim);
