import { Request, Response } from "express";

export async function updateNameStore(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { name } = req.body;
    const nameStoreService = req.scope.resolve("storeService");
    const edit = await nameStoreService.updateNameStore(name);

    if (edit) {
      res.status(200).send({ succsess: edit });
    }
  } catch (error) {
    console.log("Error Endpoint add product variant for store", error);
  }
}
