import sendgrid from "@sendgrid/mail";
import { render } from "@react-email/render";
import { RequestProductApproved } from "./request-product-approved";
import { RequestProductRejected } from "./request-product-reject";

type EmailTicket = {
  title_product: string;
  store_name: string;
  customer_email: string;
  variants: string;
  note: string;
};
export async function EmailRequestProductApproved({
  title_product,
  store_name,
  customer_email,
  variants,
  note,
}: EmailTicket) {
  await sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
  const emailHtml = render(
    <RequestProductApproved
      title_product={title_product}
      store_name={store_name}
      customer_email={customer_email}
      variants={variants}
      note={note}
    />
  );
  const options = {
    from: process.env.SENDGRID_FROM,
    to: customer_email,
    subject: `Tu solicitud para el producto ${title_product} a sido aprobada exitosamente`,
    html: emailHtml,
  };
  sendgrid.send(options);
}

export async function EmailRequestProductRejected({
  title_product,
  store_name,
  customer_email,
  note,
  
}: EmailTicket) {
  await sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
  const emailHtml = render(
    <RequestProductRejected
      title_product={title_product}
      store_name={store_name}
      customer_email={customer_email}
      note={note}
    />
  );
  const options = {
    from: process.env.SENDGRID_FROM,
    to: customer_email,
    subject: `Tu solicitud para el producto ${title_product} a sido rechazada exitosamente`,
    html: emailHtml,
  };
  sendgrid.send(options);
}
