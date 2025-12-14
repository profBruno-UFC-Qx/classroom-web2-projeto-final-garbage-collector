import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";

export const ensureRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // @ts-ignore 
    const userRole = req.user?.role;

    if (!allowedRoles.includes(userRole)) {
      throw new AppError("Acesso negado. Você não tem permissão para realizar esta ação.", 403);
    }

    return next();
  };
};