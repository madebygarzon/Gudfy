import { Request, Response } from "express";
import * as querystring from "querystring";
import crypto from "crypto";

const verifySignature = (data: any, secretKey: string): boolean => {
  const {
    version,
    requestId,
    merchantNo,
    orderNo,
    orderCurrency,
    orderAmount,
    sign,
  } = data;
  if (
    !version ||
    !requestId ||
    !merchantNo ||
    !orderNo ||
    !orderCurrency ||
    !orderAmount ||
    !sign
  ) {
    return false;
  }
  const computedSignature = crypto
    .createHash("sha256")
    .update(
      secretKey + requestId + merchantNo + orderNo + orderAmount + orderCurrency
    )
    .digest("hex");
  return computedSignature === sign;
};

export default async (req: Request, res: Response): Promise<void> => {
  console.log("ENTRA AL WEB HOOK");
  const rawBody = req.body.toString();

  const parsedData = querystring.parse(rawBody);

  const secretKey = process.env.COINPAL_API_KEY;
  if (!verifySignature(parsedData, secretKey)) {
    console.log("INVALID SIGNATURE");
    res.status(401).json({ error: "Invalid signature" });
    return;
  }
 console.log("VALID SIGNATURE", parsedData.status);
  if (parsedData.status === "paid") {
    console.log("ENTRA A PAID");
    const orderPaymentService = req.scope.resolve("orderPaymentService");
    try {
      const success = await orderPaymentService.successPayOrder(
        parsedData.orderNo as string
      );
      if (success) {
        res.status(200).json({ message: "Pago procesado correctamente" });
      } else {
        res
          .status(500)
          .json({ error: "Error al actualizar el estado del pedido" });
      }
    } catch (error) {
      console.error("Error procesando la actualización del pedido:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  } else {
    console.log("ENTRA A ELSE");
    res
      .status(200)
      .json({ message: `Estado del pedido: ${parsedData.status}` });
  }
};
