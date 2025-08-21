import { Request, Response } from "express";

export async function UpdateLowStock(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { store_x_variant_id, stock_notificate, activate } = req.body;
    const productNotificateService = req.scope.resolve("productNotificateService");
    
    const add = await productNotificateService.stepNotificate(store_x_variant_id, stock_notificate, activate);
    
    if (add) {
      res.status(200).send(add);
    }
  } catch (error) {
    console.error("Error Endpoint update low stock", error);
  }
}
