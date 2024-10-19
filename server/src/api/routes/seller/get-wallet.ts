import { Request, Response } from "express";

export async function getWallet(req: Request, res: Response): Promise<void> {
  try {
    const walletService = req.scope.resolve("walletService");

    const getWallet = await walletService.retriverWallet();

    if (getWallet) {
      res.status(200).send(getWallet);
    }
  } catch (error) {
    console.log("Error Endpoint get wallet", error);
  }
}
