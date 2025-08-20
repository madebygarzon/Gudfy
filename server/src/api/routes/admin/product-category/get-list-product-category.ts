import { Request, Response } from "express"

export default async function getListProductCategory(req: Request, res: Response) {
  const service = req.scope.resolve("productCategoryGudfyService")
  const products = await service.listProductCategory()
  res.json(products)
}
