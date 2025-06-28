import { Request, Response } from "express"

export default async function listGroups(req: Request, res: Response) {
  const service = req.scope.resolve("commissionAdminService")
  const groups = await service.listGroups()
  res.json(groups)
}
