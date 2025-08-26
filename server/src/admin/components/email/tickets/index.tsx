import { Resend } from "resend";
import { render } from "@react-email/render";
import { CreateTicketCustomer } from "./create-ticket-customer";
import { NewTicketAdmin } from "./new-ticket-admin";


type EmailTicket = {
tiket: string
  email: string;
  name : string
};
export async function EmailCreateTicketCustomer({
    tiket,
  email,
  name,
}: EmailTicket) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const emailHtml = render(<CreateTicketCustomer name={name} tiket={tiket} />);
  const emailHtmlAdmin = render(<NewTicketAdmin name={name} tiket={tiket} email={email}/>);
  const options = [{
    from: process.env.RESEND_FROM_EMAIL,
    to: email,
    subject: `Tu ticket ha sido creado exitosamente`,
    html: emailHtml,
  }];
options.push({
    from: process.env.RESEND_FROM_EMAIL,
    to: "rdelgado@gudfy.com",
    subject: `Tienes un nuevo ticket`,
    html: emailHtmlAdmin,
  });
   for (const option of options) {
    await resend.emails.send(option);
   }
}


