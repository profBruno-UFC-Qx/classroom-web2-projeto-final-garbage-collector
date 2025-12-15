export interface Carona {
  id: number
  origem: string
  destino: string
  data: string
  horario: string
  motorista: string
  valor: number
  papel?: 'motorista' | 'passageiro' | 'viewer'
}

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
  rating: number;
  showPhone: boolean;
  emailNotifications: boolean;
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
