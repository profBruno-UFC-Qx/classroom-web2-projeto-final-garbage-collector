import { AppDataSource } from "../config/data-source";
import { Ride } from "../entities/Ride";
import { Vehicle } from "../entities/Vehicle";
import { User } from "../entities/User";
import { CreateRideInput } from "../schemas/ride.schema";
import { AppError } from "../errors/AppError";

const rideRepository = AppDataSource.getRepository(Ride);
const vehicleRepository = AppDataSource.getRepository(Vehicle);
const userRepository = AppDataSource.getRepository(User);

export class RideService {

  static async create(data: CreateRideInput, userId: number) {
    const vehicle = await vehicleRepository.findOneBy({ id: data.vehicleId });

    if (!vehicle) {
      throw new AppError("Veículo não encontrado.", 404);
    }

    if (vehicle.userId !== userId) {
      throw new AppError("Você não pode oferecer carona com um veículo que não é seu.", 403);
    }

    const driver = await userRepository.findOneBy({ id: userId });
    if (!driver) throw new AppError("Usuário não encontrado.", 404);

    const ride = rideRepository.create({
      ...data,
      driver: driver,
      vehicle: vehicle,
      status: 'open'
    });

    await rideRepository.save(ride);

    return ride;
  }
}