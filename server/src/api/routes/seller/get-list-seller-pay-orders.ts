import { Request, Response } from "express";

export async function getListSellerPayOrders(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const storeOrderService = req.scope.resolve("storeOrderService");

    const list = await storeOrderService.listSellerPayOrders();

    if (list) {
      res.status(200).send(list);
    }
  } catch (error) {
    console.log(
      "Error en el punto final para la lista de las ordenes por parte del vendedor ",
      error
    );
  }
}
