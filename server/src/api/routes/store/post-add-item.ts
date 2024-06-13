import { Request, Response } from "express";

export default async (req: Request, res: Response): Promise<void> => {
  console.log(req.params);
  const { variant, store_id, quantity } = req.body;
  const lineItemService = req.scope.resolve("lineItemService");
  lineItemService
    .addItem(req.params.id, variant, store_id, quantity)
    .then((e) => {
      return res.json({ success: true, data: e });
    });
};
