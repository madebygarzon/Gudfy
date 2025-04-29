import { Request, Response } from "express";

export async function DeleteSerialCodes(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { idSC } = req.query;
    const deleteSC = req.scope.resolve("serialCodeService");
    const deleteSerial = await deleteSC.deleteSerialCode(idSC);
    res.status(200).send(true);
  } catch (error) {
    console.log(error);
  }
}
