import { Request, Response } from "express";

export async function getMessagesTickets(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { id } = req.params;
    const ticketsService = req.scope.resolve("ticketsService");

    const list = await ticketsService.retriverTicketMessages(id);

    if (list) {
      res.status(200).send(list);
    } else {
      res.status(204).send(null);
    }
  } catch (error) {
    console.log(
      "Error en el punto final para obtener la lsita messages tikets ",
      error
    );
  }
}
