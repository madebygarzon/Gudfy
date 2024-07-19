import { Request, Response } from "express";

export async function getListCustomerOrders(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const productService = req.scope.resolve("storeOrderService");

    const list = await productService.listCustomerOrders();

    if (list) {
      res.status(200).send(list);
    }
  } catch (error) {
    console.log("Error en el punto final para la lista de las ordenes ", error);
  }
}
