import { Request, Response } from "express";

const postAddComments = async (req: Request, res: Response) => {
  const ordedClaimService = req.scope.resolve("orderClaimService");
  await ordedClaimService
    .addComment({
      comment: req.body.comment,
      comment_owner_id: req.body.comment_owner_id,
      order_claim_id: req.body.order_claim_id,
    })
    .then(() => {
      res.status(200).send();
    });
};

export default postAddComments;
