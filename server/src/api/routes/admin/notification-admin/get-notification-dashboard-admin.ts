import { Request, Response } from "express";
import NotificationGudfyService from "../../../../services/notification-gudfy";

export default async function getNotificationDashboardAdmin(req: Request, res: Response) {
  const notificationGudfyService: NotificationGudfyService =
    req.scope.resolve("notificationGudfyService");

  const data = await notificationGudfyService.getNotificatioDashboarAdmin();

  res.status(200).json({ data });
}
