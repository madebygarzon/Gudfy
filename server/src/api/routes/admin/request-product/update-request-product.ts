import { Request, Response } from "express";

const updateRequestProduct = async (req: Request, res: Response) => {
  const { request_id } = req.body;
  const reqProdService = req.scope.resolve("requestProductService");
  await reqProdService.updateRequest(request_id).then(() => {
    res.status(200).send();
  });
};

export default updateRequestProduct;
