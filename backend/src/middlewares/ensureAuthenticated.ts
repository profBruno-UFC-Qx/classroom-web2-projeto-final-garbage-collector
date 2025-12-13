import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env"; 

export const ensureAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Token não fornecido." });
  }

  const [, token] = authHeader.split(" ");

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as { id: number; role: string };
    
    // @ts-ignore 
    req.user = { id: decoded.id, role: decoded.role };

    return next();
  } catch (err) {
    return res.status(401).json({ message: "Token inválido." });
  }
};