import { Request, Response } from "express";

export default async (req: Request, res: Response): Promise<void> => {
  const { wallet_address } = req.body;
  try {
    const walletService = req.scope.resolve("walletService");
    await walletService.updateWallet(wallet_address).then((e) => {
      return res.send(e);
    });
  } catch (error) {
    console.log(error);
  }
};
