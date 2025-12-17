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

  static async list(req: Request, res: Response) {
    const { search } = req.query;
    const rides = await RideService.list(search as string);
    return res.json(rides.map(r => toRideDTO(r, req.user?.id)));
  }

  static async getById(req: Request, res: Response) {
    const { id } = req.params;
    const ride = await RideService.getById(Number(id));
    return res.json(toRideDTO(ride, req.user?.id));
  }

  static async cancel(req: Request, res: Response) {
    const { id } = req.params;
    const userId = req.user?.id;
    if (!userId) throw new AppError("Não autenticado");

    await RideService.cancelRide(Number(id), userId);
    return res.json({ message: "Carona cancelada com sucesso." });
  }

  static async requestSeat(req: Request, res: Response) {
    const { id } = req.params; 
    const userId = req.user?.id;
    if (!userId) throw new AppError("Não autenticado");

    await RideService.requestSeat(Number(id), userId);
    return res.json({ message: "Solicitação enviada com sucesso!" });
  }

  static async handleRequest(req: Request, res: Response) {
    const { requestId } = req.params; 
    const { action } = req.body; 
    const userId = req.user?.id;
    
    if (!userId) throw new AppError("Não autenticado");
    if (!['accept', 'reject'].includes(action)) throw new AppError("Ação inválida");

    await RideService.handleRequest(Number(requestId), userId, action);
    
    return res.json({ message: `Solicitação ${action === 'accept' ? 'aceita' : 'recusada'}.` });
  }

  static async myRides(req: Request, res: Response) {
      const userId = req.user?.id;
      if (!userId) throw new AppError("Não autenticado");

      const { asDriver, asPassenger } = await RideService.getMyRides(userId);

      const driverDtos = asDriver.map(r => ({...toRideDTO(r, userId), papel: 'motorista'}));
      const passengerDtos = asPassenger.map(r => ({...toRideDTO(r, userId), papel: 'passageiro'}));

      return res.json([...driverDtos, ...passengerDtos]);
  }
}