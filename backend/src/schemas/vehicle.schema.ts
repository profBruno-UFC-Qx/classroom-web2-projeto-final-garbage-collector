import { z } from "zod";

export const createVehicleSchema = z.object({
  brand: z.string()
    .min(2, "Marca deve ter pelo menos 2 caracteres")
    .max(50, "Marca muito longa")
    .trim(),
  
  model: z.string()
    .min(2, "Modelo deve ter pelo menos 2 caracteres")
    .max(100, "Modelo muito longo")
    .trim(),
  
  color: z.string()
    .min(3, "Cor deve ter pelo menos 3 caracteres")
    .max(30, "Cor muito longa")
    .trim(),
  
  plate: z.string()
    .trim()
    .toUpperCase()
    .regex(
      /^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/,
      "Placa inválida. Use formato ABC1234 ou ABC1D23 (Mercosul)"
    )
});

export type CreateVehicleInput = z.infer<typeof createVehicleSchema>;