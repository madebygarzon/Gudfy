import { Request, Response } from "express";

export async function getListSellerProduct(
  req: Request,
  res: Response
): Promise<void> {
  try {
    res.send(200);
  } catch (error) {
    res.status(400).json({ error });
  }
}
