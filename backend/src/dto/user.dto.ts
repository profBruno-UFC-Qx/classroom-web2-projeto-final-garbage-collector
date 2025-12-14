import { User } from "../entities/User";

export interface UserDTO {
  id: number;
  name: string;
  email: string;
  role: string;
  phone?: string;
  avatar?: string;
  rating: number;
}

export const toUserDTO = (user: User): UserDTO => {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
    avatar: user.avatar,
    rating: user.rating
  };
};