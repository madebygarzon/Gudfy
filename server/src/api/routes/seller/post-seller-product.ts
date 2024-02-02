import { Request, Response } from "express";

export async function CreateSellerProduct(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const productData = JSON.parse(req.body.productData);
    const imagenPath = req.file.path;

    const productService = req.scope.resolve("productService");
    const product = await productService.createProductStoreCustomer(
      productData,
      imagenPath
    );

    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ error });
  }
}
