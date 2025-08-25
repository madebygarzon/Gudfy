import { Resend } from "resend";
import { render } from "@react-email/render";
import { PurchaseCompleted } from "./purchase-completed";
import { PurchaseSellerCompleted } from "./purchase-seller-completed";

type EmailApplication = {
  serialCodes: { serialCodes: string; title: string }[];
  email: string;
  order: string;
  name: string;
};
type EmailApplicationSeller = {
  storesWithCodes: [
    {
      store_id: string;
      store_name: string;
      email_store: string;
      name_store: string;
      codes: [{ serialCodes: string; title: string }];
    },
    {
      store_id: string;
      store_name: string;
      email_store: string;
      name_store: string;
      codes: [{ serialCodes: string; title: string }];
    }
  ];
  order_id: string;
};

export async function EmailPurchaseCompleted({
  serialCodes,
  email,
  name,
  order,
}: EmailApplication) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const emailHtml = render(
    <PurchaseCompleted order={order} serialCodes={serialCodes} name={name} />
  );
  const options = {
    from: process.env.RESEND_FROM_EMAIL,
    to: email,
    subject: `Confirmación de compra – Pedido ${order}`,
    html: emailHtml,
  };
  await resend.emails.send(options);
}

export async function EmailPurchaseSellerCompleted({
  storesWithCodes,
  order_id,
}: EmailApplicationSeller) {
  const resend = new Resend(process.env.RESEND_API_KEY);

  for (const store of storesWithCodes) {
    try {
      if (store.codes && store.codes.length > 0) {
        const emailHtml = render(
          <PurchaseSellerCompleted
            name_store={store.name_store}
            order_id={order_id}
            codes={store.codes}
          />
        );

        const options = {
          from: process.env.RESEND_FROM_EMAIL,
          to: store.email_store,
          subject: `¡Venta realizada! - Pedido #${order_id}`,
          html: emailHtml,
        };

        await resend.emails.send(options);
      }
    } catch (error) {
      console.error(`Error al enviar email a ${store.email_store}:`, error);
    }
  }
}
