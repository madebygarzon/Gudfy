import { Resend } from "resend";
import { render } from "@react-email/render";
import { LowStockNotificate } from "./low-stock";

type EmailApplication = {
  email: string;
  product_title: string;
  name: string;
};

export async function EmailLowStock({
  email,
  product_title,
  name,
}: EmailApplication) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const emailHtml = render(
    <LowStockNotificate productName={product_title} sellerName={name} />
  );
  const options = {
    from: process.env.RESEND_FROM_EMAIL,
    to: email,
    subject: `Alerta de stock`,
    html: emailHtml,
  };
  await resend.emails.send(options);
}


