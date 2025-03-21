import { supabase } from './supabaseClient';

interface NFStorage {
  ultima_atualizacao: number;
  items: any[];
  operationType?: 'insert' | 'delete';
}

export const insertNF = async (newItem: any) => {
  const timestamp = Date.now();
  const { data, error } = await supabase
    .from('notas_fiscais')
    .insert([{ ...newItem, created_at: new Date(timestamp).toISOString() }]);

  if (!error) {
    await supabase
      .from('ultima_atualizacao')
      .upsert({ 
        id: 1, 
        timestamp, 
        operacao: 'insert' 
      });
  }

  return { data, error };
};

export const deleteNF = async (id: string) => {
  const timestamp = Date.now();
  const { data, error } = await supabase
    .from('notas_fiscais')
    .delete()
    .match({ id });

  if (!error) {
    await supabase
      .from('ultima_atualizacao')
      .upsert({ 
        id: 1, 
        timestamp, 
        operacao: 'delete' 
      });
  }

  return { data, error };
};

export const updateNF = (updatedItem: any) => {
  const storage = getNFStorage();
  storage.items = storage.items.map(item => 
    item.id === updatedItem.id ? updatedItem : item
  );
  // Não atualiza o timestamp em operações de update
  saveNFStorage(storage);
};

const getNFStorage = (): NFStorage => {
  const storage = localStorage.getItem('nf_storage');
  if (!storage) {
    return {
      ultima_atualizacao: Date.now(),
      items: []
    };
  }
  return JSON.parse(storage);
};

const saveNFStorage = (storage: NFStorage) => {
  localStorage.setItem('nf_storage', JSON.stringify(storage));
};

export const getLastNFUpdate = async (): Promise<string> => {
  const { data } = await supabase
    .from('ultima_atualizacao')
    .select('timestamp')
    .single();

  return data ? new Date(data.timestamp).toISOString() : new Date().toISOString();
};
