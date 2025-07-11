import { Request, Response } from "express"

export default async function updateGroup(req: Request, res: Response) {
  const service = req.scope.resolve("productGudfyService")
  const { id } = req.params
  const { name, rate } = req.body
  const group = await service.updateComission(id, name, Number(rate))
  res.json(group)
}
