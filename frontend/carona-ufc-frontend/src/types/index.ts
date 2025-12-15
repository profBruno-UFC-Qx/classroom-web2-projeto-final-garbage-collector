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
  id: number
  marca: string
  modelo: string
  cor: string
  placa: string
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
