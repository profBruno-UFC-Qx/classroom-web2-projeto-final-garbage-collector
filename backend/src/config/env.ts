import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  
  JWT_SECRET: z.string().min(1, "Variável JWT_SECRET é obrigatória no .env"),
  
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("Erro nas variáveis de ambiente:", z.treeifyError(_env.error));
  process.exit(1);
}

export const env = _env.data;