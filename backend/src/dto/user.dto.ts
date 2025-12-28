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
  totalRides: number;
  createdAt: Date;
  isActive: boolean;
  isVerified: boolean; 
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
    createdAt: user.createdAt,
    totalRides: user.totalRides,
    isActive: user.isActive,
    isVerified: user.isVerified 
  };
};