import { Request, Response } from "express";
import { MedusaError } from "@medusajs/utils";

export default async (req: Request, res: Response): Promise<void> => {
  const product = req.body.product;
  
  try {
    const productVariantService = req.scope.resolve("productVariantService");
    productVariantService
      .createProductVariantGudfy(product)
      .then((data) => {
       
        return res.status(200).json(data);
      });
  } catch (error) {
    res.status(400).json({ error });
  }
};
