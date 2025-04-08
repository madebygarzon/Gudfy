import { Request, Response } from "express";

export default async (req: Request, res: Response): Promise<void> => {
  const { items, customer_id } = req.body;

  const cartMarketService = req.scope.resolve("cartMarketService");
  cartMarketService.compareSuccessfulStocks(items, customer_id).then((e) => {
    if (!e.success) return res.json({ success: false, data: e.data });
    else res.json({ success: true, data: e.data });
  });
};
