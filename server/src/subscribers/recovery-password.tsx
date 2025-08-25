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
    // Validate env early
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

    // Subscribe once on boot
    eventBusService.subscribe("customer.password_reset", this.handleRecoveryPass)

    console.log("[recovery-password] Subscriber registered for 'customer.password_reset'")
  }

  private handleRecoveryPass = async (data: DataOptions) => {
    try {
      console.log("[recovery-password] Event payload:", data)

      const { email, token } = data || {}
      if (!email || !token) {
        console.warn("[recovery-password] Missing email or token in event payload")
        return
      }

      // Build a reset URL if you prefer to send the full link directly
      const resetLink = this.resetBaseUrl
        ? `${this.resetBaseUrl}?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`
        : undefined

      const html = render(
        <Email
          // Your Email component accepts url, email, token — keep backward-compatible
          url={resetLink || this.resetBaseUrl}
          email={email}
          token={token}
        />
      )

      const { error } = await this.resend.emails.send({
        from: this.from,                     // must be verified in Resend
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
