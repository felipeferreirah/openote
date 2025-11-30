export interface Delivery {
  id: string
  dataContratacao: string
  saida: number
  transportador: string
  motorista: string
  placa: string
  nfVenda: string
  cliente: string
  cidade: string
  valorPedagio?: number
  valorDescarga?: number
  valorFrete?: number
  caixas?: number
}
