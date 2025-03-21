import React, { useState } from 'react';
import { Delivery } from '../types';

interface Props {
  onSubmit: (delivery: Omit<Delivery, 'id' | 'created_at'>) => void;
}

export function DeliveryForm({ onSubmit }: Props) {
  const [formData, setFormData] = useState<{
    client: string;
    invoice: string;
    destination: string;
    weight: string;
    volume: string;
    status: 'Doca' | 'Rota de Entrega';
    observation: string;
  }>({
    client: '',
    invoice: '',
    destination: '',
    weight: '',
    volume: '',
    status: 'Doca',
    observation: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!formData.client || !formData.invoice || !formData.destination || !formData.weight || !formData.volume) {
      alert('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    try {
      const newDelivery: Omit<Delivery, 'id' | 'created_at'> = {
        client: formData.client,
        invoice: formData.invoice,
        destination: formData.destination,
        weight: Number(formData.weight),
        volume: Number(formData.volume),
        status: formData.status,
        observation: formData.observation || '',
        docaDate: new Date().toISOString()
      };

      await onSubmit(newDelivery);
      
      // Limpar formulário após sucesso
      setFormData({
        client: '',
        invoice: '',
        destination: '',
        weight: '',
        volume: '',
        status: 'Doca',
        observation: ''
      });

    } catch (error) {
      console.error('Erro ao adicionar entrega:', error);
      alert('Erro ao adicionar entrega. Por favor, verifique os dados e tente novamente.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Cliente
        </label>
        <input
          type="text"
          value={formData.client}
          onChange={(e) => setFormData({ ...formData, client: e.target.value })}
          className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm text-sm"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Nota Fiscal
        </label>
        <input
          type="text"
          value={formData.invoice}
          onChange={(e) => setFormData({ ...formData, invoice: e.target.value })}
          className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm text-sm"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Destino
        </label>
        <input
          type="text"
          value={formData.destination}
          onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
          className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm text-sm"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Peso (kg)
        </label>
        <input
          type="number"
          value={formData.weight}
          onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
          className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm text-sm"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Volume (m³)
        </label>
        <input
          type="number"
          value={formData.volume}
          onChange={(e) => setFormData({ ...formData, volume: e.target.value })}
          className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm text-sm"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Status
        </label>
        <select
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Doca' | 'Rota de Entrega' })}
          className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm text-sm"
        >
          <option value="Doca">Doca</option>
          <option value="Rota de Entrega">Rota de Entrega</option>
        </select>
      </div>

      <div className="col-span-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Observação
        </label>
        <input
          type="text"
          value={formData.observation}
          onChange={(e) => setFormData({ ...formData, observation: e.target.value })}
          className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm text-sm"
        />
      </div>

      <div className="col-span-2 md:col-span-4 flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm font-medium"
        >
          Adicionar Entrega
        </button>
      </div>
    </form>
  );
}