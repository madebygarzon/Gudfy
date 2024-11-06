import { Request, Response } from "express";

export default async (req: Request, res: Response): Promise<void> => {
  const { bizType, bizStatus, data } = req.body;
  const { id } = req.params;
  console.log("----EL WEBHOOK FUE EXITOSO----");
  try {
    if (bizType === "PAY" && bizStatus === "PAY_SUCCESS") {
      const payData = JSON.parse(data);
      console.log(bizType, bizStatus, payData, id);
      const merchantTradeNo = payData.merchantTradeNo;
      const paymentInfo = payData.paymentInfo;
      const paymentInstructions = paymentInfo.paymentInstructions;
      const curreny = paymentInstructions[0].curreny;
      const amount = paymentInstructions[0].amount;

      const ordedPaymentService = req.scope.resolve("orderPaymentService");

      const succes = await ordedPaymentService.successPayOrder(id);

      res.status(200).json({ returnCode: "SUCCESS", returnMessage: null });
    } else {
      res.status(200).json({
        returnCode: "Failed",
        returnMessage: `bizType::${bizType}, bizStatus::${bizStatus}`,
      });
    }
  } catch (error) {
    console.log("ERROR EN EL SERVICIO DEL WEBHOOK", error);
  }
};
