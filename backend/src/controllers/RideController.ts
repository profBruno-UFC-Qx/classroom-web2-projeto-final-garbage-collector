import { Request, Response } from "express";
import { RideService } from "../services/RideService";
import { toRideDTO } from "../dto/ride.dto"; 

export class RideController {

  static async create(req: Request, res: Response) {
    // @ts-ignore
    const userId = req.user.id;

    const rideEntity = await RideService.create(req.body, userId);

    const rideResponse = toRideDTO(rideEntity);

    return res.status(201).json(rideResponse);
  }
}