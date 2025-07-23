import { Request, Response } from "express";

export async function postAddTickets(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const dataMessage = JSON.parse(req.body.ticketData);
    const image = req.file;

    const ticketsService = req.scope.resolve("ticketsService");
    const create = await ticketsService.createdTicket(
      dataMessage.subject,
      dataMessage.message,
      image,
      dataMessage.customer_id
    );

    if (create) {
      res.status(200).send(create);
    } else {
      res.status(412).send(null);
    }
  } catch (error) {
    console.log("Error en el punto final para agregar un ticket nuevo ", error);
  } finally {
    res.status(200).send(null);
  }

}
