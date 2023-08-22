import { recoverPassword } from "src/api/routes/customer/customer-router-handler";
import { EventBusService } from "@medusajs/medusa"
import { render } from "@react-email/render";
import sendgrid from "@sendgrid/mail";
import {Email} from "../api/email/email-recovery-pasword"

type InjectedDependencies = {
  eventBusService: EventBusService
}
interface DataOptions {
  email: string
  token: string
}
interface EmailOptions {
  templateId: string
  from: string;
  to: string;
  subject: string;
}
class RecoveryPasswork {
  constructor({ eventBusService }: InjectedDependencies ){
    eventBusService.subscribe(
      "customer.password_reset", 
      this.handleRecoveryPass
    )
  }



  handleRecoveryPass = async (data :DataOptions) => {
    try {
      console.log("ACA LLEGA ___________________-----------------_______________--------------")
    await sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
    const { email, token } = data
    const emailHtml = render(<Email url="https://example.com" email={email} token={token} />);

  const options: EmailOptions = {
    templateId: process.env.SENDGRID_ORDER_PLACED_ID,
    from: "rdelgado@gudfy.com",
    to: email,
    subject: "recovery password",
  };

  sendgrid.send(options);
    } catch (error) {
      console.log("error en el subcriptor", {message:error})
    }
    
  }
}

 



export default RecoveryPasswork;