import { Vehicle } from "../entities/Vehicle";

export interface VehicleDTO {
  id: number;
  brand: string;
  model: string;
  color: string;
  plate: string;
  userId: number;
}

export const toVehicleDTO = (vehicle: Vehicle): VehicleDTO => {
  return {
    id: vehicle.id,
    brand: vehicle.brand,
    model: vehicle.model,
    color: vehicle.color,
    plate: vehicle.plate,
    userId: vehicle.userId
  };
};