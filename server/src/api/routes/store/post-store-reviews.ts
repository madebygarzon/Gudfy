import { Request, Response } from "express";
import { MedusaError } from "@medusajs/utils";
import { z } from "zod";

export default async (req: Request, res: Response): Promise<void> => {
  const schema = z.object({
    store_id: z.string().min(1),
    store_order_id: z.string().min(1),
    customer_id: z.string().min(1),
    customer_name: z.string().min(1),
    content: z.string().min(1),
    rating: z.coerce.number().min(0).max(5),
  });
  /* @ts-ignore */
  const { success, error, data } = schema.safeParse(req.body);
  if (!success) {
    throw new Error("error12");
  } else {
    const productReviewService = req.scope.resolve("storeReviewService");
    productReviewService
      .create(
        data.store_id,
        data.store_order_id,
        data.customer_id,
        data.customer_name,
        data.content,
        data.rating
      )
      .then((product_review) => {
        return res.json({ product_review });
      });
  }
};
