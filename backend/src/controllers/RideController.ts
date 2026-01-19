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
    const { origin, destination, date, page, limit } = req.query;
    const currentUserId = req.user?.id; 

    const result = await RideService.list(
      {
        origin: origin ? String(origin) : undefined,
        destination: destination ? String(destination) : undefined,
        date: date ? String(date) : undefined,
        page: page ? Number(page) : 1,
        limit: limit ? Number(limit) : 10
      },
      currentUserId 
    );

    const ridesWithDto = result.data.map(ride => toRideDTO(ride, currentUserId));

    return res.json({
      data: ridesWithDto,
      meta: result.meta
    });
  }

  static async update(req: Request, res: Response) {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      throw new AppError("Usuário não autenticado.", 401);
    }

    const updatedRide = await RideService.update(Number(id), userId, req.body);
    
    return res.json({
      message: "Carona atualizada com sucesso!",
      ride: toRideDTO(updatedRide, userId)
    });
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

    const result = await RideService.cancelRide(Number(id), userId);
    return res.json(result);
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

  static async leave(req: Request, res: Response) {
    const { id } = req.params;
    const userId = req.user?.id;
    if (!userId) throw new AppError("Não autenticado");

    const result = await RideService.leaveRide(Number(id), userId);
    return res.json(result);
  }

  static async finish(req: Request, res: Response) {
    const { id } = req.params;
    const userId = req.user?.id;
    if (!userId) throw new AppError("Não autenticado");

    const result = await RideService.finishRide(Number(id), userId);
    return res.json(result);
  }
}