import { Request, Response } from "express";

export async function getListTickets(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const ticketsService = req.scope.resolve("ticketsService");

    const list = await ticketsService.retriverListTickets();

    if (list) {
      res.status(200).send(list);
    } else {
      res.status(204).send(null);
    }
  } catch (error) {
    console.log(
      "Error en el punto final para obtener la lsita de tikets ",
      error
    );
  }
}
