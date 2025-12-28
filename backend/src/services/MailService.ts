import nodemailer, { Transporter } from "nodemailer";
import ejs from "ejs";
import path from "path";
import { env } from "../config/env"; 

class MailService {
  private transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: env.MAIL_HOST,
      port: env.MAIL_PORT,
      secure: env.MAIL_SECURE,
      auth: {
        user: env.MAIL_USER,
        pass: env.MAIL_PASS,
      },
    });

    console.log(`MailService iniciado com: (${env.MAIL_USER})`);
  }

  private async renderTemplate(templatePath: string, data: any): Promise<string> {
    const fullPath = path.join(__dirname, '..', 'views', 'emails', templatePath);
    return await ejs.renderFile(fullPath, data);
  }

  async sendVerificationEmail(to: string, name: string, token: string) {
    const verificationLink = `${env.FRONTEND_URL}/verificar-email?token=${token}&email=${to}&mode=verify`;

    const html = await this.renderTemplate('confirmation/html.ejs', {
      name,
      verificationLink,
    });

    await this.transporter.sendMail({
      from: `"Carona UFC" <${env.MAIL_USER}>`,
      to,
      subject: "Confirme sua conta - Carona UFC",
      html,
    });

    console.log("✅ E-mail de verificação enviado para:", to);
  }
}

export default new MailService();