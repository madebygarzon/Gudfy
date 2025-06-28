import { Request, Response } from "express"

export default async function deleteGroup(req: Request, res: Response) {
  const service = req.scope.resolve("commissionAdminService")
  const { id } = req.params
  await service.deleteGroup(id)
  res.json({ id })
}
