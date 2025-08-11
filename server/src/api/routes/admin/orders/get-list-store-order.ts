import { Request, Response } from "express";
import storeOrderAdminService from "../../../../services/store-order-admin";

export default async function getListStoreOrders(req: Request, res: Response) {
  try {
    const onboardingService: storeOrderAdminService = req.scope.resolve(
      "storeOrderAdminService"
    );

    const {
      page = 1,
      limit = 50,
      status,
      paymentMethod,
      store,
      search,
    } = req.query;

    const params = {
      page: parseInt(page as string, 10),
      limit: parseInt(limit as string, 10),
      status: status as string,
      paymentMethod: paymentMethod as string,
      store: store as string,
      search: search as string,
    };

    const data = await onboardingService.listCustomersOrders(params);
 
    res.status(200).send(data);
  } catch (error) {
    res.status(400).send(error);
  }
}
