import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supervisorService } from '../services/supervisorService';
import Card, { CardHeader, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';

export default function StoresManagement() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStore, setEditingStore] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    latitude: '',
    longitude: '',
  });

  const { data, isLoading } = useQuery({
    queryKey: ['stores'],
    queryFn: () => supervisorService.getAllStores(),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => supervisorService.createStore(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stores'] });
      setIsModalOpen(false);
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      supervisorService.updateStore(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stores'] });
      setIsModalOpen(false);
      setEditingStore(null);
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => supervisorService.deleteStore(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stores'] });
    },
  });

  function resetForm() {
    setFormData({
      name: '',
      address: '',
      latitude: '',
      longitude: '',
    });
    setEditingStore(null);
  }

  function handleOpenModal(store?: any) {
    if (store) {
      setEditingStore(store);
      setFormData({
        name: store.name,
        address: store.address,
        latitude: store.latitude.toString(),
        longitude: store.longitude.toString(),
      });
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  }

  function handleCloseModal() {
    setIsModalOpen(false);
    resetForm();
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const data = {
      name: formData.name,
      address: formData.address,
      latitude: parseFloat(formData.latitude),
      longitude: parseFloat(formData.longitude),
    };

    if (editingStore) {
      updateMutation.mutate({ id: editingStore.id, data });
    } else {
      createMutation.mutate(data);
    }
  }

  function handleDelete(id: string) {
    if (confirm('Tem certeza que deseja deletar esta loja?')) {
      deleteMutation.mutate(id);
    }
  }

  const stores = data?.stores || [];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">
            Gerenciar Lojas
          </h1>
          <p className="text-text-secondary mt-2">
            Adicione, edite ou remova lojas do sistema
          </p>
        </div>
        <Button variant="primary" size="lg" onClick={() => handleOpenModal()}>
          ➕ Adicionar Loja
        </Button>
      </div>

      {/* Lista de Lojas */}
      {isLoading ? (
        <div className="flex items-center justify-center h-96">
          <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stores.map((store: any) => (
            <Card key={store.id} hover>
              <CardContent>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-text-primary mb-1">{store.name}</h3>
                    <p className="text-sm text-text-secondary mb-2">{store.address}</p>
                    <div className="flex items-center gap-2 text-xs text-text-tertiary">
                      <span>📍 {store.latitude.toFixed(4)}, {store.longitude.toFixed(4)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenModal(store)}
                    className="flex-1"
                  >
                    ✏️ Editar
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(store.id)}
                    className="flex-1"
                  >
                    🗑️ Deletar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {stores.length === 0 && (
            <div className="col-span-full text-center py-12">
              <div className="text-6xl mb-4">🏪</div>
              <p className="text-lg font-semibold text-text-primary mb-2">
                Nenhuma loja cadastrada
              </p>
              <p className="text-sm text-text-tertiary mb-4">
                Comece adicionando sua primeira loja
              </p>
              <Button variant="primary" onClick={() => handleOpenModal()}>
                Adicionar Primeira Loja
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Modal de Adicionar/Editar */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <h2 className="text-xl font-semibold text-text-primary">
                {editingStore ? 'Editar Loja' : 'Adicionar Nova Loja'}
              </h2>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Nome da Loja"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
                <Input
                  label="Endereço"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Latitude"
                    type="number"
                    step="any"
                    value={formData.latitude}
                    onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                    required
                  />
                  <Input
                    label="Longitude"
                    type="number"
                    step="any"
                    value={formData.longitude}
                    onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                    required
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    onClick={handleCloseModal}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    isLoading={createMutation.isPending || updateMutation.isPending}
                    className="flex-1"
                  >
                    {editingStore ? 'Salvar Alterações' : 'Adicionar Loja'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

