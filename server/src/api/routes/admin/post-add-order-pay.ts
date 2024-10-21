import { Request, Response } from "express";
import { MedusaError } from "@medusajs/utils";

export default async (req: Request, res: Response): Promise<void> => {
  const applicationData = JSON.parse(req.body.addOrderPay);
  const products = JSON.parse(req.body.products);
  const voucher = req.file;
  try {
    const orderPayService = req.scope.resolve("orderPaymentService");
    orderPayService
      .postAddPayment(applicationData, voucher.path, products)
      .then(() => {
        return res.status(201);
      });
  } catch (error) {
    res.status(400).json({ error });
  }
};
