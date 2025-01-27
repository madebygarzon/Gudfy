import sendgrid from "@sendgrid/mail";
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
  await sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
  const emailHtml = render(<CreateTicketCustomer name={name} tiket={tiket} />);
  const emailHtmlAdmin = render(<NewTicketAdmin name={name} tiket={tiket} email={email}/>);
  const options = [{
    from: process.env.SENDGRID_FROM,
    to: email,
    subject: `Tu ticket ha sido creado exitosamente`,
    html: emailHtml,
  }]
options.push({
    from: process.env.SENDGRID_FROM,
    to: "rdelgado@gudfy.com",
    subject: `Tienes un nuevo ticket`,
    html: emailHtmlAdmin,
  })
   await sendgrid.send(options);
}


