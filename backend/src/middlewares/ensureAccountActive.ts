import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../config/data-source";
import { User } from "../entities/User";
import { AppError } from "../errors/AppError";

export const ensureAccountActive = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?.id;

  if (!userId) {
    throw new AppError("Usuário não autenticado.", 401);
  }

  const userRepository = AppDataSource.getRepository(User);
  const user = await userRepository.findOneBy({ id: userId });

  if (!user) {
    throw new AppError("Usuário não encontrado.", 404);
  }

  if (!user.isActive) {
    throw new AppError("Sua conta foi desativada. Entre em contato com o suporte.", 403);
  }

  return next();
};