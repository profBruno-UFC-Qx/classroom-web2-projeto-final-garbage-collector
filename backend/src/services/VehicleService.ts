import { AppDataSource } from "../config/data-source";
import { Vehicle } from "../entities/Vehicle";
import { CreateVehicleInput } from "../schemas/vehicle.schema";
import { AppError } from "../errors/AppError"; 
import { UpdateVehicleInput } from "../schemas/vehicle.schema";
import { Not } from "typeorm";

const vehicleRepository = AppDataSource.getRepository(Vehicle);

export class VehicleService {

  static async create(data: CreateVehicleInput, userId: number) {
    
    const existingVehicle = await vehicleRepository.findOneBy({ plate: data.plate });
    
    if (existingVehicle) {
      throw new AppError("Esta placa já está cadastrada no sistema.", 409);
    }

    const vehicle = vehicleRepository.create({ ...data, userId });
    await vehicleRepository.save(vehicle);
    return vehicle;
  }

  static async delete(vehicleId: number, userId: number) {
    const vehicle = await vehicleRepository.findOneBy({ id: vehicleId });

    if (!vehicle) {
      throw new AppError("Veículo não encontrado.", 404);
    }

    if (vehicle.userId !== userId) {
      throw new AppError("Você não tem permissão para excluir este veículo.", 403);
    }

    await vehicleRepository.remove(vehicle);
  }

  static async listByUser(userId: number) {
    return vehicleRepository.find({
      where: { userId },
      order: { createdAt: "DESC" }
    });
  }

  static async update(vehicleId: number, userId: number, data: UpdateVehicleInput) {
    const vehicle = await vehicleRepository.findOneBy({ id: vehicleId });

    if (!vehicle) {
      throw new AppError("Veículo não encontrado.", 404);
    }

    if (vehicle.userId !== userId) {
      throw new AppError("Você não tem permissão para editar este veículo.", 403);
    }

    if (data.plate) {
      const plateExists = await vehicleRepository.findOne({
        where: { 
          plate: data.plate,
          id: Not(vehicleId)
        }
      });

      if (plateExists) {
        throw new AppError("Esta placa já está cadastrada em outro veículo.", 409);
      }
    }

    vehicleRepository.merge(vehicle, data);
    
    await vehicleRepository.save(vehicle);
    return vehicle;
  }
}