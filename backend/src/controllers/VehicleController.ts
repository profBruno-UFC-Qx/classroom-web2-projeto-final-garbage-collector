import { Request, Response } from "express";
import { VehicleService } from "../services/VehicleService";

export class VehicleController {

  static async create(req: Request, res: Response) {
    // @ts-ignore
    const userId = req.user.id;

    const vehicle = await VehicleService.create(req.body, userId);
    return res.status(201).json(vehicle);
  }

  static async list(req: Request, res: Response) {
    // @ts-ignore
    const userId = req.user.id;
    
    const vehicles = await VehicleService.listByUser(userId);
    return res.json(vehicles);
  }

  static async delete(req: Request, res: Response) {
    // @ts-ignore
    const userId = req.user.id;
    const { id } = req.params;

    await VehicleService.delete(Number(id), userId);
    return res.status(204).send();
  }
}