import { Resend } from "resend";
import { render } from "@react-email/render";
import { WelcomeAccount } from "./welcome-account";

type EmailTicket = {
  email: string;
  name: string;
};
export async function EmailWelcomeAccount({ email, name }: EmailTicket) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const emailHtml = render(<WelcomeAccount name={name} />);

    const options = {
      from: process.env.RESEND_FROM_EMAIL,
      to: email,
      subject: `¡Bienvenido a Gudfy Marketplace!`,
      html: emailHtml,
    };

    await resend.emails.send(options);
  } catch (error) {
    console.log("Error sending email", error);
  }
}
