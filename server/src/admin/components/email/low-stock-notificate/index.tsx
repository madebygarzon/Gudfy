import sendgrid from "@sendgrid/mail";
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
  await sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
  const emailHtml = render(
    <LowStockNotificate productName={product_title} sellerName={name} />
  );
  const options = {
    from: process.env.SENDGRID_FROM,
    to: email,
    subject: `Alerta de stock`,
    html: emailHtml,
  };
  sendgrid.send(options);
}


