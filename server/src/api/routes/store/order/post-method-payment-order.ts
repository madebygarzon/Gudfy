import { Request, Response } from "express";

export default async (req: Request, res: Response) => {
  try {
    const { store_order_id, method, reference } = req.body;
    const storeOrderService = req.scope.resolve("storeOrderService");
    const updateData = await storeOrderService.postMethodPaymentOrder(
      store_order_id,
      method,
      reference
    );
    if (updateData) res.status(200).send({ success: true });
  } catch (error) {
    console.log(
      "Error en el endpoint al ingresar los datos el metodo de pago",
      error
    );
  }
};
