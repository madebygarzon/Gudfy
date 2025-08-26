import { Resend } from "resend";
import { render } from "@react-email/render";
import { ContactEmail } from "./reception-contact-email";

type EmailTicket = {
  name: string;
  email: string;
  phone?: string;
  message: string;
};
export async function ReceptionEmail(data: EmailTicket) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const emailHtml = render(<ContactEmail {...data} />);

    const options = {
      from: process.env.RESEND_FROM_EMAIL,
      to: process.env.RECEPTION_EMAIL || "sales@gudfy.com",
      subject: `Nuevo mensaje de contacto`,
      html: emailHtml,
    };

    await resend.emails.send(options);
  } catch (error) {
    console.log("Error sending email", error);
  }
}
