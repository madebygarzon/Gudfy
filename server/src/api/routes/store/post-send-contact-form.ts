import { Request, Response } from "express";
import { ReceptionEmail } from "../../../admin/components/email/contact";

export default async (req: Request, res: Response) => {
  try {
    const data = req.body;
    console.log("Entra al enpoint y estos son los datossssssssssss:", data)
    await ReceptionEmail(data).then(() => {
      res.status(200).send();
    });
  } catch (error) {
    console.log(
      "Error en el punto final al actualizar los datos de la orden",
      error
    );
  }
};
