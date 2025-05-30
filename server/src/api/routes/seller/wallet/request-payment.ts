import { Request, Response } from "express";

export default async (req: Request, res: Response): Promise<void> => {
  try {
    const walletService = req.scope.resolve("walletService");
    await walletService.requestPayment().then((e) => {
      return res.send(e);
    });
  } catch (error) {
    console.log(error);
  }
};
