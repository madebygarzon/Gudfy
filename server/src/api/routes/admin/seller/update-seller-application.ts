import { Request, Response } from "express";

export default async function UpdateSellerAplication(
  req: Request,
  res: Response
) {
  try {
    const { payload, customer_id } = req.body;
    const sellerApplicationRepository = req.scope.resolve(
      "sellerApplicationService"
    );
    const data = await sellerApplicationRepository.updateSellerAplication(
      payload,
      customer_id
    );
    res.status(200).json(data);
  } catch (error) {
    console.log("ERROR EN LA PETICION", error);
    res.status(400);
  }
}
