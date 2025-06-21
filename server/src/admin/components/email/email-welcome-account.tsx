import { sendMail } from "../../../utils/mailer";
import { render } from "@react-email/render";
import { WelcomeAccount } from "./welcome-account";

type EmailTicket = {
  email: string;
  name: string;
};
export async function EmailWelcomeAccount({ email, name }: EmailTicket) {
  try {
    const emailHtml = render(<WelcomeAccount name={name} />);

    await sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: `¡Bienvenido a Gudfy Marketplace!`,
      html: emailHtml,
    });
  } catch (error) {
    console.log("Error sending email", error);
  }
}
