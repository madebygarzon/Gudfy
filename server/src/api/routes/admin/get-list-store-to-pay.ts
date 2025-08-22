import { Request, Response } from "express";

export default async function getListStoresToPay(req: Request, res: Response) {
  try {
    const listOrderPay = req.scope.resolve("orderPaymentService");
    const data = await listOrderPay.retriveListStoresToPay();
    res.status(200).json(data);
  } catch (error) {
    console.log("error al obtener la lista de la wallet", error);
    res.status(400).json();
  }
}
