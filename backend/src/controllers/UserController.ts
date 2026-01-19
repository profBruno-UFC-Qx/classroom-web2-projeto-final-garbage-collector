import { Request, Response } from "express";
import { UserService } from "../services/UserService";
import { AuthService } from "../services/AuthService";
import { toUserDTO } from "../dto/user.dto";
import { AppError } from "../errors/AppError";

export class UserController {

  static async me(req: Request, res: Response) {
    const userId = req.user?.id;
    if (!userId) throw new AppError("Usuário não autenticado.", 401);

    const user = await UserService.getProfile(userId);
    return res.json(toUserDTO(user));
  }

  static async update(req: Request, res: Response) {
    const userId = req.user?.id;
    if (!userId) throw new AppError("Usuário não autenticado.", 401);

    const user = await UserService.update(userId, req.body);

    return res.json({
      message: "Perfil atualizado com sucesso!",
      user: toUserDTO(user)
    });
  }

  static async becomeDriver(req: Request, res: Response) {
    const userId = req.user?.id;
    if (!userId) throw new AppError("Usuário não autenticado.", 401);

    const user = await UserService.becomeDriver(userId);

    const newToken = AuthService.generateToken(user);

    return res.json({
      message: "Parabéns! Agora você é um motorista.",
      user: toUserDTO(user),
      token: newToken 
    });
  }

  static async updateAvatar(req: Request, res: Response) {
    const userId = req.user?.id;
    if (!userId) throw new AppError("Usuário não autenticado.", 401);
    
    const buffer = (req.file as Express.Multer.File).buffer;

    const user = await UserService.updateAvatar(userId, buffer);

    return res.json({
      message: "Avatar atualizado com sucesso!",
      user: toUserDTO(user)
    });
  }
}