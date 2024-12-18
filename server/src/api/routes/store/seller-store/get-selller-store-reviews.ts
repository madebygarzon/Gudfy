import { Request, Response } from "express";

export async function getSellerStoreReviews(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { store_id, next } = req.query;

    const sellerStore = req.scope.resolve("storeService");

    const data = await sellerStore.getSellerStoreReviews(store_id, next);

    if (data) {
      res.status(200).send(data);
    }
  } catch (error) {
    console.log(
      "Error en el punto final para recuperar los comentarios de la tienda del vendedor ",
      error
    );
  }
}
