import { Request, Response } from "express";

export async function getCurrentOrder(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { id } = req.params;
    const productService = req.scope.resolve("storeOrderService");
    const list = await productService.currentOrder(id);

    if (list) {
      res.status(200).send(list);
    } else res.status(200).send(null);
  } catch (error) {
    console.log("Error en el punto final para la lista de las ordenes ", error);
  }
}
