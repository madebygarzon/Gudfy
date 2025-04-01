import { Request, Response } from "express";
import coinpal from "coinpal-sdk";

export default async (req: Request, res: Response): Promise<void> => {
  console.log(
    "Estos son los datos que llegan al endpoint del webhook",
    req.body,
    req.params,
    req.query
  );

  const { id } = req.params;
  try {
    const result = await coinpal
      .queryOrder({ reference: id })
      .then((result) => {
        console.log("request successful", result);
      })
      .catch((error) => {
        console.error("request failed", error);
      });

    console.log("resultado con el sdk", result);

    if (result.status === "paid") {
      const ordedPaymentService = req.scope.resolve("orderPaymentService");

      const succes = await ordedPaymentService.successPayOrder(result.orderNo);
      if (succes) res.status(200).json();
    } else {
      res.status(200).json();
    }
  } catch (error) {
    console.log("ERROR EN EL SERVICIO DEL WEBHOOK DE COINTPAL", error);
  }
};
