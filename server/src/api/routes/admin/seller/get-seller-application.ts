import { Request, Response } from "express";

export default async function getListApplication(req: Request, res: Response) {
  try {
    const sellerApplicationService = req.scope.resolve(
      "sellerApplicationService"
    );
    const data = await sellerApplicationService.getListApplication();
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json(error);
  }
}
