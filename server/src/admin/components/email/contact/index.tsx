import sendgrid from "@sendgrid/mail";
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
    await sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
    const emailHtml = render(<ContactEmail {...data} />);

    const options = {
      from: process.env.SENDGRID_FROM,
      to: process.env.RECEPTION_EMAIL || "sales@gudfy.com",
      subject: `Nuevo mensaje de contacto`,
      html: emailHtml,
    };

    await sendgrid.send(options);
  } catch (error) {
    console.log("Error sending email", error);
  }
}
