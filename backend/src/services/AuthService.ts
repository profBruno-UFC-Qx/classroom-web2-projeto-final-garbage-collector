import { AppDataSource } from "../config/data-source";
import { User } from "../entities/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { RegisterInput, LoginInput } from "../schemas/auth.schema";
import { AppError } from "../errors/AppError"; 
import { env } from "../config/env"; 

const userRepository = AppDataSource.getRepository(User);

export class AuthService {

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
      role: 'passageiro'
    });

    await userRepository.save(user);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    };
  }

  static async login(data: LoginInput) {
    const { email, password } = data;

    const user = await userRepository.findOneBy({ email });
    
    if (!user) {
      throw new AppError("Credenciais inválidas.", 401);
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new AppError("Credenciais inválidas.", 401);
    }

    const token = jwt.sign(
      { id: user.id, role: user.role }, 
      env.JWT_SECRET, 
      { expiresIn: "1d" }
    );

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar
      }
    };
  }
}