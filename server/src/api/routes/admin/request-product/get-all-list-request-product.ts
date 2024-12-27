import { Request, Response } from "express";

export default async function getAllListRequestProduct(
  req: Request,
  res: Response
) {
  try {
    const requestProductService = req.scope.resolve("requestProductService");
    const data = await requestProductService.getAllListRequest();
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
  }
}
