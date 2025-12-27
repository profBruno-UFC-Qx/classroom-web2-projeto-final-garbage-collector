import nodemailer, { Transporter } from "nodemailer";
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

    console.log(`📧 MailService iniciado com: ${env.MAIL_HOST} (${env.MAIL_USER})`);
  }

  private generateVerificationEmailHTML(name: string, verificationLink: string): string {
    return `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f4f4f5; padding: 40px 20px;">
          <tr>
            <td align="center">
              <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
                
                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #111827 0%, #030712 100%); padding: 48px 40px; text-align: center;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 600; letter-spacing: -0.5px;">
                      Carona UFC
                    </h1>
                    <p style="margin: 12px 0 0 0; color: rgba(255, 255, 255, 0.9); font-size: 16px; font-weight: 400;">
                      Sistema de Caronas Universitárias
                    </p>
                  </td>
                </tr>
                
                <!-- Content -->
                <tr>
                  <td style="padding: 48px 40px;">
                    <h2 style="margin: 0 0 16px 0; color: #18181b; font-size: 24px; font-weight: 600;">
                      Olá, ${name}! 👋
                    </h2>
                    
                    <p style="margin: 0 0 24px 0; color: #52525b; font-size: 16px; line-height: 1.6;">
                      Bem-vindo à plataforma Carona UFC! Estamos felizes em ter você conosco.
                    </p>
                    
                    <p style="margin: 0 0 32px 0; color: #52525b; font-size: 16px; line-height: 1.6;">
                      Para começar a usar a plataforma e encontrar caronas ou oferecer suas próprias, você precisa confirmar seu endereço de e-mail.
                    </p>
                    
                    <!-- Button -->
                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td align="center" style="padding: 0 0 32px 0;">
                          <a href="${verificationLink}" style="display: inline-block; background: linear-gradient(135deg, #111827 0%, #030712 100%); color: #ffffff; text-decoration: none; padding: 16px 48px; border-radius: 8px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 12px rgba(17, 24, 39, 0.4); transition: transform 0.2s;">
                            Confirmar E-mail
                          </a>
                        </td>
                      </tr>
                    </table>
                    
                    <!-- Alternative Link -->
                    <div style="background-color: #f4f4f5; border-radius: 8px; padding: 20px; margin: 0 0 24px 0;">
                      <p style="margin: 0 0 8px 0; color: #71717a; font-size: 13px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;">
                        Ou copie e cole este link:
                      </p>
                      <p style="margin: 0; word-break: break-all;">
                        <a href="${verificationLink}" style="color: #111827; font-size: 14px; text-decoration: none;">
                          ${verificationLink}
                        </a>
                      </p>
                    </div>
                    
                    <p style="margin: 0; color: #a1a1aa; font-size: 14px; line-height: 1.5;">
                      Se você não criou uma conta na Carona UFC, pode ignorar este e-mail com segurança.
                    </p>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="background-color: #fafafa; padding: 32px 40px; text-align: center; border-top: 1px solid #e4e4e7;">
                    <p style="margin: 0 0 8px 0; color: #a1a1aa; font-size: 14px;">
                      Carona UFC - Conectando a comunidade universitária
                    </p>
                    <p style="margin: 0; color: #d4d4d8; font-size: 12px;">
                      © 2025 Carona UFC. Todos os direitos reservados.
                    </p>
                  </td>
                </tr>
                
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;
  }

  async sendVerificationEmail(to: string, name: string, token: string) {
    const verificationLink = `${env.FRONTEND_URL}/verificar-email?token=${token}&email=${to}&mode=verify`;

    await this.transporter.sendMail({
      from: `"Carona UFC" <${env.MAIL_USER}>`,
      to,
      subject: "✅ Confirme seu e-mail - Carona UFC",
      html: this.generateVerificationEmailHTML(name, verificationLink),
    });

    console.log("✅ E-mail de verificação enviado para:", to);
  }
}

export default new MailService();