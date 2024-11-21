import { Request, Response } from "express";

export async function postAddCodesStoreVariant(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const dataAddCode = req.body;
    const CodeService = req.scope.resolve("serialCodeService");
    const add = await CodeService.addListCodesStoreVariant(dataAddCode);
    res.status(200).send(add);
  } catch (error) {
    console.log("Error Endpoint add product variant for store", error);
  }
}
