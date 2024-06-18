import { Request, Response } from "express";

export default async (req: Request, res: Response): Promise<void> => {
  const { cartId } = req.query;
  const productReviewService = req.scope.resolve("cartMarketService");
  await productReviewService.recoveryCart(cartId).then((cartItems) => {
    return res.json({ cartItems });
  });
};
