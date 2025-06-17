import { Request, Response } from "express";

const updateRequestProduct = async (req: Request, res: Response) => {
  const { request_id, product } = req.body;
  const reqProdService = req.scope.resolve("requestProductService");
  await reqProdService.updateRequest(request_id, product).then(() => {
    res.status(200).send();
  });
};

export default updateRequestProduct;
