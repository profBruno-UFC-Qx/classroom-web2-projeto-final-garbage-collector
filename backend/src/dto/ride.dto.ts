import { Ride } from "../entities/Ride";
import { UserDTO, toUserDTO } from "./user.dto";

export interface RideDTO {
  id: number;
  origin: string;
  destination: string;
  date: string;
  time: string;
  seats: number; 
  totalSeats?: number; 
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
  passengers?: {
    id: number;
    name: string;
    status: string; 
    avatar?: string;
  }[];
  userRequestStatus?: string | null;
}

export const toRideDTO = (ride: Ride, currentUserId?: number): RideDTO => {
  const approved = ride.requests?.filter(r => r.status === 'approved') || [];
  
  const myRequest = ride.requests?.find(r => r.passengerId === currentUserId);

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
    },
    passengers: ride.requests?.map(req => ({
      id: req.id, 
      passengerId: req.passenger.id,
      name: req.passenger.name,
      avatar: req.passenger.avatar,
      status: req.status
    })),
    userRequestStatus: myRequest ? myRequest.status : null
  };
};