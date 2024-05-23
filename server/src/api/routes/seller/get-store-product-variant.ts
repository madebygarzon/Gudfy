import { Request, Response } from "express";

export async function getStoreProductVarian(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const id_SPV = req.body;
    const productService = req.scope.resolve("storeXVariantService");

    const get = await productService.getStoreVariant(id_SPV);

    if (get) {
      res.status(200).send(get);
    }
  } catch (error) {
    console.log("Error Endpoint add product variant for store", error);
  }
}
