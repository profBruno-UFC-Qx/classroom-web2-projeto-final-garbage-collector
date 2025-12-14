import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"] as const;

export const updateUserSchema = z.object({
  name: z
    .string()
    .min(3, "O nome deve ter pelo menos 3 caracteres.")
    .max(100, "O nome não pode exceder 100 caracteres.")
    .optional(),
  phone: z
    .string()
    .transform(val => val.replace(/\D/g, ''))
    .refine(val => /^[1-9]{2}9?\d{8}$/.test(val), {
      message: "Telefone inválido. Use: DDD + número (10 ou 11 dígitos)"
    })
    .optional(),
  showPhone: z.boolean().optional(),
  emailNotifications: z.boolean().optional(),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;

export const avatarFileSchema = z.object({
  fieldname: z.string(),
  originalname: z.string(),
  encoding: z.string(),
  mimetype: z.enum(ACCEPTED_IMAGE_TYPES, {
    message: "Formato inválido. Aceito apenas .jpg, .jpeg, .png e .webp",
  }),
  buffer: z.any(), 
  size: z.number().max(MAX_FILE_SIZE, "O arquivo deve ter no máximo 5MB."),
});