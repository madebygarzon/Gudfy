import { Request, Response } from "express";

export default async (req: Request, res: Response) => {
  try {
    const { id,store_id } = req.params;
    const storeOrderService = req.scope.resolve("storeOrderService");

    const updateData = await storeOrderService.getPaymentOrders(
      id,
      store_id
    );
    if (updateData) res.status(200).send(updateData);
  } catch (error) {
    console.log(
      "Error en el punto final al actualizar los datos de la orden",
      error
    );
  }
};
