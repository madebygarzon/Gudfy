import { Request, Response } from "express"

export default async function listGroups(req: Request, res: Response) {
  const service = req.scope.resolve("productGudfyService")
  const groups = await service.listComissions()
  res.json(groups)
}
