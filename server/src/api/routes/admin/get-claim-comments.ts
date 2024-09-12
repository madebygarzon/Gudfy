import { Request, Response } from "express";

export async function getClaimComments(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { id } = req.params;
    const order_claim = req.scope.resolve("orderClaimService");
    const list = await order_claim.retriverClaimComments(id);

    if (list) {
      res.status(200).send(list);
    }
  } catch (error) {
    console.log(
      "Error en el punto final para la lista de las ordenes de reclamacion",
      error
    );
  }
}
