import { Request, Response } from "express";

export default async (req: Request, res: Response) => {
  const claimData = JSON.parse(req.body.claimData);
  const idCustomer = JSON.parse(req.body.idCustomer);
  const idOrder = JSON.parse(req.body.idOrder);
  const image = req.file;

  const ordedClaimService = req.scope.resolve("orderClaimService");
  await ordedClaimService
    .addClaim(claimData, idCustomer, image)
    .then(async () => {
      const storeOrderService = req.scope.resolve("storeOrderService");

      const updateStoreIOrder = await storeOrderService.updateStatus(
        idOrder,
        "Discussion_ID"
      );

      updateStoreIOrder ? res.status(200).send() : res.status(400).send();
    });
};
