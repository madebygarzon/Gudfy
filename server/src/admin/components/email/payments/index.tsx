import sendgrid from "@sendgrid/mail";
import { render } from "@react-email/render";
import { PurchaseCompleted } from "./purchase-completed";


type EmailApplication = {
  serialCodes:  {serialCodes :string, title: string}[];
  email: string;
  order: string
  name : string
};
export async function EmailPurchaseCompleted({
  serialCodes ,
  email,
  name,
  order
}: EmailApplication) {
  await sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
  const emailHtml = render(<PurchaseCompleted order={order} serialCodes={serialCodes} name={name} />);
  const options = {
    from: process.env.SENDGRID_FROM,
    to: email,
    subject: `Compra completada de la orden ${order}`,
    html: emailHtml,
  };
  sendgrid.send(options);
}


