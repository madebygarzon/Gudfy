import { Request, Response } from "express";

export default async (req: Request, res: Response) => {
  const { store_order_id, dataForm } = req.body;
  const storeOrderService = req.scope.resolve("storeOrderService");

  const updateData = await storeOrderService.updateOrderData(
    store_order_id,
    dataForm
  );
  console.log("Retorno en el punto final", updateData);
  if (updateData) res.status(200).send({ success: true });
};
