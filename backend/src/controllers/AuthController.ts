import { Request, Response } from "express";
import { AuthService } from "../services/AuthService";
import { AppError } from "../errors/AppError"; 
import { toUserDTO } from "../dto/user.dto";

export class AuthController {
  
  static async register(req: Request, res: Response) {
    const user = await AuthService.register(req.body);

    return res.status(201).json({
      message: "Conta criada! Verifique seu e-mail para ativar o acesso.",
      user: toUserDTO(user)
    });
  }

  static async verifyEmail(req: Request, res: Response) {
    const { token } = req.query; 

    if (!token || typeof token !== 'string') {
      throw new AppError("Token não fornecido.", 400);
    }

    const result = await AuthService.verifyEmail(token);
    return res.json(result);
  }

  static async login(req: Request, res: Response) {
    const { token, user } = await AuthService.login(req.body);

    return res.json({
      message: "Login realizado com sucesso!",
      token,
      user: toUserDTO(user) 
    });
  }
}