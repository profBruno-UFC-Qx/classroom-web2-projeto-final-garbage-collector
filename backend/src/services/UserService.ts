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

  static async listAll() {
    return userRepository.find({
      order: { name: "ASC" }
    });
  }

  static async toggleStatus(targetUserId: number) {
    const user = await userRepository.findOneBy({ id: targetUserId });
    
    if (!user) {
      throw new AppError("Usuário alvo não encontrado.", 404);
    }

    if (user.role === 'admin') {
      throw new AppError("Não é possível desativar outro administrador.", 403);
    }

    user.isActive = !user.isActive;
    await userRepository.save(user);

    return user;
  }
}