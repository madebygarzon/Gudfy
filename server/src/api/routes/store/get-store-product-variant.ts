import { Request, Response } from "express";

export async function getProductVariant(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { handle } = req.query;
    const productService = req.scope.resolve("storeXVariantService");

    const list = await productService.product(handle);

    if (list) {
      res.status(200).send(list);
    }
  } catch (error) {
    console.log(
      "Error en el punto final para recuperar el producto de productos ",
      error
    );
  }
}
