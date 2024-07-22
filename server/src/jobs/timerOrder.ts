import cron from "node-cron";
import StoreOrderService from "../services/store-order";

import {
  type ScheduledJobConfig,
  type ScheduledJobArgs,
} from "@medusajs/medusa";

export default async function handler({ container }: ScheduledJobArgs) {
  const storeOrderService = container.resolve("storeOrderService");

  console.log("Verificando órdenes expiradas...");
  const oneHourAgo = new Date(new Date().getTime() - 10 * 60 * 1000);
  const expiredOrders = await storeOrderService.getOrdersCreatedBefore(
    oneHourAgo
  );

  for (const order of expiredOrders) {
    console.log(`Orden con ID ${order.id} a eliminar`);
    await storeOrderService.deleteOrder(order.id);
    console.log(`eliminada`);
  }
}

export const config: ScheduledJobConfig = {
  name: "timer-delete-order",
  schedule: "* * * * *",
  data: {},
};
