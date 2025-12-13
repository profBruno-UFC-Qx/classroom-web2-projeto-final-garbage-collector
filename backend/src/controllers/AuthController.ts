import { Request, Response } from "express";
import { AuthService } from "../services/AuthService";

export class AuthController {
  
  static async register(req: Request, res: Response) {
    const user = await AuthService.register(req.body);

    return res.status(201).json({
      message: "Usuário criado com sucesso!",
      user
    });
  }

  static async login(req: Request, res: Response) {
    const result = await AuthService.login(req.body);

    return res.json({
      message: "Login realizado com sucesso!",
      ...result
    });
  }
}