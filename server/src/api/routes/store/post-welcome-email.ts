import { Request, Response } from "express";
import { EmailWelcomeAccount } from "../../../admin/components/email/email-welcome-account";

export default async (req: Request, res: Response) => {
  try {
    const { email, name } = req.body;

    await EmailWelcomeAccount({ email, name }).then(() => {
      res.status(200).send();
    });
  } catch (error) {
    console.log(
      "Error en el punto final al actualizar los datos de la orden",
      error
    );
  }
};
