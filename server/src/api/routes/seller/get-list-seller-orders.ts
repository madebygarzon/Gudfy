import { Request, Response } from "express";

export async function getListSellerOrders(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { id } = req.params;
    const { page, limit, status, search } = req.query;
    const storeOrderService = req.scope.resolve("storeOrderService");

    const options = {
      page: page ? parseInt(page as string) : 1,
      limit: limit ? parseInt(limit as string) : 50,
      status: status as string,
      search: search as string
    };

    const list = await storeOrderService.listSellerOrders(id, options);

    if (list) {
      res.status(200).send(list);
    }
  } catch (error) {
    console.error(
      "Error en el punto final para la lista de las ordenes por parte del vendedor ",
      error
    );
  }
}
