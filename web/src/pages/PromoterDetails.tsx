import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supervisorService } from '../services/supervisorService';
import { format } from 'date-fns';
import Card, { CardHeader, CardContent } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const COLORS = ['#7c3aed', '#f59e0b', '#8b5cf6', '#d97706', '#a78bfa'];

export default function PromoterDetails() {
  const { id } = useParams<{ id: string }>();
  const [dateRange, setDateRange] = useState({
    startDate: format(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd'),
  });

  const { data: performance, isLoading: loadingPerformance } = useQuery({
    queryKey: ['promoter-performance', id, dateRange],
    queryFn: () =>
      supervisorService.getPromoterPerformance(id!, dateRange.startDate, dateRange.endDate),
    enabled: !!id,
  });

  const { data: visits, isLoading: loadingVisits } = useQuery({
    queryKey: ['promoter-visits', id],
    queryFn: () => supervisorService.getPromoterVisits(id!),
    enabled: !!id,
  });

  const { data: routeData } = useQuery({
    queryKey: ['promoter-route', id],
    queryFn: () => supervisorService.getPromoterRouteAssignment(id!),
    enabled: !!id,
  });

  if (loadingPerformance || loadingVisits) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-gray-600">Carregando dados do promotor...</div>
        </div>
      </div>
    );
  }

  const promoter = performance?.promoter;
  const stats = performance?.stats || {};
  const visitsList = visits?.visits || [];
  const visitsByDay = performance?.visitsByDay || [];

  // Calcular métricas avançadas
  const completionRate =
    stats.totalVisits > 0 ? ((stats.completedVisits / stats.totalVisits) * 100).toFixed(1) : 0;
  const avgHoursPerVisit =
    stats.completedVisits > 0
      ? (parseFloat(stats.totalHours || '0') / stats.completedVisits).toFixed(2)
      : '0.00';
  const avgPhotosPerVisit =
    stats.completedVisits > 0
      ? ((stats.totalPhotos || 0) / stats.completedVisits).toFixed(1)
      : '0';

  // Dados para gráfico de pizza (visitas concluídas vs pendentes)
  const visitsPieData = [
    { name: 'Concluídas', value: stats.completedVisits || 0 },
    { name: 'Pendentes', value: (stats.totalVisits || 0) - (stats.completedVisits || 0) },
  ];

  // Dados para gráfico de barras (visitas por loja)
  const visitsByStore = visitsList.reduce((acc: any, visit: any) => {
    const storeName = visit.store?.name || 'Desconhecida';
    acc[storeName] = (acc[storeName] || 0) + 1;
    return acc;
  }, {});

  const visitsByStoreData = Object.entries(visitsByStore)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => (b.count as number) - (a.count as number))
    .slice(0, 5);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-violet-600 hover:text-violet-700 mb-4 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Voltar ao Dashboard
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-600 to-amber-500 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
              {promoter?.name?.charAt(0).toUpperCase() || 'P'}
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-amber-500 bg-clip-text text-transparent">
                {promoter?.name || 'Promotor'}
              </h1>
              <p className="text-gray-600 mt-1">{promoter?.email}</p>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <Link to={`/routes/config`}>
            <Button variant="outline" size="md">
              Configurar Rota
            </Button>
          </Link>
          <Link to={`/promoters/${id}/route`}>
            <Button variant="accent" size="md">
              Ver Mapa
            </Button>
          </Link>
        </div>
      </div>

      {/* Filtro de Data */}
      <Card>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Data Inicial
              </label>
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Data Final</label>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cards de Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card hover>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-violet-50 text-violet-600 shadow-sm">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <Badge variant="primary" size="sm">
                Total
              </Badge>
            </div>
            <p className="text-sm text-gray-600 mb-1 font-medium">Total de Visitas</p>
            <p className="text-3xl font-bold text-violet-700">{stats.totalVisits || 0}</p>
          </CardContent>
        </Card>

        <Card hover>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-green-50 text-green-600 shadow-sm">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <Badge variant="success" size="sm">
                {completionRate}%
              </Badge>
            </div>
            <p className="text-sm text-gray-600 mb-1 font-medium">Visitas Concluídas</p>
            <p className="text-3xl font-bold text-green-600">{stats.completedVisits || 0}</p>
          </CardContent>
        </Card>

        <Card hover>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-amber-50 text-amber-600 shadow-sm">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <Badge variant="accent" size="sm">
                Média: {avgHoursPerVisit}h
              </Badge>
            </div>
            <p className="text-sm text-gray-600 mb-1 font-medium">Total de Horas</p>
            <p className="text-3xl font-bold text-amber-700">{stats.totalHours || '0.00'}h</p>
          </CardContent>
        </Card>

        <Card hover>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-purple-50 text-purple-600 shadow-sm">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <Badge variant="primary" size="sm">
                Média: {avgPhotosPerVisit}
              </Badge>
            </div>
            <p className="text-sm text-gray-600 mb-1 font-medium">Total de Fotos</p>
            <p className="text-3xl font-bold text-purple-600">{stats.totalPhotos || 0}</p>
          </CardContent>
        </Card>
      </div>

      {/* Métricas Avançadas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card gradient="primary">
          <CardContent>
            <h3 className="text-lg font-semibold text-white mb-4">Taxa de Conclusão</h3>
            <div className="text-5xl font-bold text-white mb-2">{completionRate}%</div>
            <p className="text-violet-100 text-sm">
              {stats.completedVisits || 0} de {stats.totalVisits || 0} visitas concluídas
            </p>
            <div className="mt-4 w-full bg-white/20 rounded-full h-2">
              <div
                className="bg-white rounded-full h-2 transition-all duration-500"
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card gradient="accent">
          <CardContent>
            <h3 className="text-lg font-semibold text-white mb-4">Média por Visita</h3>
            <div className="space-y-3">
              <div>
                <p className="text-amber-100 text-sm mb-1">Horas</p>
                <p className="text-3xl font-bold text-white">{avgHoursPerVisit}h</p>
              </div>
              <div>
                <p className="text-amber-100 text-sm mb-1">Fotos</p>
                <p className="text-3xl font-bold text-white">{avgPhotosPerVisit}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Rota Configurada</h3>
            {routeData?.route && routeData.route.length > 0 ? (
              <div>
                <div className="text-4xl font-bold text-violet-600 mb-2">
                  {routeData.route.length}
                </div>
                <p className="text-gray-600 text-sm">lojas atribuídas</p>
                <Link
                  to="/routes/config"
                  className="mt-4 inline-block text-violet-600 hover:text-violet-700 text-sm font-medium"
                >
                  Gerenciar rota →
                </Link>
              </div>
            ) : (
              <div>
                <p className="text-gray-500 text-sm mb-3">Nenhuma rota configurada</p>
                <Link to="/routes/config">
                  <Button variant="primary" size="sm">
                    Configurar Agora
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Visitas por Dia */}
        {visitsByDay.length > 0 && (
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-gray-900">Visitas por Dia</h2>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={visitsByDay}>
                  <defs>
                    <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#7c3aed" stopOpacity={0.2} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="date" stroke="#6B7280" fontSize={12} />
                  <YAxis stroke="#6B7280" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#7c3aed"
                    strokeWidth={3}
                    fill="url(#colorVisits)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Gráfico de Pizza - Visitas Concluídas vs Pendentes */}
        {visitsPieData.some((d) => d.value > 0) && (
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-gray-900">Status das Visitas</h2>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={visitsPieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {visitsPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Top 5 Lojas Mais Visitadas */}
      {visitsByStoreData.length > 0 && (
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900">Top 5 Lojas Mais Visitadas</h2>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={visitsByStoreData}>
                <defs>
                  <linearGradient id="colorStores" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.2} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="name" stroke="#6B7280" fontSize={12} />
                <YAxis stroke="#6B7280" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="count" fill="url(#colorStores)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Histórico de Visitas */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-900">Histórico de Visitas</h2>
          <p className="text-sm text-gray-500 mt-1">
            {visitsList.length} visita{visitsList.length !== 1 ? 's' : ''} encontrada
            {visitsList.length !== 1 ? 's' : ''}
          </p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Loja
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Check-in
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Checkout
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Horas
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Fotos
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {visitsList.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                      Nenhuma visita encontrada no período selecionado
                    </td>
                  </tr>
                ) : (
                  visitsList.map((visit: any) => (
                    <tr
                      key={visit.id}
                      className="hover:bg-violet-50/50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {format(new Date(visit.checkInAt), 'dd/MM/yyyy')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {visit.store?.name || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {format(new Date(visit.checkInAt), 'HH:mm')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {visit.checkOutAt ? (
                          <Badge variant="success" size="sm">
                            {format(new Date(visit.checkOutAt), 'HH:mm')}
                          </Badge>
                        ) : (
                          <Badge variant="warning" size="sm">
                            Pendente
                          </Badge>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        {visit.hoursWorked ? `${visit.hoursWorked}h` : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <Badge variant="primary" size="sm">
                          {visit.photoCount || 0}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Link
                          to={`/promoters/${id}/route?date=${format(
                            new Date(visit.checkInAt),
                            'yyyy-MM-dd'
                          )}`}
                          className="text-violet-600 hover:text-violet-700 font-medium transition-colors"
                        >
                          Ver Rota
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
