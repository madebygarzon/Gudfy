import { Request, Response } from "express";

export default async function UpdateOrderToCompleted(
  req: Request,
  res: Response
) {
  try {
    
    const { order_id } = req.body;
    const storeOrderAdminService = req.scope.resolve("storeOrderAdminService");
    const data = await storeOrderAdminService.UpdateOrderToComplete(
      order_id
    );
    if(data.success){
      res.status(200).json(data);
    }else{
      res.status(200).json(data);
    }
  } catch (error) {
    res.status(400).send(error);
  }
}
