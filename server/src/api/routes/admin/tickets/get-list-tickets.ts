import { Request, Response } from "express";

export default async function getListTickets(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const ticketsService = req.scope.resolve("ticketsAdminService");
    const list = await ticketsService.retriverListAdminTickets();

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
