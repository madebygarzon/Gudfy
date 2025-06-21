import nodemailer from "nodemailer"
import NotificationService from "medusa-interfaces"

interface Options {
  host: string
  port?: number
  secure?: boolean
  user?: string
  pass?: string
  from: string
}

export default class BillionMailNotificationService extends NotificationService {
  static identifier = "billionmail"

  protected transporter_: nodemailer.Transporter
  protected from_: string

  constructor(_, options: Options) {
    // @ts-expect-error prefer-rest-params
    super(...arguments)
    this.from_ = options.from
    this.transporter_ = nodemailer.createTransport({
      host: options.host,
      port: options.port ?? 587,
      secure: options.secure ?? false,
      auth: options.user ? { user: options.user, pass: options.pass } : undefined,
    })
  }

  async sendNotification(event: string, data: any): Promise<void> {
    const { to, subject, html } = data
    await this.transporter_.sendMail({
      from: this.from_,
      to,
      subject,
      html,
    })
  }

  async resendNotification(notification: any): Promise<void> {
    return this.sendNotification(notification.event_name, notification.data)
  }
}
