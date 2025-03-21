export interface Delivery {
  id: string;
  client: string;
  invoice: string;
  destination: string;
  weight: number;
  volume: number;
  status: 'Doca' | 'Rota de Entrega';
  observation: string;
  docaDate: string; // ISO date string
}

export type SortField = keyof Delivery;