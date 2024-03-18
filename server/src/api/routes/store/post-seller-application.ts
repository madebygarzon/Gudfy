import { Request, Response } from "express";
import { MedusaError } from "@medusajs/utils";

export default async (req: Request, res: Response): Promise<void> => {
  const applicationData = JSON.parse(req.body.applicationData);
  const frontDocument = req.files["frontDocument"][0];
  const reversDocument = req.files["reversDocument"][0];
  const addressDocument = req.files["addressDocument"][0];
  try {
    const sellerApplicationService = req.scope.resolve(
      "sellerApplicationService"
    );
    sellerApplicationService
      .create(
        applicationData,
        frontDocument.path,
        reversDocument.path,
        addressDocument.path
      )
      .then((e) => {
        return res.status(202).json(e);
      });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error });
  }
};
