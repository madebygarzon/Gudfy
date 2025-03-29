import { Request, Response } from "express";

export default async (req: Request, res: Response): Promise<void> => {
  console.log(
    "Estos son los datos que llegan al endpoint del webhook",
    req.body,
    req.params,
    req.query
  );
  const { status, orderNo } = req.body;
  try {
    if (status === "paid") {
      const ordedPaymentService = req.scope.resolve("orderPaymentService");

      const succes = await ordedPaymentService.successPayOrder(orderNo);
      if (succes) res.status(200).json();
    } else {
      res.status(200).json();
    }
  } catch (error) {
    console.log("ERROR EN EL SERVICIO DEL WEBHOOK DE COINTPAL", error);
  }
};
