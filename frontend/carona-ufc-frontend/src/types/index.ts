export interface Carona {
  id: number
  origem: string
  destino: string
  data: string
  horario: string
  motorista: string
  valor: number
  // O papel é opcional porque ao buscar caronas públicas,
  // o usuário ainda não tem um papel definido nela.
  papel?: 'motorista' | 'passageiro' | 'viewer'
}
