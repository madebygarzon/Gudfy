import { Request, Response } from "express";

export default async (req: Request, res: Response): Promise<void> => {
  const { id_cart } = req.params;
  const cartDeleteItem = req.scope.resolve("cartMarketService");
  cartDeleteItem.deleteCart(id_cart).then((e) => {
    return res.json({ success: true, data: e });
  });
};
