import {
  type ScheduledJobConfig,
  type ScheduledJobArgs,
} from "@medusajs/medusa";

export default async function handler({ container }: ScheduledJobArgs) {
  const jobsService = container.resolve("jobsService");
  console.log("Iniciando la actualización de órdenes completadas...");
  const threeDaysAgo = new Date();
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3); // calcular tres dias antes

  try {
    const result = await jobsService.getOrdersCompletedBefore(threeDaysAgo);
    if (result) {
      console.log(
        "Órdenes completadas han sido actualizadas a finalizadas correctamente."
      );
    }
  } catch (error) {
    console.error("Error durante la ejecución del job:", error);
  }
}

export const config: ScheduledJobConfig = {
  name: "update-completed-orders",
  schedule: "0 0 * * *", // Se ejecuta todos los dias a la medianoche
  data: {},
};
