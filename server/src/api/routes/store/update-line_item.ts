import { Request, Response } from "express";

export default async (req: Request, res: Response) => {
  const { itemId, quantity } = req.body;
  const cartMarketService = req.scope.resolve("cartMarketService");

  await cartMarketService.updateItemStock(itemId, quantity).then(() => {
    return res.json({ success: true });
  });
};
