import { Request, Response } from "express";

export default async function getClaimNotification(
  req: Request,
  res: Response
) {
  try {
    const SellerApplication = req.scope.resolve("notificationGudfyService");
    const data = await SellerApplication.retriverNotificationAdmin();
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json();
  }
}
