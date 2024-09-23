import { Request, Response } from "express";

export default async (req: Request, res: Response): Promise<void> => {
  /* @ts-ignore */
  const { id, status } = req.params;

  const notiServi = req.scope.resolve("notificationGudfyService");
  notiServi.updateStateNotification(id, status).then(() => {
    return res.status(202).send({ success: true });
  });
};
