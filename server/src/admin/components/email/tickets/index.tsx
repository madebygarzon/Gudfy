import { sendMail } from "../../../../utils/mailer";
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
  const emailHtml = render(<CreateTicketCustomer name={name} tiket={tiket} />);
  const emailHtmlAdmin = render(<NewTicketAdmin name={name} tiket={tiket} email={email}/>);
  const options = [
    {
      from: process.env.SMTP_FROM,
      to: email,
      subject: `Tu ticket ha sido creado exitosamente`,
      html: emailHtml,
    },
    {
      from: process.env.SMTP_FROM,
      to: "rdelgado@gudfy.com",
      subject: `Tienes un nuevo ticket`,
      html: emailHtmlAdmin,
    },
  ];
  for (const opt of options) {
    await sendMail(opt);
  }
}


