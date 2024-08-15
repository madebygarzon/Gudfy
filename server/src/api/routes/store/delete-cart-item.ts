import { Request, Response } from "express";

export default async (req: Request, res: Response): Promise<void> => {
  const { id_cart, id_item } = req.params;
  const cartDeleteItem = req.scope.resolve("cartMarketService");
  cartDeleteItem.deleteItem(id_cart, id_item).then((e) => {
    return res.json({ success: true, data: e });
  });
};
