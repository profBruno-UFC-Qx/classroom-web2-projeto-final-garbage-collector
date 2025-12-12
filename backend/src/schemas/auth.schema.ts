import { z } from "zod";

const allowedDomains = ["@alu.ufc.br", "@ufc.br"];

export const registerSchema = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres."),
  
  email: z
    .email("Formato de email inválido.")
    .refine((email) => allowedDomains.some(domain => email.endsWith(domain)), {
      message: "Utilize um email institucional (@alu.ufc.br ou @ufc.br)."
    }),

  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres.")
});

export const loginSchema = z.object({
  email: z.email("Email inválido."),
  password: z.string().min(1, "A senha é obrigatória.")
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;