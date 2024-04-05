import sendgrid from "@sendgrid/mail";
import { render } from "@react-email/render";
import { ApprovedApplication } from "./state-seller-application/approved-seller-application";
import { RejectedApplication } from "./state-seller-application/rejected-seller-application";
import { CorrectionApplication } from "./state-seller-application/correction-seller-application";
import { SentApplication } from "./state-seller-application/sent-seller-application";

type EmailApplication = {
  name: string;
  email: string;
  message?: string;
};
export async function ApprovedEmailSellerApplication({
  name,
  email,
}: EmailApplication) {
  await sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
  const emailHtml = render(<ApprovedApplication name={name} />);
  const options = {
    from: process.env.SENDGRID_FROM,
    to: email,
    subject: "Solicitud de vendedor aprobada",
    html: emailHtml,
  };
  sendgrid.send(options);
}

export async function RejectedEmailSellerApplication({
  name,
  email,
  message,
}: EmailApplication) {
  await sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
  const emailHtml = render(
    <RejectedApplication name={name} message={message} />
  );
  const options = {
    from: process.env.SENDGRID_FROM,
    to: email,
    subject: "Solicitud de vendedor rechazada",
    html: emailHtml,
  };
  sendgrid.send(options);
}

export async function CorrectionEmailSellerApplication({
  name,
  email,
  message,
}: EmailApplication) {
  await sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
  const emailHtml = render(
    <CorrectionApplication name={name} message={message} />
  );
  const options = {
    from: process.env.SENDGRID_FROM,
    to: email,
    subject: "Solicitud de vendedor por corregir",
    html: emailHtml,
  };
  sendgrid.send(options);
}

export async function SendEmailSellerApplication({
  name,
  email,
}: EmailApplication) {
  await sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
  const emailHtml = render(<SentApplication name={name} />);
  const options = {
    from: process.env.SENDGRID_FROM,
    to: email,
    subject: "Solicitud de vendedor fue enviada",
    html: emailHtml,
  };
  sendgrid.send(options);
}
