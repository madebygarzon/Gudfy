import { Request, Response } from "express";

export default async function getListMetricsSeller(
  req: Request,
  res: Response
) {
  const onboardingService = req.scope.resolve("metricsService");

  const data = await onboardingService.metricsSellerAdmin();

  res.status(200).json(data);
}
