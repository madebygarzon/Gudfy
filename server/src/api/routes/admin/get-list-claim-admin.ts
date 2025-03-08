import { Request, Response } from "express";

export default async function getListClaimAdmin(req: Request, res: Response) {
  try {
    const SellerApplication = req.scope.resolve("orderClaimService");
    const data = await SellerApplication.retriverListClaimAdmin();

    res.status(200).json(data);
  } catch (error) {
    res.status(400).json();
  }
}
