import { type SubscriberConfig, type SubscriberArgs } from "@medusajs/medusa";
import NotificationGudfyService from "../services/notification-gudfy";

export default async function storeOrderHandler({
  data,
  eventName,
  container,
  pluginOptions,
}: SubscriberArgs<Record<string, string>>) {
  const storeNotiServ: NotificationGudfyService = container.resolve(
    "notificationGudfyService"
  );
  async function getNotificationClaim() {
    try {
      const expiredOrders = await storeNotiServ.retriverNotification(data.id);
    } catch (error) {}
  }
  await getNotificationClaim();
}

export const config: SubscriberConfig = {
  event: "notification.retrieved-",
  context: {
    subscriberId: "store-order-handler",
  },
};
