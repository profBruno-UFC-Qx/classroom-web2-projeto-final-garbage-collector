import { Request, Response } from "express";
import { UserService } from "../services/UserService";
import { RideService } from "../services/RideService";
import { toUserDTO } from "../dto/user.dto";
import { toRideDTO } from "../dto/ride.dto";
import { AppError } from "../errors/AppError";

export class AdminController {

  static async listUsers(req: Request, res: Response) {
    const users = await UserService.listAll();
    const usersDTO = users.map(user => toUserDTO(user));
    return res.json(usersDTO);
  }

  static async toggleUserStatus(req: Request, res: Response) {
    const { id } = req.params;
    const user = await UserService.toggleStatus(Number(id));
    
    return res.json({
      message: `Usuário ${user.isActive ? 'ativado' : 'desativado'} com sucesso.`,
      user: toUserDTO(user)
    });
  }

  static async listRides(req: Request, res: Response) {
    const rides = await RideService.listAll();
    const ridesDTO = rides.map(ride => toRideDTO(ride));
    return res.json(ridesDTO);
  }

  static async cancelRide(req: Request, res: Response) {
    const { id } = req.params;
    const userId = req.user?.id;
    const isAdmin = req.user?.role === 'admin';

    if (!userId) throw new AppError("Não autenticado", 401);

    await RideService.cancelRide(Number(id), userId, isAdmin);
    
    return res.json({ message: "Carona cancelada pelo administrador." });
  }
}