import { Request, Response } from "express";

export async function getListProductSerials(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { id } = req.params;
    const getlistproductSerials = req.scope.resolve("serialCodeService");

    const list = await getlistproductSerials.getSellerlistProductSerials(id);

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
