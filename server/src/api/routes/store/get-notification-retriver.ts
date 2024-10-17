import { Request, Response } from "express";

export default async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  console.log("este es el id que llega de la notificacion", id);
  const productReviewService = req.scope.resolve("notificationGudfyService");
  await productReviewService.retriverNotification(id).then((data) => {
    return res.send(data);
  });
};
