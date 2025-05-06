import { Request, Response } from "express";

export default async (req: Request, res: Response) => {
  try {
    const dataForm = JSON.parse(req.body.dataForm);
  const store_order_id = JSON.parse(req.body.store_order_id);
  const image = req.file;

  console.log(
    "Esta es la informacion para la orden con pago manual",
    store_order_id,
    dataForm,
    image
  );

  const storeOrderService = req.scope.resolve("storeOrderService");

  await storeOrderService.updateOrderDataWhitManualPay(
    dataForm,
    store_order_id,
    image
  );

  res.status(200).send({ success: true });
  } catch (error) {
      console.log("Error en el punto final para actualizar la orden con pago manual", error);
  }
  
};
