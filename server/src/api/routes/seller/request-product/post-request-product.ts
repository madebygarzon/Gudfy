import { Request, Response } from "express";

export async function addRequestProduct(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const productData = JSON.parse(req.body.productData);
    const imagenPath = req.file.path;

    const requestProductService = req.scope.resolve("requestProductService");

    const dataProduct = {
      customer_id: productData.customer_id,
      product_title: productData.product_title,
      product_image: `${
        process.env.BACKEND_URL ?? `http://localhost:${
          process.env.BACKEND_PORT ?? 9000
        }`
      }/${imagenPath}`,
      description: productData.description,
      variants: productData.variants,
      approved: false,
    };

    const createReqProd = await requestProductService.addRequestProduct(
      dataProduct
    );

    res.status(200).json(createReqProd);
  } catch (error) {
    res.status(400).json({ error });
  }
}
