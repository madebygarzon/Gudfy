import { Request, Response } from "express";

export default async (req: Request, res: Response): Promise<void> => {
  try {
    const productReviewService = req.scope.resolve("storeReviewService");
    await productReviewService.getDataReviews().then((e) => {
      return res.send(e);
    });
  } catch (error) {
    console.log(error);
  }
};
