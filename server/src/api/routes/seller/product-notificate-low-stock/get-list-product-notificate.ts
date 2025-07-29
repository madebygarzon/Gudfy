import { Request, Response } from "express";

export async function getNotificationLowStockProduct(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const requestProductService = req.scope.resolve("productNotificateService");
    const notificate = await requestProductService.getLowStockForSeller();
    if (notificate.length > 0) {
      res.status(200).json(notificate);
    } else {
      res.status(200).json([]);
    }
  } catch (error) {
    console.error(
      "Error en el punto final para la lista de las notificaciones de stock por parte del vendedor ",
      error
    );
  }
}
