import { Request, Response } from "express"

export default async function deleteGroup(req: Request, res: Response) {
  const service = req.scope.resolve("productGudfyService")
  const { id } = req.params
  await service.deleteComission(id)
  res.json({ id })
}
