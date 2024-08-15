import { Request, Response } from "express";

export default async (req: Request, res: Response): Promise<void> => {
  const { store_order_id } = req.params;
  const productReviewService = req.scope.resolve("storeReviewService");
  await productReviewService.commented(store_order_id).then((store_reviews) => {
    if (store_reviews) return res.send(store_reviews);
    return res.send([]);
  });
};
