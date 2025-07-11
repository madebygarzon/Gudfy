import { Request, Response } from "express"

export default async function createComission(req: Request, res: Response) {
  const service = req.scope.resolve("productGudfyService")
  const { name, rate } = req.body
  const group = await service.createComission(name, Number(rate))
  res.json(group)
}
