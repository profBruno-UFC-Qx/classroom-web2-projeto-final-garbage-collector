export interface Veiculo {
  id: number;
  brand: string;
  model: string;
  color: string;
  plate: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: 'passageiro' | 'motorista' | 'admin';
  avatar: string;
  totalRides?: number;
  showPhone: boolean;
  emailNotifications: boolean;
  isActive?: boolean;
  isVerified?: boolean;
  createdAt: string;
}

export interface CreateRidePayload {
  origin: string;
  destination: string;
  date: string;
  time: string;
  seats: number;
  vehicleId: number;
  observation?: string;
}

export interface RideForm {
  origin: string
  destination: string
  date: string
  time: string
  seats: number
  vehicleId: number | ''
  observation: string
}

export interface Passageiro {
  id: number;
  passengerId: number;
  name: string;
  avatar?: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface Carona {
  id: number;
  origin: string;
  destination: string;
  date: string;
  time: string;
  seats: number;
  status: string;
  observation?: string;
  driver: User;
  vehicle: {
    id: number;
    brand: string;
    model: string;
    color: string;
    plate: string;
  };
  passengers?: Passageiro[];
  userRequestStatus?: 'pending' | 'approved' | 'rejected' | null;
  papel?: 'motorista' | 'passageiro';
}
