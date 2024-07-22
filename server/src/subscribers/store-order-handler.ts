import { type SubscriberConfig, type SubscriberArgs } from "@medusajs/medusa";
import StoreOrderService from "../services/store-order";

export default async function storeOrderHandler({
  data,
  eventName,
  container,
  pluginOptions,
}: SubscriberArgs<Record<string, string>>) {
  const storeOrderService: StoreOrderService =
    container.resolve("storeOrderService");
  async function verifyAndDeleteExpiredOrders() {
    try {
      const oneHourAgo = new Date(new Date().getTime() - 60 * 60 * 1000);
      const expiredOrders = await storeOrderService.getOrdersCreatedBefore(
        oneHourAgo
      );
      for (const order of expiredOrders) {
        await this.storeOrderService.deleteOrder(order.id);
      }
    } catch (error) {}
  }
  await verifyAndDeleteExpiredOrders();
}

export const config: SubscriberConfig = {
  event: "StoreOrderSuscribe",
  context: {
    subscriberId: "store-order-handler",
  },
};
