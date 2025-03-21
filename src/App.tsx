import { useState, useEffect } from 'react';
import { HelpCircle } from 'lucide-react';
import { DeliveryTable } from './components/DeliveryTable';
import { DeliveryForm } from './components/DeliveryForm';
import { ThemeToggle } from './components/ThemeToggle';
import { Delivery, SortField } from './types';
import { getDeliveries, addDelivery, updateDeliveryStatus, deleteDelivery } from './services/supabase';

function App() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [sortField, setSortField] = useState<SortField>('invoice');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [showHelp, setShowHelp] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDeliveries();
  }, []);

  const loadDeliveries = async () => {
    try {
      const data = await getDeliveries();
      setDeliveries(data);
    } catch (error) {
      console.error('Erro ao carregar entregas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }

    const sortedDeliveries = [...deliveries].sort((a, b) => {
      const aValue = a[field];
      const bValue = b[field];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      return sortDirection === 'asc'
        ? Number(aValue) - Number(bValue)
        : Number(bValue) - Number(aValue);
    });

    setDeliveries(sortedDeliveries);
  };

  const handleAddDelivery = async (newDelivery: Omit<Delivery, 'id'>) => {
  console.log('Starting to add delivery:', newDelivery);
    try {
      const delivery = await addDelivery(newDelivery);
    console.log('Delivery added successfully:', delivery);
      setDeliveries(prev => [...prev, delivery]);
    } catch (error) {
    console.error('Error in handleAddDelivery:', error);
    // Opcional: Adicionar notificação de erro para o usuário
    alert('Erro ao adicionar entrega. Por favor, tente novamente.');
    }
  };

  const handleDeleteDelivery = async (id: string) => {
    try {
      await deleteDelivery(id);
      setDeliveries(prev => prev.filter(delivery => delivery.id !== id));
    } catch (error) {
      console.error('Erro ao deletar entrega:', error);
    }
  };

  const handleUpdateStatus = async (id: string, status: 'Doca' | 'Rota de Entrega') => {
    try {
      const updatedDelivery = await updateDeliveryStatus(id, status);
      setDeliveries(prev => prev.map(delivery => 
        delivery.id === id ? updatedDelivery : delivery
      ));
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-black p-8 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-8 max-w-md w-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <div className="text-lg text-gray-600 dark:text-gray-300 mb-2">
              {deliveries === null ? 'Erro de conexão com o banco de dados' : 'Carregando...'}
            </div>
            {deliveries === null && (
              <div className="text-sm text-red-500">
                Verifique se as variáveis de ambiente do Supabase (VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY) estão configuradas corretamente no arquivo .env
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-black p-8 print:bg-white print:p-0">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 mb-8 print:shadow-none print:p-0">
          <div className="flex justify-between items-center mb-6 print:mb-4 print:border-b print:pb-4">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white print:text-3xl">
              Controle de Entregas Jangadeiro
            </h1>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <button
                onClick={() => setShowHelp(prev => !prev)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 print:hidden"
              >
                <HelpCircle size={24} />
              </button>
            </div>
          </div>

          {showHelp && (
            <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg mb-6 print:hidden">
              <h2 className="font-semibold mb-2 dark:text-white">Instruções de Uso:</h2>
              <ul className="list-disc list-inside space-y-1 text-sm dark:text-gray-300">
                <li>Use o formulário acima para adicionar novas entregas</li>
                <li>Clique nos cabeçalhos das colunas para ordenar os dados</li>
                <li>Use os filtros acima de cada coluna para buscar informações específicas</li>
                <li>Entregas na Doca há mais de 5 dias são destacadas em vermelho</li>
                <li>O status "Doca" é destacado em amarelo</li>
                <li>O status "Rota de Entrega" é destacado em verde</li>
                <li>Use o botão de lixeira para remover uma entrega</li>
                <li>Clique no status para alterá-lo diretamente na tabela</li>
                <li>Use o botão "Imprimir Tabela" para uma versão de impressão elegante</li>
              </ul>
            </div>
          )}

          <div className="print:hidden">
            <DeliveryForm onSubmit={handleAddDelivery} />
          </div>
          
          <DeliveryTable
            deliveries={deliveries}
            onSort={handleSort}
            sortField={sortField}
            sortDirection={sortDirection}
            onDelete={handleDeleteDelivery}
            onUpdateStatus={handleUpdateStatus}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
