import { Request, Response } from "express";

export async function CreateSellerProduct(
  req: Request,
  res: Response
): Promise<void> {
  const { title } = req.body;
  try {
    const sellerApplicationRepository = req.scope.resolve("productService");
    const product = await sellerApplicationRepository.create({
      title,
    });
    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ error });
  }
}
