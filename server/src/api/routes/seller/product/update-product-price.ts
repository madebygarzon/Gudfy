import { Request, Response } from "express";

export async function postUpdatePriceProduct(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const dataAddProduct = req.body;
    const productService = req.scope.resolve("storeXVariantService");
    
    const add = await productService.updatePrice(dataAddProduct.productvariantid,dataAddProduct.price);
    
    if (add) {
      res.status(200).send(add);
    }
  } catch (error) {
    console.log("Error Endpoint add product variant for store", error);
  }
}
