import { sendMail } from "../../../utils/mailer";
import { render } from "@react-email/render";
import { ApprovedApplication } from "./state-seller-application/approved-seller-application";
import { RejectedApplication } from "./state-seller-application/rejected-seller-application";
import { CorrectionApplication } from "./state-seller-application/correction-seller-application";
import { SentApplication } from "./state-seller-application/sent-seller-application";
import { NewSellerApplication } from "./state-seller-application/new-seller-application";

type EmailApplication = {
  name: string;
  email: string;
  message?: string;
};
export async function ApprovedEmailSellerApplication({
  name,
  email,
}: EmailApplication) {
  const emailHtml = render(<ApprovedApplication name={name} />);
  await sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: "Solicitud de vendedor aprobada",
    html: emailHtml,
  });
}

export async function RejectedEmailSellerApplication({
  name,
  email,
  message,
}: EmailApplication) {
  const emailHtml = render(
    <RejectedApplication name={name} message={message} />
  );
  await sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: "Solicitud de vendedor rechazada",
    html: emailHtml,
  });
}

export async function CorrectionEmailSellerApplication({
  name,
  email,
  message,
}: EmailApplication) {
  const emailHtml = render(
    <CorrectionApplication name={name} message={message} />
  );
  await sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: "Solicitud de vendedor por corregir",
    html: emailHtml,
  });
}

export async function SendEmailSellerApplication({
  name,
  email,
}: EmailApplication) {
  const emailHtml = render(<SentApplication name={name} />);
  const emailHtmlAdmin = render(<NewSellerApplication name={name} email={email}/>);
  const options = [
    {
      from: process.env.SMTP_FROM,
      to: email,
      subject: "Solicitud de vendedor fue enviada",
      html: emailHtml,
    },
    {
      from: process.env.SMTP_FROM,
      to: "rdelgado@gudfy.com",
      subject: "Nueva solicitud de vendedor",
      html: emailHtmlAdmin,
    },
  ];
  for (const opt of options) {
    await sendMail(opt);
  }
}
