import { Request, Response, NextFunction } from "express";
import { ZodObject } from "zod"; 
import { AppError } from "../errors/AppError";


export const validate = (schema: ZodObject) => (req: Request, res: Response, next: NextFunction) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (error) {
    next(error);
  }
};


export const validateFile = (schema: ZodObject) => (req: Request, res: Response, next: NextFunction) => {
  if (!req.file) {
    return next(new AppError("Nenhuma imagem enviada.", 400));
  }

  try {
    schema.parse(req.file);
    next();
  } catch (error) {
    next(error);
  }
};