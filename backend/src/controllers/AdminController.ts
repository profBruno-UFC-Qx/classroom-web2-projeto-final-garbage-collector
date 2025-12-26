import { Request, Response } from "express";
import { UserService } from "../services/UserService";
import { RideService } from "../services/RideService";
import { toUserDTO } from "../dto/user.dto";
import { toRideDTO } from "../dto/ride.dto";

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

  static async deleteRide(req: Request, res: Response) {
    const { id } = req.params;
    await RideService.deleteRide(Number(id));
    return res.status(204).send();
  }
}