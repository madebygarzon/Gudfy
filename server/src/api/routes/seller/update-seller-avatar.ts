import { Request, Response } from "express";

export async function updateSellerAvatar(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { avatar } = req.body;
    const nameStoreService = req.scope.resolve("storeService");
    const edit = await nameStoreService.updateAvatarStore(avatar);

    if (edit) {
      res.status(200).send({ succsess: edit });
    }
  } catch (error) {
    console.log("Error Endpoint add product variant for store", error);
  }
}
