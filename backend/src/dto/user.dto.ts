import { User } from "../entities/User";

export interface UserDTO {
  id: number;
  name: string;
  email: string;
  role: string;
  phone?: string;
  showPhone: boolean;
  emailNotifications: boolean;
  avatar?: string;
  rating: number;
  isActive: boolean; 
}

export const toUserDTO = (user: User): UserDTO => {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
    showPhone: user.showPhone,
    emailNotifications: user.emailNotifications,
    avatar: user.avatar,
    rating: user.rating,
    isActive: user.isActive 
  };
};