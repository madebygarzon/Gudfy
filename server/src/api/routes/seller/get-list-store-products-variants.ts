import { Request, Response } from "express";

export async function getListStoreProductVariant(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const productService = req.scope.resolve("storeXVariantService");

    const list = await productService.list();

    if (list) {
      res.status(200).send(list);
    }
  } catch (error) {
    console.log("Error Endpoint list product variant for store", error);
  }
}
