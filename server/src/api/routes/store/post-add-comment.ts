import { Request, Response } from "express";

export default async (req: Request, res: Response) => {
  const ordedClaimService = req.scope.resolve("orderClaimService");
  await ordedClaimService
    .addComment({
      comment: req.body.comment,
      comment_owner_id: req.body.comment_owner_id,
      order_claim_id: req.body.order_claim_id,
      customer_id: req.body.customer_id,
    })
    .then(() => {
      res.status(200).send();
    });
};
