import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  JWT_SECRET: z.string().min(1, "Variável JWT_SECRET é obrigatória no .env"),  
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  MAIL_HOST: z.string().min(1, "MAIL_HOST é obrigatório"),
  MAIL_PORT: z.coerce.number().default(465),
  MAIL_USER: z.email("MAIL_USER deve ser um e-mail válido"),
  MAIL_PASS: z.string().min(1, "MAIL_PASS é obrigatório (Use App Password)"),
  MAIL_SECURE: z.coerce.boolean().default(true),
  FRONTEND_URL: z.url().default("http://localhost:5173"),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("❌ Erro nas variáveis de ambiente:");
  console.error(JSON.stringify(_env.error.issues, null, 2));
  process.exit(1);
}

export const env = _env.data;