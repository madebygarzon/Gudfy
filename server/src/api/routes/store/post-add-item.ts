import { Request, Response } from "express";

export default async (req: Request, res: Response): Promise<void> => {
  const { variant, store_variant_id, quantity } = req.body;

  const cartMarketService = req.scope.resolve("cartMarketService");
  console.log("DATOS EN EL PUINTO FINAL", variant, store_variant_id, quantity);
  cartMarketService
    .postAddItem(req.params.id, variant, store_variant_id, quantity)
    .then((e) => {
      return res.json({ success: true, data: e });
    });
};
