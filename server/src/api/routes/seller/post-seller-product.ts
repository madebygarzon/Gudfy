import { Request, Response } from "express";

export async function CreateSellerProduct(
  req: Request,
  res: Response
): Promise<void> {
  const { title, is_giftcard = false } = req.body;
  try {
    const productService = req.scope.resolve("productService");
    const product = await productService.createProductStoreCustomer({
      title,
      is_giftcard,
    });
    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ error });
  }
}
