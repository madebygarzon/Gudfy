import { Request, Response } from "express";

export default async function getListApplication(req: Request, res: Response) {
  const { order } = req.query;

  const sellerApplicationService = req.scope.resolve(
    "sellerApplicationService"
  );
  const data = await sellerApplicationService.getListApplication(order);
  res.status(200).json(data);
}
