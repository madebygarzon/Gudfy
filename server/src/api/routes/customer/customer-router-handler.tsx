import React from "react";
import { Request, Response } from "express";
import { render } from "@react-email/render";
import sendgrid from "@sendgrid/mail";
import { Email } from "../../email/email-recovery-pasword";
import { EventBusService } from "@medusajs/medusa";
import RecoveryPasswork from "src/subscribers/recovery-password";
interface EmailOptions {
  from: string;
  to: string;
  subject: string;
  html: string;
}

export const recoverPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {

    new RecoveryPasswork(req.body)
    

  res.json({message: "todo susedio"});
    
  } catch (error) {
    res.status(404).json({ errorMessage: error})
  }
  
};
