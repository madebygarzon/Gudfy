import { Request, Response } from "express";

export async function getStoreProductVarian(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { handle } = req.query;
    const productService = req.scope.resolve("storeXVariantService");

    const get = await productService.getStoreVariant(handle);

    if (get) {
      res.status(200).send(get);
    }
  } catch (error) {
    console.log("Error Endpoint get product variant for store", error);
  }
}
