import { AppDataSource } from "../config/data-source";
import { Ride } from "../entities/Ride";
import { RideRequest } from "../entities/RideRequest";
import { Brackets } from "typeorm";
import { Vehicle } from "../entities/Vehicle";
import { User } from "../entities/User";
import { CreateRideInput } from "../schemas/ride.schema";
import { AppError } from "../errors/AppError";
import { Like, Not } from "typeorm";

interface RideFilters {
  origin?: string;
  destination?: string;
  date?: string;
  page?: number;
  limit?: number;
}

const rideRepo = AppDataSource.getRepository(Ride);
const requestRepo = AppDataSource.getRepository(RideRequest);
const userRepo = AppDataSource.getRepository(User);
const vehicleRepo = AppDataSource.getRepository(Vehicle);

export class RideService {

  static async create(data: CreateRideInput, userId: number) {
    const vehicle = await vehicleRepo.findOneBy({ id: data.vehicleId });

    if (!vehicle) {
      throw new AppError("Veículo não encontrado.", 404);
    }

    if (vehicle.userId !== userId) {
      throw new AppError("Você não pode oferecer carona com um veículo que não é seu.", 403);
    }

    const driver = await userRepo.findOneBy({ id: userId });
    if (!driver) throw new AppError("Usuário não encontrado.", 404);

    const ride = rideRepo.create({
      ...data,
      driver,
      vehicle,
      status: 'open'
    });

    await rideRepo.save(ride);

    return ride;
  }

  static async list(filters: RideFilters, currentUserId?: number) {
    const { origin, destination, date, page = 1, limit = 10 } = filters;
    const skip = (page - 1) * limit;

    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const currentHours = String(now.getHours()).padStart(2, '0');
    const currentMinutes = String(now.getMinutes()).padStart(2, '0');
    const currentTimeStr = `${currentHours}:${currentMinutes}`;

    const query = rideRepo.createQueryBuilder("ride")
      .leftJoinAndSelect("ride.driver", "driver")
      .leftJoinAndSelect("ride.vehicle", "vehicle")
      .leftJoinAndSelect("ride.requests", "requests")
      .leftJoinAndSelect("requests.passenger", "passenger")
      .where("ride.status = :status", { status: 'open' });

    if (currentUserId) {
      query.andWhere("ride.driverId != :currentUserId", { currentUserId });
    }

    if (origin) {
      query.andWhere("ride.origin LIKE :origin", { origin: `%${origin}%` });
    }
    if (destination) {
      query.andWhere("ride.destination LIKE :destination", { destination: `%${destination}%` });
    }

    if (date) {
      // Caso 1: Usuário filtrou uma data específica
      if (date === todayStr) {
        query.andWhere("ride.date = :date", { date });
        query.andWhere("ride.time >= :currentTime", { currentTime: currentTimeStr });
      } else {
        // Se for data futura ou passada
        query.andWhere("ride.date = :date", { date });
        // Garantir que nunca retorna passado
        query.andWhere("ride.date >= :todayStr", { todayStr });
      }
    } else {
      // Caso 2: Busca Padrão (Sem data definida)
      query.andWhere(new Brackets(qb => {
        qb.where("ride.date > :today", { today: todayStr })
          .orWhere(new Brackets(subQb => {
            subQb.where("ride.date = :today", { today: todayStr })
                .andWhere("ride.time >= :time", { time: currentTimeStr });
          }));
      }));
    }

    query.orderBy("ride.date", "ASC")
        .addOrderBy("ride.time", "ASC");

    query.skip(skip).take(limit);

    const [rides, total] = await query.getManyAndCount();

    return {
      data: rides,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  static async getById(rideId: number) {
    const ride = await rideRepo.findOne({
      where: { id: rideId },
      relations: ["driver", "vehicle", "requests", "requests.passenger"]
    });

    if (!ride) throw new AppError("Carona não encontrada.", 404);
    return ride;
  }

  static async cancelRide(rideId: number, userId: number) {
    const ride = await this.getById(rideId);

    if (ride.driverId !== userId) {
      throw new AppError("Apenas o motorista pode cancelar a viagem.", 403);
    }

    ride.status = 'cancelled';
    await rideRepo.save(ride);
  
    return { message: "Carona cancelada com sucesso" };
  }

  static async requestSeat(rideId: number, passengerId: number) {
    const ride = await this.getById(rideId);

    if (ride.driverId === passengerId) {
      throw new AppError("Você não pode pedir carona na sua própria viagem.", 400);
    }

    if (ride.seats <= 0) {
      throw new AppError("Carona lotada.", 400);
    }

    const existingRequest = await requestRepo.findOneBy({ rideId, passengerId });
    if (existingRequest) {
      if (existingRequest.status === 'pending' || existingRequest.status === 'approved') {
         throw new AppError("Você já solicitou vaga nesta carona.", 400);
      }
    }

    const passenger = await userRepo.findOneBy({ id: passengerId });
    if (!passenger) throw new AppError("Usuário não encontrado.", 404);

    const request = requestRepo.create({
      ride,
      passenger,
      status: 'pending'
    });

    await requestRepo.save(request);
    return request;
  }

  static async handleRequest(requestId: number, driverId: number, action: 'accept' | 'reject') {
    const request = await requestRepo.findOne({
      where: { id: requestId },
      relations: ["ride"]
    });

    if (!request) throw new AppError("Solicitação não encontrada.", 404);

    if (request.ride.driverId !== driverId) {
      throw new AppError("Apenas o motorista pode gerenciar esta solicitação.", 403);
    }

    if (request.status !== 'pending') {
      throw new AppError("Esta solicitação já foi processada.", 400);
    }

    if (action === 'accept') {
      if (request.ride.seats <= 0) {
        throw new AppError("Não há mais vagas disponíveis.", 400);
      }
      
      request.status = 'approved';
      request.ride.seats -= 1;
      
      if (request.ride.seats === 0) {
         request.ride.status = 'full';
      }

      await rideRepo.save(request.ride);
    } else {
      request.status = 'rejected';
    }

    await requestRepo.save(request);
    return request;
  }

  static async getMyRides(userId: number) {
    const asDriver = await rideRepo.find({
      where: { driverId: userId },
      relations: ["driver", "vehicle", "requests", "requests.passenger"],
      order: { date: "DESC" }
    });

    const requests = await requestRepo.find({
      where: { passengerId: userId },
      relations: ["ride", "ride.driver", "ride.vehicle", "ride.requests", "ride.requests.passenger"],
      order: { createdAt: "DESC" }
    });

    const asPassenger = requests.map(req => {
        const ride: any = req.ride;
        ride.papel = 'passageiro'; 
        ride.myStatus = req.status;
        return ride;
    });

    return { asDriver, asPassenger };
  }

  static async listAll() {
    return rideRepo.find({
      relations: ["driver", "vehicle"],
      order: { date: "DESC", time: "DESC" }
    });
  }

  static async deleteRide(rideId: number) {
    const ride = await rideRepo.findOneBy({ id: rideId });
    
    if (!ride) {
      throw new AppError("Carona não encontrada.", 404);
    }
    
    await rideRepo.remove(ride);
  }
}