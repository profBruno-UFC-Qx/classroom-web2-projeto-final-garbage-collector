import { Request, Response } from "express";
import { AuthService } from "../services/AuthService";

export class AuthController {
  
  static async register(req: Request, res: Response) {
    try {
      const user = await AuthService.register(req.body);

      return res.status(201).json({
        message: "Usuário criado com sucesso!",
        user
      });

    } catch (error: any) {
      if (error.message === "Este email já está em uso.") {
        return res.status(409).json({ message: error.message });
      }

      return res.status(500).json({ message: "Erro interno no servidor." });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const result = await AuthService.login(req.body);

      return res.json({
        message: "Login realizado com sucesso!",
        ...result
      });

    } catch (error: any) {
      if (error.message === "Credenciais inválidas.") {
        return res.status(401).json({ message: error.message });
      }

      return res.status(500).json({ message: "Erro interno no servidor." });
    }
  }
}