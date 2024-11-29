import { Request, Response } from "express";

export default async function getSellersReviewsList(
  req: Request,
  res: Response
) {
  const { store_id } = req.query;
  const sellerApplicationService = req.scope.resolve("sellerAdminService");
  const data = await sellerApplicationService.getSellersReviewsList(store_id);
  res.status(200).json(data);
}
