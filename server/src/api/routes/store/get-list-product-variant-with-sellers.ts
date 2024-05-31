import { Request, Response } from "express";

export async function getListProductVariantWithSellers(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const productService = req.scope.resolve("storeProductVariantService");

    const list = await productService.listProductVariantWithSellers();

    if (list) {
      res.status(200).send(list);
    }
  } catch (error) {
    console.log(
      "Error en el punto final para la lista de todas las variaciones de productos ",
      error
    );
  }
}
