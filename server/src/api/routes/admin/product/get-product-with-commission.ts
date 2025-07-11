import { Request, Response } from "express"

export default async function getProductsWithCommission(req: Request, res: Response) {
  const service = req.scope.resolve("productGudfyService")
  const products = await service.listProductWithComission()
  res.json(products)
}
