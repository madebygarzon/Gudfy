import { Request, Response } from "express";

export async function getSellerStoreData(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { id } = req.params;
    const sellerStore = req.scope.resolve("storeService");

    const data = await sellerStore.retrieveSeller(id);

    if (data) {
      res.status(200).send(data);
    }
  } catch (error) {
    console.log(
      "Error en el punto final para recuperar la tienda del vendedor ",
      error
    );
  }
}
