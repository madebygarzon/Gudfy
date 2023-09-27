import { Request, Response } from "express";
import { z } from "zod";

export default async (req: Request, res: Response): Promise<void> => {
  const { id } = req.query;
  const productReviewService = req.scope.resolve("productReviewService");
  await productReviewService.getProductReviews(id).then((product_reviews) => {
    return res.json({ product_reviews });
  });
};
