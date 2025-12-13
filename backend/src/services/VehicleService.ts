import { AppDataSource } from "../config/data-source";
import { Vehicle } from "../entities/Vehicle";
import { CreateVehicleInput } from "../schemas/vehicle.schema";

const vehicleRepository = AppDataSource.getRepository(Vehicle);

export class VehicleService {

  static async create(data: CreateVehicleInput, userId: number) {
    const existingVehicle = await vehicleRepository.findOneBy({ plate: data.plate });
    
    if (existingVehicle) {
      throw new Error("Esta placa já está cadastrada no sistema.");
    }
    
    const vehicle = vehicleRepository.create({
      ...data,
      userId
    });

    await vehicleRepository.save(vehicle);
    return vehicle;
  }

  static async listByUser(userId: number) {
    return vehicleRepository.find({
      where: { userId },
      order: { createdAt: "DESC" }
    });
  }

  static async delete(vehicleId: number, userId: number) {
    const vehicle = await vehicleRepository.findOneBy({ id: vehicleId });

    if (!vehicle) {
      throw new Error("Veículo não encontrado.");
    }

    if (vehicle.userId !== userId) {
      throw new Error("Você não tem permissão para excluir este veículo.");
    }

    await vehicleRepository.remove(vehicle);
  }
}