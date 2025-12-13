import { z } from "zod";

const allowedDomains = ["@alu.ufc.br", "@ufc.br"];

export const registerSchema = z.object({
  name: z.string()
    .min(3, "O nome deve ter pelo menos 3 caracteres.")
    .max(100, "O nome não pode exceder 100 caracteres.")
    .trim()
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, "O nome deve conter apenas letras."),
  
  email: z
    .string()
    .trim()
    .toLowerCase()
    .pipe(z.email("Formato de email inválido."))
    .refine((email) => allowedDomains.some(domain => email.endsWith(domain)), {
      message: "Utilize um email institucional (@alu.ufc.br ou @ufc.br)."
    }),

  password: z.string()
    .min(8, "A senha deve ter pelo menos 8 caracteres.")
});

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .pipe(z.email("Email inválido.")),
  
  password: z.string()
    .min(1, "A senha é obrigatória.")
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;