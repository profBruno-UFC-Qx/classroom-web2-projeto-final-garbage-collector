import { AppDataSource } from "../config/data-source";
import { User } from "../entities/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { RegisterInput, LoginInput } from "../schemas/auth.schema";

const userRepository = AppDataSource.getRepository(User);

const JWT_SECRET = process.env.JWT_SECRET || "meu_segredo_jwt";
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET não está definido nas variáveis de ambiente");
}

export class AuthService {

  static async register(data: RegisterInput) {
    const { name, email, password } = data;

    const userExists = await userRepository.findOneBy({ email });
    if (userExists) {
      throw new Error("Este email já está em uso.");
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
      throw new Error("Credenciais inválidas.");
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error("Credenciais inválidas.");
    }

    const token = jwt.sign(
      { id: user.id, role: user.role }, 
      JWT_SECRET, 
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