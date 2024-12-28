import { Request, Response } from "express";

export async function updateTicketStatus(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { ticket_id, status } = req.body;
    const ticketsService = req.scope.resolve("ticketsAdminService");
    const update = await ticketsService.updateTikectStatus(ticket_id, status);

    if (update) {
      res.status(200).send(true);
    } else {
      res.status(412).send(null);
    }
  } catch (error) {
    console.log("Error en el punto final para agregar un ticket nuevo ", error);
  }
}
