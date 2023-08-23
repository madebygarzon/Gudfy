import React from "react";
import { Request, Response } from "express";



export const recoverPassword = async (
  req: Request,
  res: Response
): Promise<void> => {

    res.status(404).json({ errorMessage:"error"})
  
};
