import { Request, Response } from "express";

export default async function getListMetricsCustomer(
  req: Request,
  res: Response
) {
  const onboardingService = req.scope.resolve("storeOrderAdminService");

  const data = await onboardingService.listMetricsCustomers();

  res.status(200).send(data);
}
