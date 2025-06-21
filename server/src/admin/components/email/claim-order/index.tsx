import { sendMail } from "../../../../utils/mailer";
import { render } from "@react-email/render";
import { CreateClaimCustomer } from "./create-claim-customer";
import { CreateClaimSeller } from "./create-claim-seller";
import { OrderClaimUnsolved } from "./order-claim-unsolved";



type EmailCustomer = {
order_id: string;
customer_email: string;
  customer_name : string
};

type EmailSeller= {
    order_id: string;
    seller_email: string;
    store_name : string
    };
export async function EmailCreateClaimOrderCustomer({
    order_id ,
    customer_email,
  customer_name,
  
}: EmailCustomer) {
  const emailHtml = render(<CreateClaimCustomer order={order_id} name={customer_name} />);
  await sendMail({
    from: process.env.SMTP_FROM,
    to: customer_email,
    subject: `Tu reclamación para la orden ${order_id} a sido creada exitosamente`,
    html: emailHtml,
  });
}

export async function EmailCreateClaimOrderSeller({
    order_id,
    seller_email,
    store_name 
  }: EmailSeller) {
    const emailHtml = render(<CreateClaimSeller order_id={order_id}  store_name={store_name} />);
    await sendMail({
      from: process.env.SMTP_FROM,
      to: seller_email,
      subject: `Tienes una nueva reclamación en la orde ${order_id}`,
      html: emailHtml,
    });
  }

  export async function EmailOrderClaimAdmin(data: {
    product_name: string;
    customer_name: string;
    store_name: string;
  }) {
    const emailHtml = render(<OrderClaimUnsolved product_name={data.product_name}  customer_name={data.product_name} store_name ={data.store_name} />);
    await sendMail({
      from: process.env.SMTP_FROM,
      to: "rdelgado@gudfy.com",
      subject: `Reclamación sin resolver`,
      html: emailHtml,
    });
  }


