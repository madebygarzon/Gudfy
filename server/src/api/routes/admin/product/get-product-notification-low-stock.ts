import { Request, Response } from "express"

export default async function getLowStock(req: Request, res: Response) {
  const service = req.scope.resolve("productNotificationService")
  const products = await service.getLowStockForSeller()
  res.status(200).json(products)
}
