import { EventBusService } from "@medusajs/medusa";
import { render } from "@react-email/render";
import { sendMail } from "../utils/mailer";
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
     
      const { email, token } = data;
      const emailHtml = render(
        <Email
          url={process.env.URL_RESET_PASSWORD}
          email={email}
          token={token}
        />
      );

      await sendMail({
        from: process.env.SMTP_FROM,
        to: email,
        subject: "Restablecimiento de Contraseña Solicitado - GUDFY",
        html: emailHtml,
      });
 
    } catch (error) {
      console.log("Error sending email", error);
    }
  };
}

export default RecoveryPasswork;
