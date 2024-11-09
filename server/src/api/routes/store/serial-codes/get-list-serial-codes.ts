import { Request, Response } from "express";

export default async (req: Request, res: Response): Promise<void> => {
  const serialCodeService = req.scope.resolve("serialCodeService");
  await serialCodeService.recoverListSerialCode().then((serials) => {
    return res.status(200).send({ serialCodes: serials });
  });
};
