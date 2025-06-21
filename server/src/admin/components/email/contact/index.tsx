import { sendMail } from "../../../../utils/mailer";
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
    const emailHtml = render(<ContactEmail {...data} />);

    await sendMail({
      from: process.env.SMTP_FROM,
      to: process.env.RECEPTION_EMAIL || "sales@gudfy.com",
      subject: `Nuevo mensaje de contacto`,
      html: emailHtml,
    });
  } catch (error) {
    console.log("Error sending email", error);
  }
}
