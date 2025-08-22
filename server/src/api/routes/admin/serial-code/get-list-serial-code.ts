import { Request, Response } from "express";

export default async function getListSerialCode(
  req: Request,
  res: Response
): Promise<void> {
  try {
   
    const order_claim = req.scope.resolve("serialCodeAdminService");
    const list = await order_claim.listSerialCode();

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
