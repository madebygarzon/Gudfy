import { Request, Response } from "express";

export async function postAddMessageTicket(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const dataMessage = JSON.parse(req.body.ticketData);
    const image = req.file;

    const ticketsService = req.scope.resolve("ticketsAdminService");
    const create = await ticketsService.addTicketMessage(
      dataMessage.ticketId,
      "COMMENT_ADMIN_ID",
      image,
      dataMessage.message
    );

    if (create) {
      res.status(200).send(create);
    } else {
      res.status(412).send(null);
    }
  } catch (error) {
    console.log("Error en el punto final para agregar un ticket nuevo ", error);
  }
}
