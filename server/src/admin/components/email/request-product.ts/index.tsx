import { sendMail } from "../../../../utils/mailer";
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
  const emailHtml = render(
    <RequestProductApproved
      title_product={title_product}
      store_name={store_name}
      customer_email={customer_email}
      variants={variants}
      note={note}
    />
  );
  await sendMail({
    from: process.env.SMTP_FROM,
    to: customer_email,
    subject: `Tu solicitud para el producto ${title_product} a sido aprobada exitosamente`,
    html: emailHtml,
  });
}

export async function EmailRequestProductRejected({
  title_product,
  store_name,
  customer_email,
  note,
  
}: EmailTicket) {
  const emailHtml = render(
    <RequestProductRejected
      title_product={title_product}
      store_name={store_name}
      customer_email={customer_email}
      note={note}
    />
  );
  await sendMail({
    from: process.env.SMTP_FROM,
    to: customer_email,
    subject: `Tu solicitud para el producto ${title_product} a sido rechazada exitosamente`,
    html: emailHtml,
  });
}
