import { Request, Response } from "express";
import { RideService } from "../services/RideService";
import { toRideDTO } from "../dto/ride.dto"; 
import { AppError } from "../errors/AppError";

export class RideController {

  static async create(req: Request, res: Response) {
    const userId = req.user?.id;

    if (!userId) {
      throw new AppError("Usuário não autenticado.", 401);
    }

    const rideEntity = await RideService.create(req.body, userId);

    const rideResponse = toRideDTO(rideEntity);

    return res.status(201).json(rideResponse);
  }
}