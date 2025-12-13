import { Request, Response } from "express";
import { VehicleService } from "../services/VehicleService";

export class VehicleController {

  static async create(req: Request, res: Response) {
    // @ts-ignore
    const userId = req.user.id;

    try {
      const vehicle = await VehicleService.create(req.body, userId);
      return res.status(201).json(vehicle);
    } catch (error: any) {
      if (error.message === "Esta placa já está cadastrada no sistema.") {
        return res.status(409).json({ message: error.message });
      }

      return res.status(500).json({ message: "Erro ao criar veículo." });
    }
  }

  static async list(req: Request, res: Response) {
    // @ts-ignore
    const userId = req.user.id;

    try {
      const vehicles = await VehicleService.listByUser(userId);
      return res.json(vehicles);
    } catch (error) {
      return res.status(500).json({ message: "Erro ao buscar veículos." });
    }
  }

  static async delete(req: Request, res: Response) {
    // @ts-ignore
    const userId = req.user.id;
    const { id } = req.params;

    try {
      await VehicleService.delete(Number(id), userId);
      return res.status(204).send(); 
    } catch (error: any) {
      if (error.message.includes("permissão")) {
        return res.status(403).json({ message: error.message });
      }
      return res.status(500).json({ message: "Erro ao excluir veículo." });
    }
  }
}