import { Request, Response } from "express";

export default async (req: Request, res: Response) => {
  const { id } = req.params;
  const cartMarketService = req.scope.resolve("storeOrderService");
  console.log("entra al endpoint", id, req.params);
  await cartMarketService.updateCancelStoreOrder(id).then(() => {
    return res.json({ success: true });
  });
};
