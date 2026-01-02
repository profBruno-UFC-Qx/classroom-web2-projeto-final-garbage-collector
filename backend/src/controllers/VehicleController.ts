import { Request, Response } from "express";
import { VehicleService } from "../services/VehicleService";
import { toVehicleDTO } from "../dto/vehicle.dto";
import { AppError } from "../errors/AppError"; 

export class VehicleController {

  static async create(req: Request, res: Response) {
    const userId = req.user?.id;

    if (!userId) {
      throw new AppError("Usuário não autenticado.", 401);
    }

    const vehicle = await VehicleService.create(req.body, userId);
    
    return res.status(201).json(toVehicleDTO(vehicle));
  }

  static async list(req: Request, res: Response) {
    const userId = req.user?.id;
    
    if (!userId) {
      throw new AppError("Usuário não autenticado.", 401);
    }

    const vehicles = await VehicleService.listByUser(userId);
    
    const vehiclesDTO = vehicles.map(vehicle => toVehicleDTO(vehicle));
    
    return res.json(vehiclesDTO);
  }

  static async delete(req: Request, res: Response) {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) {
      throw new AppError("Usuário não autenticado.", 401);
    }

    await VehicleService.delete(Number(id), userId);
    return res.status(204).send();
  }
}