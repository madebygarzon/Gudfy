import {
  type ScheduledJobConfig,
  type ScheduledJobArgs,
} from "@medusajs/medusa";

export default async function handler({ container }: ScheduledJobArgs) {
  const jobsService = container.resolve("jobsService");


  const oneHourAgo = new Date(new Date().getTime() - 10 * 60 * 1000);
  const expiredOrders = await jobsService.getOrdersCreatedBefore(oneHourAgo);

  for (const order of expiredOrders) {
   
    await jobsService.deleteOrder(order.id);
   
  }
}

export const config: ScheduledJobConfig = {
  name: "timer-delete-order",
  schedule: "* * * * *",
  data: {},
};
