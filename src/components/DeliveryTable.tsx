import { useState, useMemo, useEffect } from 'react';
import { SortAsc, SortDesc, Trash2, Printer, Clock, ArrowUpDown } from 'lucide-react';
import { Delivery, SortField } from '../types';

interface Props {
  deliveries: Delivery[];
  onSort: (field: SortField) => void;
  sortField: SortField;
  sortDirection: 'asc' | 'desc';
  onDelete: (id: string) => void;
  onUpdateStatus: (id: string, status: 'Doca' | 'Rota de Entrega') => void;
}

export function DeliveryTable({ deliveries: initialDeliveries, onSort, sortField, sortDirection, onDelete, onUpdateStatus }: Props) {
  const [filters, setFilters] = useState<Partial<Record<keyof Delivery, string>>>({});
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [deliveries, setDeliveries] = useState<Delivery[]>(initialDeliveries);

  useEffect(() => {
    setDeliveries(initialDeliveries);
    setLastUpdate(new Date());
  }, [initialDeliveries]);

  const uniqueValues = useMemo(() => {
    const values: Partial<Record<keyof Delivery, Set<string>>> = {};
    deliveries.forEach(delivery => {
      Object.entries(delivery).forEach(([key, value]) => {
        if (!values[key as keyof Delivery]) {
          values[key as keyof Delivery] = new Set();
        }
        values[key as keyof Delivery]?.add(String(value));
      });
    });
    return values;
  }, [deliveries]);

  const filteredDeliveries = useMemo(() => {
    return deliveries.filter(delivery => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value) return true;
        const fieldValue = String(delivery[key as keyof Delivery]).toLowerCase();
        return fieldValue === value.toLowerCase();
      });
    });
  }, [deliveries, filters]);

  const calculateDaysInDoca = (docaDate: string) => {
    try {
      const start = new Date(docaDate);
      const now = new Date();
      
      // Verificar se a data é válida
      if (isNaN(start.getTime())) {
        return 0;
      }
      
      // Calcular a diferença em dias
      const diffTime = now.getTime() - start.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      // Retornar 0 se for negativo (não deve acontecer normalmente)
      return Math.max(0, diffDays);
    } catch (error) {
      console.error('Erro ao calcular dias na doca:', error);
      return 0;
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSortByStatus = () => {
    const sortedDeliveries = [...deliveries].sort((a, b) => {
      if (a.status === 'Doca' && b.status !== 'Doca') return -1;
      if (a.status !== 'Doca' && b.status === 'Doca') return 1;
      return 0;
    });
    setDeliveries(sortedDeliveries);
  };

  const handleDelete = (id: string) => {
    setDeliveries(prev => prev.filter(delivery => delivery.id !== id));
    onDelete(id);
  };

  const handleStatusUpdate = (id: string, status: 'Doca' | 'Rota de Entrega') => {
    setDeliveries(prev => prev.map(delivery => 
      delivery.id === id ? { ...delivery, status } : delivery
    ));
    onUpdateStatus(id, status);
  };

  const columnHeaders = [
    { key: 'client', label: 'Cliente' },
    { key: 'invoice', label: 'Nota Fiscal' },
    { key: 'destination', label: 'Destino' },
    { key: 'weight', label: 'Peso' },
    { key: 'volume', label: 'Volume' },
    { key: 'status', label: 'Status' },
    { key: 'observation', label: 'Observação' }
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4 print:hidden">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Clock size={16} />
            <span>Última atualização: {lastUpdate.toLocaleTimeString()}</span>
          </div>
          <button
            onClick={handleSortByStatus}
            className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 dark:bg-blue-500 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 text-sm"
          >
            <ArrowUpDown size={16} />
            Classificar Status
          </button>
        </div>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 bg-gray-600 dark:bg-gray-700 text-white rounded-md hover:bg-gray-700 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
        >
          <Printer size={18} />
          Imprimir Tabela
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-900 shadow-md rounded-lg print:shadow-none print:bg-white">
          <thead className="bg-gray-50 dark:bg-gray-800 print:bg-white">
            <tr className="print:hidden">
              {columnHeaders.map(({ key }) => (
                <th key={`filter-${key}`} className="px-2 py-1">
                  <select
                    className="w-full px-2 py-1 text-sm border rounded dark:bg-gray-600 dark:border-gray-500 dark:text-white print:bg-white print:text-black print:border-gray-300"
                    value={filters[key as keyof Delivery] || ''}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      [key]: e.target.value
                    }))}
                  >
                    <option value="">Todos</option>
                    {Array.from(uniqueValues[key as keyof Delivery] || []).sort().map(value => (
                      <option key={value} value={value}>{value}</option>
                    ))}
                  </select>
                </th>
              ))}
              <th className="px-2 py-1">Dias na Doca</th>
              <th className="px-2 py-1">Ações</th>
            </tr>
            <tr>
              {columnHeaders.map(({ key, label }) => (
                <th
                  key={key}
                  className="px-2 py-1 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 print:text-black print:text-sm print:font-bold print:bg-white"
                  onClick={() => onSort(key as SortField)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{label}</span>
                    {sortField === key && (
                      sortDirection === 'asc' ? <SortAsc size={14} className="print:hidden" /> : <SortDesc size={14} className="print:hidden" />
                    )}
                  </div>
                </th>
              ))}
              <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider print:text-black print:text-sm print:font-bold print:bg-white">
                Dias na Doca
              </th>
              <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider print:hidden">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredDeliveries.map((delivery) => (
              <tr 
                key={delivery.id} 
                data-status={delivery.status}
                className={`${delivery.status === 'Doca' ? 'bg-yellow-50 dark:bg-yellow-900/20' : ''} print:bg-white print:border-b`}
              >
                <td className="px-2 py-1 text-sm dark:text-gray-200 print:text-black">{delivery.client}</td>
                <td className="px-2 py-1 text-sm dark:text-gray-200 print:text-black">{delivery.invoice}</td>
                <td className="px-2 py-1 text-sm dark:text-gray-200 print:text-black">{delivery.destination}</td>
                <td className="px-2 py-1 text-sm dark:text-gray-200 print:text-black">{delivery.weight} kg</td>
                <td className="px-2 py-1 text-sm dark:text-gray-200 print:text-black">{delivery.volume} m³</td>
                <td className="px-2 py-1 text-sm">
                  <select
                    value={delivery.status}
                    onChange={(e) => handleStatusUpdate(delivery.id, e.target.value as 'Doca' | 'Rota de Entrega')}
                    className={`px-2 py-0.5 rounded-full text-sm border-0 cursor-pointer print:border-none print:bg-transparent ${
                      delivery.status === 'Doca' 
                        ? 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-200 print:text-black' 
                        : 'bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-200 print:text-black'
                    }`}
                  >
                    <option value="Doca">Doca</option>
                    <option value="Rota de Entrega">Rota de Entrega</option>
                  </select>
                </td>
                <td className="px-2 py-1 text-sm dark:text-gray-200 print:text-black">{delivery.observation}</td>
                <td className={`px-2 py-1 text-sm ${
                  delivery.status === 'Doca' && calculateDaysInDoca(delivery.docaDate) >= 5 
                    ? 'bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-200 print:text-black' 
                    : 'print:text-black'
                }`}>
                  {delivery.status === 'Doca' ? `${calculateDaysInDoca(delivery.docaDate)} dias` : '-'}
                </td>
                <td className="px-2 py-1 print:hidden">
                  <button
                    onClick={() => handleDelete(delivery.id)}
                    className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style>{`
        @media print {
          @page {
            size: landscape;
            margin: 1cm;
          }
          
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
            font-size: 9pt;
            background-color: white !important;
            color: black !important;
          }

          .print\\:hidden {
            display: none !important;
          }

          tr:not([data-status="Doca"]) {
            display: none !important;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            background-color: white !important;
          }

          th, td {
            padding: 4px 6px;
            text-align: left;
            border-bottom: 1px solid #ddd;
            font-size: 9pt;
            color: black !important;
            background-color: white !important;
          }

          th {
            font-weight: bold;
            background-color: white !important;
            color: black !important;
          }

          select {
            background-color: white !important;
            color: black !important;
            border: 1px solid #ddd !important;
          }

          option {
            background-color: white !important;
            color: black !important;
          }

          /* Forçar modo claro para todos os elementos durante a impressão */
          * {
            background-color: white !important;
            color: black !important;
          }

          /* Remover classes de tema escuro */
          .dark {
            background-color: white !important;
            color: black !important;
          }

          /* Ajustar cores específicas */
          .dark\\:bg-gray-900,
          .dark\\:bg-gray-800,
          .dark\\:bg-gray-700,
          .dark\\:bg-gray-600,
          .dark\\:text-gray-200,
          .dark\\:text-gray-300,
          .dark\\:text-gray-400 {
            background-color: white !important;
            color: black !important;
          }
        }
      `}</style>
    </div>
  );
}