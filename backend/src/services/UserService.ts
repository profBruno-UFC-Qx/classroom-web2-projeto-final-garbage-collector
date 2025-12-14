import { AppDataSource } from "../config/data-source";
import { User } from "../entities/User";
import { AppError } from "../errors/AppError";
import { uploadToImgBB } from "../utils/imgbb";
import { UpdateUserInput } from "../schemas/user.schema"; 

const userRepository = AppDataSource.getRepository(User);

export class UserService {
  
  static async getProfile(userId: number) {
    const user = await userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new AppError("Usuário não encontrado.", 404);
    }
    return user;
  }

  static async update(userId: number, data: UpdateUserInput) {
    const user = await this.getProfile(userId);

    const cleanData = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v !== undefined)
    );

    userRepository.merge(user, cleanData);

    await userRepository.save(user);
    return user;
  }

  static async becomeDriver(userId: number) {
    const user = await this.getProfile(userId);
    if (user.role === 'motorista') {
      throw new AppError("Este usuário já é um motorista.", 400);
    }

    user.role = 'motorista';
    await userRepository.save(user);
    return user;
  }

  static async updateAvatar(userId: number, imageBuffer: Buffer) {
    const user = await this.getProfile(userId);
    const imageUrl = await uploadToImgBB(imageBuffer);

    user.avatar = imageUrl;
    await userRepository.save(user);
    return user;
  }
}