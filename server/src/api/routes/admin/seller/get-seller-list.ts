import { Request, Response } from "express";

export default async function getSellerList(req: Request, res: Response) {
  const sellerApplicationService = req.scope.resolve("sellerAdminService");
  const data = await sellerApplicationService.getSellerList();
  res.status(200).json(data);
}
