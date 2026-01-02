import { z } from "zod";
import { isDateInFuture, isDateTimeInFuture } from "../utils/dateValidation";

export const createRideSchema = z.object({
  origin: z.string()
    .min(3, "Origem deve ter pelo menos 3 caracteres")
    .max(100, "Origem muito longa")
    .trim(),
  
  destination: z.string()
    .min(3, "Destino deve ter pelo menos 3 caracteres")
    .max(100, "Destino muito longo")
    .trim(),
  
  date: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida (Use YYYY-MM-DD)")
    .refine(isDateInFuture, "A data não pode ser no passado"),
  
  time: z.string()
    .regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, "Hora inválida (Use HH:MM)"),
  
  seats: z.number()
    .int("Número de vagas deve ser inteiro")
    .min(1, "Deve haver pelo menos 1 vaga")
    .max(6, "Máximo de 6 vagas"),
  
  vehicleId: z.number()
    .int("ID do veículo deve ser inteiro")
    .positive("ID do veículo deve ser positivo"),
  
  observation: z.string()
    .max(200, "Observação muito longa")
    .trim()
    .optional()
    .or(z.literal(""))
}).refine(
  (data) => isDateTimeInFuture(data.date, data.time),
  {
    message: "Data e hora devem ser futuras",
    path: ["time"]
  }
);

export type CreateRideInput = z.infer<typeof createRideSchema>;