import { Request, Response } from "express";

export default async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const productReviewService = req.scope.resolve("customerService");
  const number: number = await productReviewService.numberOfCompletedOrders(id);

  res.status(200).send({ number });
};
