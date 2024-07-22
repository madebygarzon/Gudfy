import { Request, Response } from "express";

export default async (req: Request, res: Response): Promise<void> => {
  const { items } = req.query;

  const productReviewService = req.scope.resolve("cartMarketService");
  await productReviewService.variantAndStock(items).then((cartItems) => {
    return res.status(200).json({ itemsStock: cartItems });
  });
};
