import { Request, Response } from "express";

export default async (req: Request, res: Response): Promise<void> => {
  try {
    const productsVariants = req.scope.resolve("storeProductVariantService");
    const listPV = await productsVariants.list();
    res.status(200).send(listPV);
  } catch (error) {
    console.log("Error al obtener la lista de productos:", error);
  }
};
