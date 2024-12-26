import { Request, Response } from "express";

export async function getListRequestProduct(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { id } = req.params;
    const requestProductService = req.scope.resolve("requestProductService");

    const list = await requestProductService.getListRequestFromCustomer(id);

    if (list) {
      res.status(200).send(list);
    }
  } catch (error) {
    console.log(
      "Error en el punto final para la lista de las ordenes por parte del vendedor ",
      error
    );
  }
}
