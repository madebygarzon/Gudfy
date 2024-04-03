import { Request, Response } from "express";
import { MedusaError } from "@medusajs/utils";

interface RequestFiles {
  frontDocument?: Express.Multer.File[];
  reversDocument?: Express.Multer.File[];
  addressDocument?: Express.Multer.File[];
  supplierDocuments?: Express.Multer.File[];
}

export default async (req: Request, res: Response): Promise<void> => {
  const paramsToUpdate: RequestFiles = {};
  const applicationData = JSON.parse(req.body.applicationData);
  // const frontDocument = req.files["frontDocument"][0];
  // const reversDocument = req.files["reversDocument"][0];
  // const addressDocument = req.files["addressDocument"][0];
  // const supplierDocuments = req.files["supplierDocuments"][0];

  if (req.files["frontDocument"]) {
    paramsToUpdate.frontDocument = req.files["frontDocument"][0].path;
  }

  if (req.files["reversDocument"]) {
    paramsToUpdate.reversDocument = req.files["reversDocument"][0].path;
  }
  if (req.files["addressDocument"]) {
    paramsToUpdate.addressDocument = req.files["addressDocument"][0].path;
  }
  if (req.files["supplierDocuments"]) {
    paramsToUpdate.supplierDocuments = req.files["supplierDocuments"][0].path;
  }
  try {
    const sellerApplicationService = req.scope.resolve(
      "sellerApplicationService"
    );
    sellerApplicationService
      .update(applicationData, paramsToUpdate)
      .then((e) => {
        return res.status(202).json(e);
      });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error });
  }
};
