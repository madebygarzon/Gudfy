import { Request, Response } from "express";

export default async (req: Request, res: Response): Promise<void> => {
  const { items } = req.body;

  const cartMarketService = req.scope.resolve("cartMarketService");
  cartMarketService.compareSuccessfulStocks(items).then((e) => {
    if (e) return res.json({ success: false, data: e });
    else res.json({ success: true, data: "" });
  });
};
