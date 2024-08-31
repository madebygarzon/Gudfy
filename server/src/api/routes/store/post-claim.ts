import { Request, Response } from "express";

export default async (req: Request, res: Response) => {
  const ordedClaimService = req.scope.resolve("orderClaimService");
  await ordedClaimService
    .addClaim(req.body.claimData, req.body.idCustomer)
    .then(async () => {
      const storeOrderService = req.scope.resolve("storeOrderService");

      const updateStoreIOrder = await storeOrderService.updateStatus(
        req.body.idOrder,
        "Discussion_ID"
      );

      updateStoreIOrder ? res.status(200).send() : res.status(400).send();
    });
};
