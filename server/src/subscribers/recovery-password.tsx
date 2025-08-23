import { EventBusService } from "@medusajs/medusa";
import { render } from "@react-email/render";
import { Resend } from "resend";
import { Email } from "../admin/components/email/email-recovery-pasword";

type InjectedDependencies = {
  eventBusService: EventBusService;
};
interface DataOptions {
  email: string;
  token: string;
}

class RecoveryPasswork {
  constructor({ eventBusService }: InjectedDependencies) {
    try {
      
    eventBusService.subscribe(
      "customer.password_reset",
      this.handleRecoveryPass
    );
    
    } catch (error) {
      console.log("Error in the class RecoveryPassword", error)
    }
    
  }

  handleRecoveryPass = async (data: DataOptions) => {
    try {
     
      const resend = new Resend(process.env.RESEND_API_KEY);
      const { email, token } = data;
      const emailHtml = render(
        <Email
          url={process.env.URL_RESET_PASSWORD}
          email={email}
          token={token}
        />
      );

      const options = {
        from: process.env.RESEND_FROM_EMAIL,
        to: email,
        subject: "Restablecimiento de Contraseña Solicitado - GUDFY",
        html: emailHtml,
      };

      await resend.emails.send(options);
 
    } catch (error) {
      console.log("Error sending email", error);
    }
  };
}

export default RecoveryPasswork;
