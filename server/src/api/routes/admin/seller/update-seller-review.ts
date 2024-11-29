import { Request, Response } from "express";

export default async function UpdateSellerReview(req: Request, res: Response) {
  try {
    const { review_id, payload } = req.body;
    const sellerApplicationRepository = req.scope.resolve(
      "storeReviewAdminService"
    );
    const data = await sellerApplicationRepository.update(review_id, payload);
    res.status(200).json(data);
  } catch (error) {
    res.status(400).send(error);
  }
}
