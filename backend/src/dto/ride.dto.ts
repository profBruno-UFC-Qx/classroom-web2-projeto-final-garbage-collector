import { Ride } from "../entities/Ride";
import { UserDTO, toUserDTO } from "./user.dto";

export interface RideDTO {
  id: number;
  origin: string;
  destination: string;
  date: string;
  time: string;
  seats: number;
  status: string;
  driver: UserDTO; 
  vehicle: {
    id: number;
    brand: string;
    model: string;
    color: string;
    plate: string;
  };
  observation?: string;
}

export const toRideDTO = (ride: Ride): RideDTO => {
  return {
    id: ride.id,
    origin: ride.origin,
    destination: ride.destination,
    date: ride.date,
    time: ride.time,
    seats: ride.seats,
    status: ride.status,
    observation: ride.observation,
    
    driver: toUserDTO(ride.driver),
    
    vehicle: {
      id: ride.vehicle.id,
      brand: ride.vehicle.brand,
      model: ride.vehicle.model,
      color: ride.vehicle.color,
      plate: ride.vehicle.plate
    }
  };
};