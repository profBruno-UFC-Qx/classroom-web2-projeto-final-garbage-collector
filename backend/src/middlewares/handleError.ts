import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";
import { ZodError } from "zod";

export const handleError = (
  err: Error, 
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: err.message,
    });
  }

  if (err instanceof ZodError) {
    return res.status(400).json({
      message: "Erro de validação",
      errors: err.issues.map((e) => e.message),
    });
  }

  console.error(err); 
  return res.status(500).json({
    status: "error",
    message: "Erro interno do servidor.",
  });
};