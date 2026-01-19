import { AppDataSource } from "./data-source";
import { User } from "../entities/User";
import bcrypt from "bcryptjs";

export const seedDatabase = async () => {
  const userRepository = AppDataSource.getRepository(User);

  const seedUsers = [
    {
      name: "Administrador",
      email: "admin@admin.com",
      password: "admin",
      role: "admin",
      avatar: "",
    },
    {
      name: "João Silva",
      email: "passageiro@gmail.com",
      password: "senha123",
      role: "passageiro",
      avatar: "https://www.shareicon.net/data/2015/09/18/103160_man_512x512.png;width=512;height=512",
    },
    {
      name: "Pedro Souza",
      email: "motorista@gmail.com",
      password: "senha123",
      role: "motorista",
      avatar: "https://static.vecteezy.com/system/resources/previews/051/270/245/non_2x/cartoon-people-avatar-minimalist-human-avatar-versatile-icon-for-online-projects-an-avatar-for-the-profile-picture-of-someone-vector.jpg",
    },
  ];

  for (const userData of seedUsers) {
    const alreadyExists = await userRepository.findOneBy({ email: userData.email });

    if (!alreadyExists) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      const user = userRepository.create({
        ...userData,
        password: hashedPassword,
        isVerified: true, 
        isActive: true
      });

      await userRepository.save(user);
      console.log(`Seed: Usuário ${userData.role} (${userData.email}) criado.`);
    }
  }
};