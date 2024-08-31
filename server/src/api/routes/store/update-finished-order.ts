import { Request, Response } from "express";

export default async (req: Request, res: Response) => {
  const { id } = req.params;
  const storeOrderService = req.scope.resolve("storeOrderService");
  await storeOrderService.updateStatus(id, "Finished_ID").then(() => {
    return res.json({ success: true });
  });
};
