import { Request, Response } from "express";

export default async (req: Request, res: Response) => {
  const { idClaim, status } = req.body;

  const STATUS =
    status == "CANCEL"
      ? "CANCEL_ID"
      : status == "UNSOLVED"
      ? "UNSOLVED_ID"
      : status == "SOLVED"
      ? "SOLVED_ID"
      : "OPEN_ID";

  const storeOrderService = req.scope.resolve("orderClaimService");
  await storeOrderService.updateClaimStatus(idClaim, STATUS).then(() => {
    return res.status(200).json({ success: true });
  });
};
