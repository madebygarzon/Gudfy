import { Request, Response } from "express"

export default async function createGroup(req: Request, res: Response) {
  const service = req.scope.resolve("commissionAdminService")
  const { name, rate } = req.body
  const group = await service.createGroup(name, Number(rate))
  res.json(group)
}
