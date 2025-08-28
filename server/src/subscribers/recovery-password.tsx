import type { EventBusService } from "@medusajs/medusa"
import { render } from "@react-email/render"
import { Resend } from "resend"
import { Email } from "../admin/components/email/email-recovery-pasword";


type InjectedDependencies = {
  eventBusService: EventBusService
}

interface DataOptions {
  email: string
  token: string
  first_name?: string
}

class RecoveryPassword {
  private readonly resend: Resend
  private readonly from: string
  private readonly resetBaseUrl?: string

  constructor({ eventBusService }: InjectedDependencies) {
    const apiKey = process.env.RESEND_API_KEY
    const from = process.env.RESEND_FROM_EMAIL
    this.resetBaseUrl = process.env.URL_RESET_PASSWORD

    if (!apiKey) {
      console.warn("[recovery-password] RESEND_API_KEY is missing")
    }
    if (!from) {
      console.warn("[recovery-password] RESEND_FROM_EMAIL is missing")
    }

    this.resend = new Resend(apiKey)
    this.from = from || "Gudfy <no-reply@example.com>"

    eventBusService.subscribe("customer.password_reset", this.handleRecoveryPass)

    console.log("[recovery-password] Subscriber registered for 'customer.password_reset'")
  }

  private handleRecoveryPass = async (data: DataOptions) => {
    try {

      const { email, token } = data || {}

      if (!email || !token) {
        console.warn("[recovery-password] Missing email or token in event payload")
        return
      }


      const resetLink = this.resetBaseUrl
        ? `${this.resetBaseUrl}?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`
        : undefined

      const html = render(
        <Email
          url={`${process.env.FRONT_URL}/account/reset-password`}
          email={email}
          token={token}
        />
      )

      const { error } = await this.resend.emails.send({
        from: this.from,
        to: email,
        subject: "Restablecimiento de Contraseña Solicitado - GUDFY",
        html,
      })

      if (error) {
        console.error("[recovery-password] Resend error:", error)
      } else {
        console.log("[recovery-password] Password reset email sent to:", email)
      }
    } catch (err) {
      console.error("[recovery-password] Error sending email:", err)
    }
  }
}

export default RecoveryPassword
