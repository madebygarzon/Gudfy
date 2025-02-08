import sendgrid from "@sendgrid/mail";
import { render } from "@react-email/render";
import { WelcomeAccount } from "./welcome-account";


type EmailTicket = {
  email: string;
  name : string
};
export async function EmailWelcomeAccount({
  email,
  name,
}: EmailTicket) {
  try {

    await sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
    const emailHtml = render(<WelcomeAccount  name={name} />);
    
    const options = {
      from: process.env.SENDGRID_FROM,
      to: email,
      subject: `¡Bienvenido a Gudfy Marketplace!`,
      html: emailHtml,
    }
  
     await sendgrid.send(options);
    
  } catch (error) {
      console.log("Error sending email", error);
  }
 
}


