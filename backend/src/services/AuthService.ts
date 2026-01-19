import { AppDataSource } from "../config/data-source";
import { User } from "../entities/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { RegisterInput, LoginInput } from "../schemas/auth.schema";
import { AppError } from "../errors/AppError"; 
import MailService from "./MailService";
import { env } from "../config/env"; 

const userRepository = AppDataSource.getRepository(User);

export class AuthService {

  static generateToken(user: User): string {
    return jwt.sign(
      { id: user.id, role: user.role }, 
      env.JWT_SECRET,
      { expiresIn: "1d" }
    );
  }

  static async register(data: RegisterInput) {
    const { name, email, password } = data;

    const userExists = await userRepository.findOneBy({ email });
    if (userExists) {
      throw new AppError("Este email já está em uso.", 409);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = userRepository.create({
      name,
      email,
      password: hashedPassword,
      role: 'passageiro',
      isVerified: false, 
      isActive: true     
    });

    await userRepository.save(user);

    const verificationToken = jwt.sign(
      { id: user.id, type: 'email-verification' }, 
      env.JWT_SECRET, 
      { expiresIn: "24h" }
    );

    await MailService.sendVerificationEmail(user.email, user.name, verificationToken);

    return user;
  }

  static async login(data: LoginInput) {
    const { email, password } = data;

    const user = await userRepository.findOneBy({ email });
    
    if (!user) {
      throw new AppError("Credenciais inválidas.", 401);
    }

    if (!user.isActive) {
      throw new AppError("Sua conta foi desativada. Entre em contato com um administrador.", 403);
    }

    if (!user.isVerified) {
       throw new AppError("Você precisa confirmar seu e-mail antes de entrar.", 403);
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new AppError("Credenciais inválidas.", 401);
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return { token, user };
  }

  static async verifyEmail(token: string) {
    try {
      const decoded = jwt.verify(token, env.JWT_SECRET) as { id: number; type: string };

      if (decoded.type !== 'email-verification') {
        throw new AppError("Token inválido.", 400);
      }

      const user = await userRepository.findOneBy({ id: decoded.id });
      if (!user) throw new AppError("Usuário não encontrado.", 404);

      if (user.isVerified) {
        return { message: "E-mail já verificado anteriormente." };
      }

      user.isVerified = true;
      await userRepository.save(user);

      return { message: "E-mail verificado com sucesso!" };

    } catch (error) {
      throw new AppError("Token de verificação inválido ou expirado.", 400);
    }
  }
}