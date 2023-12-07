import { Request, Response } from "express";

export default async function getListApplication(req: Request, res: Response) {
  res.status(200).send();
  //   const { customer_id } = req.query;
  //   console.log(customer_id, req.query);
  //   try {
  //     const sellerApplicationRepository = req.scope.resolve(
  //       "sellerApplicationService"
  //     );
  //     const data = sellerApplicationRepository.getListApplication();
  //     res.status(200).send(data);
  //   } catch (error) {
  //     res.status(400).json({ error });
  //   }
}
