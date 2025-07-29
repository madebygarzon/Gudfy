import { Request, Response } from "express";
import storeOrderAdminService from "../../../../services/store-order-admin";

export default async function getListStoreOrders(req: Request, res: Response) {
  try {
  const onboardingService: storeOrderAdminService = req.scope.resolve(
    "storeOrderAdminService"
  );

  const data = await onboardingService.listCustomersOrders();
 
  res.status(200).send(data);
} catch (error) {
  console.error(error);
  res.status(400).send(error);
}
}
