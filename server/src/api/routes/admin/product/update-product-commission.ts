import { Request, Response } from "express";
import { MedusaError } from "@medusajs/utils";

export default async (req: Request, res: Response): Promise<void> => {
  const productId = req.params.id;
  const commissionId = req.body.commission_id;
  
  try {
    const productGudfyService = req.scope.resolve("productGudfyService");
    productGudfyService
      .updateProductCommission(productId, commissionId)
      .then((data) => {
       
        return res.status(200).json(data);
      });
  } catch (error) {
    res.status(400).json({ error });
  }
};
