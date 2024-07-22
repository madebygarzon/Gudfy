import { Request, Response } from "express";

export default async (req: Request, res: Response): Promise<void> => {
  const productReviewService = req.scope.resolve("storeOrderServe");
  productReviewService.deleteOrder(req.params.id).then((e) => {
    return res.json({ success: true, data: e });
  });
};
