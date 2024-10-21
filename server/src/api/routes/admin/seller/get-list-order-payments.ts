import { Request, Response } from "express";

export default async function getListOrderPayments(
  req: Request,
  res: Response
) {
  try {
    const { id } = req.params;
    const orderPaymentService = req.scope.resolve("orderPaymentService");
    const data = await orderPaymentService.recoverListOrderPayments(id);
    res.status(200).json(data);
  } catch (error) {
    console.log(
      "Error al intentar recuperar el listado de las ordenes pagadas"
    );
  }
}
