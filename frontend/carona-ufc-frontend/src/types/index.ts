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
