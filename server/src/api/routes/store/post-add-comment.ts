import { Request, Response } from "express";

export default async (req: Request, res: Response) => {
  const dataMessage = JSON.parse(req.body.dataComment);
  const image = req.file;

  const ordedClaimService = req.scope.resolve("orderClaimService");
  await ordedClaimService.addComment({ ...dataMessage }, image).then(() => {
    res.status(200).send();
  });
};
