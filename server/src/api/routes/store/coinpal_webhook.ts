import { Request, Response } from "express";
import crypto from "crypto";

export default async (req: Request, res: Response): Promise<void> => {
  try {
    // 1. Verificar la firma
    const receivedSign = req.body.sign;
    const expectedSign = generateCoinPalSignature(req.body);

    if (receivedSign !== expectedSign) {
      console.error("Firma inválida recibida:", {
        received: receivedSign,
        expected: expectedSign,
      });
      res.status(401).json({ error: "Invalid signature" });
      return;
    }

    // 2. Procesar la notificación
    const notification = req.body;
    console.log("Notificación recibida de CoinPal:", notification);

    // 3. Actualizar el estado del pedido según el status
    const orderService = req.scope.resolve("orderService");

    switch (notification.status.toLowerCase()) {
      case "paid":
        await orderService.update(notification.orderNo, {
          status: "paid",
          payment_method: "coinpal",
          payment_id: notification.reference,
          paid_at: new Date(parseInt(notification.confirmedTime) * 1000),
          metadata: {
            paidCurrency: notification.paidCurrency,
            paidAmount: notification.paidAmount,
            paidAddress: notification.paidAddress,
            network: notification.network,
          },
        });
        break;

      case "failed":
        await orderService.update(notification.orderNo, {
          status: "failed",
          payment_status: "failed",
          failure_reason: notification.unresolvedLabel || notification.remark,
        });
        break;

      case "pending":
        // Opcional: Registrar estado pendiente
        break;

      default:
        console.warn("Estado desconocido recibido:", notification.status);
    }

    // 4. Responder a CoinPal
    res.status(200).json({
      status: "success",
      message: "Notification processed",
    });
  } catch (error) {
    console.error("Error al procesar webhook:", error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// Función para generar la firma esperada
const generateCoinPalSignature = (notificationData) => {
  const secretKey = process.env.COINPAL_SECRET_KEY;

  // Ordenar los campos alfabéticamente y concatenarlos
  const sortedData = Object.keys(notificationData)
    .filter((key) => key !== "sign") // Excluir la firma existente
    .sort()
    .map((key) => `${key}=${notificationData[key]}`)
    .join("&");

  // Crear HMAC SHA256
  return crypto
    .createHmac("sha256", secretKey)
    .update(sortedData)
    .digest("hex");
};
