import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supervisorService } from '../services/supervisorService';
import Card, { CardHeader, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';

interface Store {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
}

interface Promoter {
  id: string;
  name: string;
  email: string;
}

export default function RouteConfig() {
  const queryClient = useQueryClient();
  const [selectedPromoter, setSelectedPromoter] = useState<string>('');
  const [selectedStores, setSelectedStores] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Buscar promotores
  const { data: promotersData } = useQuery({
    queryKey: ['promoters'],
    queryFn: () => supervisorService.getPromoters(),
  });

  // Buscar lojas disponíveis
  const { data: storesData, isLoading: loadingStores } = useQuery({
    queryKey: ['available-stores'],
    queryFn: () => supervisorService.getAvailableStores(),
  });

  // Buscar rota atual do promotor selecionado
  const { data: currentRoute, isLoading: loadingRoute } = useQuery({
    queryKey: ['promoter-route', selectedPromoter],
    queryFn: () => supervisorService.getPromoterRouteAssignment(selectedPromoter),
    enabled: !!selectedPromoter,
  });

  // Mutation para salvar rota
  const saveRouteMutation = useMutation({
    mutationFn: (data: { storeIds: string[]; orders?: number[] }) =>
      supervisorService.setPromoterRoute(selectedPromoter, data.storeIds, data.orders),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promoter-route', selectedPromoter] });
      queryClient.invalidateQueries({ queryKey: ['promoters'] });
      queryClient.invalidateQueries({ queryKey: ['available-stores'] });
      alert('Rota configurada com sucesso!');
    },
    onError: (error: any) => {
      console.error('Erro ao configurar rota:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Erro ao configurar rota';
      alert(`Erro: ${errorMessage}`);
    },
  });

  // Carregar rota atual quando promotor é selecionado
  useEffect(() => {
    if (currentRoute?.route) {
      setSelectedStores(currentRoute.route.map((r: any) => r.store.id));
    } else {
      setSelectedStores([]);
    }
  }, [currentRoute]);

  const promoters = promotersData?.promoters || [];
  const stores = storesData?.stores || [];

  // Filtrar lojas por busca
  const filteredStores = stores.filter(
    (store: Store) =>
      store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  function handleStoreToggle(storeId: string) {
    setSelectedStores((prev) =>
      prev.includes(storeId) ? prev.filter((id) => id !== storeId) : [...prev, storeId]
    );
  }

  function handleSaveRoute() {
    if (!selectedPromoter) {
      alert('Selecione um promotor');
      return;
    }

    if (selectedStores.length === 0) {
      alert('Selecione pelo menos uma loja');
      return;
    }

    // Criar array de ordens baseado na ordem de seleção
    const orders = selectedStores.map((_, index) => index);

    saveRouteMutation.mutate({
      storeIds: selectedStores,
      orders,
    });
  }

  function handleClearRoute() {
    setSelectedStores([]);
  }

  const selectedPromoterData = promoters.find((p: Promoter) => p.id === selectedPromoter);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">
          Configurar Rotas
        </h1>
        <p className="text-text-secondary mt-2">
          Defina quais lojas cada promotor deve visitar. O número de lojas é a seu critério.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Painel de Seleção */}
        <div className="lg:col-span-2 space-y-6">
          {/* Seleção de Promotor */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-text-primary">Selecionar Promotor</h2>
            </CardHeader>
            <CardContent>
              <select
                value={selectedPromoter}
                onChange={(e) => setSelectedPromoter(e.target.value)}
                className="w-full px-4 py-2.5 border border-dark-border bg-dark-cardElevated text-text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-600 focus:glow-primary transition-all"
              >
                <option value="">Selecione um promotor</option>
                {promoters.map((promoter: Promoter) => (
                  <option key={promoter.id} value={promoter.id}>
                    {promoter.name} ({promoter.email})
                  </option>
                ))}
              </select>

              {selectedPromoterData && (
                <div className="mt-4 p-4 bg-primary-600/20 rounded-lg border border-primary-600/50">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-600 to-accent-500 flex items-center justify-center text-text-primary font-semibold shadow-primary">
                      {selectedPromoterData.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-text-primary">{selectedPromoterData.name}</p>
                      <p className="text-sm text-text-secondary">{selectedPromoterData.email}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Seleção de Lojas */}
          {selectedPromoter && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-text-primary">Selecionar Lojas</h2>
                  {selectedStores.length > 0 && (
                    <Badge variant="primary" size="lg">
                      {selectedStores.length} loja{selectedStores.length !== 1 ? 's' : ''} selecionada{selectedStores.length !== 1 ? 's' : ''}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {/* Busca */}
                <Input
                  placeholder="Buscar lojas por nome ou endereço..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  leftIcon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  }
                  className="mb-4"
                />

                {/* Lista de Lojas */}
                {loadingStores ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {filteredStores.length === 0 ? (
                      <div className="text-center py-8 text-text-tertiary">
                        {searchTerm ? 'Nenhuma loja encontrada' : 'Nenhuma loja disponível'}
                      </div>
                    ) : (
                      filteredStores.map((store: Store) => {
                        const isSelected = selectedStores.includes(store.id);
                        const order = selectedStores.indexOf(store.id) + 1;

                        return (
                          <div
                            key={store.id}
                            onClick={() => handleStoreToggle(store.id)}
                            className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                              isSelected
                                ? 'border-primary-600 bg-primary-600/20 shadow-primary'
                                : 'border-dark-border hover:border-primary-600 hover:bg-dark-card'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3 flex-1">
                                <div
                                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                                    isSelected
                                      ? 'border-primary-600 bg-primary-600'
                                      : 'border-dark-border'
                                  }`}
                                >
                                  {isSelected && (
                                    <svg
                                      className="w-4 h-4 text-white"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={3}
                                        d="M5 13l4 4L19 7"
                                      />
                                    </svg>
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <p className="font-semibold text-text-primary">{store.name}</p>
                                    {isSelected && (
                                      <Badge variant="accent" size="sm">
                                        #{order}
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-sm text-text-secondary truncate">{store.address}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Painel de Resumo e Ações */}
        <div className="space-y-6">
          {/* Resumo */}
          {selectedPromoter && (
            <Card gradient="primary">
              <CardHeader>
                <h2 className="text-xl font-semibold text-text-primary">Resumo da Rota</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-text-secondary mb-1">Promotor</p>
                    <p className="font-semibold text-text-primary">{selectedPromoterData?.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-text-secondary mb-1">Total de Lojas</p>
                    <p className="text-3xl font-bold text-primary-400">{selectedStores.length}</p>
                  </div>
                  {currentRoute?.route && currentRoute.route.length > 0 && (
                    <div className="pt-4 border-t border-dark-200">
                      <p className="text-sm text-text-secondary mb-2">Rota Atual</p>
                      <p className="text-sm font-medium text-text-primary">
                        {currentRoute.route.length} loja{currentRoute.route.length !== 1 ? 's' : ''} configurada{currentRoute.route.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Ações */}
          {selectedPromoter && (
            <Card>
              <CardContent>
                <div className="space-y-3">
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handleSaveRoute}
                    isLoading={saveRouteMutation.isPending}
                    disabled={selectedStores.length === 0}
                    className="w-full"
                  >
                    Salvar Rota
                  </Button>
                  <Button
                    variant="outline"
                    size="md"
                    onClick={handleClearRoute}
                    disabled={selectedStores.length === 0}
                    className="w-full"
                  >
                    Limpar Seleção
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Dica */}
          <Card gradient="accent">
            <CardContent>
              <div className="flex items-start gap-3">
                <div className="text-amber-600 flex-shrink-0 mt-0.5">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-text-primary mb-1">Dica</p>
                  <p className="text-sm text-text-secondary">
                    O promotor só verá as lojas que você configurar aqui. Você pode definir quantas
                    lojas quiser para cada promotor.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

