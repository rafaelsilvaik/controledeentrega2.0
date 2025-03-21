export interface Delivery {
  id: string;
  client: string;
  invoice: string;
  destination: string;
  weight: number;
  volume: number;
  status: 'Doca' | 'Rota de Entrega';
  observation: string;
  docaDate: string;
  created_at?: string;
}

export type SortField = keyof Omit<Delivery, 'id' | 'created_at'>; 