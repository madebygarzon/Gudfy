import { Request, Response } from "express";

export default async function GetCustomer(
  req: Request,
  res: Response
): Promise<void> {
  console.log("acallega");
  try {
    const sellerApplicationRepository = req.scope.resolve("storeService");
    const sotore = await sellerApplicationRepository.retrieve();
    res.status(200).json(sotore);
  } catch (error) {
    res.status(400).json({ error });
  }
}
