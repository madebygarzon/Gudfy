import { Request, Response } from "express";

export default async (req: Request, res: Response) => {
  try {
    const { store_variant_order_id } = req.body;
    const storeOrderService = req.scope.resolve("storeOrderService");

    const updateData = await storeOrderService.updateFinishVariantOrder(
      store_variant_order_id
    );

    if (updateData) res.status(200).send({ success: true });
  } catch (error) {
    console.log(
      "Error en el punto final al actualizar los datos de la orden",
      error
    );
  }
};
