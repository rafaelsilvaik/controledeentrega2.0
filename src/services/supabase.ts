import { createClient } from '@supabase/supabase-js';
import { Delivery } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Credenciais do Supabase não encontradas');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function getDeliveries() {
  const { data, error } = await supabase
    .from('deliveries')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export const addDelivery = async (delivery: Omit<Delivery, 'id' | 'created_at'>) => {
  try {
    // Formatando os dados antes de enviar
    const formattedDelivery = {
      client: delivery.client,
      invoice: delivery.invoice,
      destination: delivery.destination,
      weight: Number(delivery.weight),
      volume: Number(delivery.volume),
      status: delivery.status,
      observation: delivery.observation || '',
      doca_date: delivery.docaDate
    };

    const { data, error } = await supabase
      .from('deliveries')
      .insert([formattedDelivery])
      .select()
      .single();

    if (error) {
      console.error('Erro Supabase:', error);
      throw new Error('Erro ao adicionar entrega no banco de dados');
    }

    return data;
  } catch (error) {
    console.error('Erro ao adicionar entrega:', error);
    throw error;
  }
};

export async function updateDeliveryStatus(id: string, status: 'Doca' | 'Rota de Entrega') {
  const { data, error } = await supabase
    .from('deliveries')
    .update({ status })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteDelivery(id: string) {
  const { error } = await supabase
    .from('deliveries')
    .delete()
    .eq('id', id);

  if (error) throw error;
} 