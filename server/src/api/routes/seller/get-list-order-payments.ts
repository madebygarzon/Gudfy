import { Request, Response } from "express";

export async function getListOrderPayments(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { id } = req.params;
    const storeOrderService = req.scope.resolve("orderPaymentService");

    const list = await storeOrderService.recoverListOrderPayments(id);

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
