import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { supervisorService } from '../services/supervisorService';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
} from 'recharts';

// Ícones SVG para os cards
const UsersIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
    />
  </svg>
);

const CalendarIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
);

const ClockIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const TrendingUpIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
    />
  </svg>
);

export default function Dashboard() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => supervisorService.getDashboard(),
  });

  const { data: promotersData } = useQuery({
    queryKey: ['promoters'],
    queryFn: () => supervisorService.getPromoters(),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-gray-600">Carregando dados...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <div className="flex items-center gap-3">
            <div className="text-red-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-red-800 font-semibold">Erro ao carregar dashboard</h3>
              <p className="text-red-600 text-sm mt-1">
                Não foi possível carregar os dados. Tente novamente.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const stats = data?.stats || {};
  const visitsByPromoterRaw = data?.visitsByPromoter || [];
  
  // Mapear visitsByPromoter com nomes dos promotores
  const visitsByPromoter = visitsByPromoterRaw.map((item: any) => {
    const promoter = promotersData?.promoters?.find((p: any) => p.id === item.promoterId);
    return {
      ...item,
      promoterName: promoter?.name || `Promotor ${item.promoterId.slice(0, 8)}`,
    };
  });

  const statCards = [
    {
      title: 'Total de Promotores',
      value: stats.totalPromoters || 0,
      icon: UsersIcon,
      color: 'from-violet-600 to-violet-700',
      bgColor: 'bg-violet-50',
      textColor: 'text-violet-700',
      iconColor: 'text-violet-600',
    },
    {
      title: 'Visitas Hoje',
      value: stats.visitsToday || 0,
      icon: CalendarIcon,
      color: 'from-amber-500 to-amber-600',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-700',
      iconColor: 'text-amber-600',
    },
    {
      title: 'Visitas Esta Semana',
      value: stats.visitsThisWeek || 0,
      icon: TrendingUpIcon,
      color: 'from-violet-500 to-violet-600',
      bgColor: 'bg-violet-50',
      textColor: 'text-violet-700',
      iconColor: 'text-violet-600',
    },
    {
      title: 'Horas Trabalhadas Hoje',
      value: `${stats.totalHoursToday || '0.00'}h`,
      icon: ClockIcon,
      color: 'from-amber-600 to-amber-700',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-700',
      iconColor: 'text-amber-600',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl ${card.bgColor} ${card.iconColor} shadow-sm`}>
                    <Icon />
                  </div>
                  <div className={`text-sm font-semibold ${card.textColor} px-2 py-1 rounded-full ${
                    index === 0 || index === 2 ? 'bg-violet-100' : 'bg-amber-100'
                  }`}>
                    {index === 0 && '+12%'}
                    {index === 1 && '+5%'}
                    {index === 2 && '+8%'}
                    {index === 3 && '+3%'}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1 font-medium">{card.title}</p>
                  <p className={`text-3xl font-bold ${card.textColor}`}>{card.value}</p>
                </div>
              </div>
              <div className={`h-1.5 bg-gradient-to-r ${card.color} shadow-sm`}></div>
            </div>
          );
        })}
      </div>

      {/* Gráficos e Estatísticas Adicionais */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Visitas por Promotor */}
        {visitsByPromoter.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Visitas por Promotor
              </h2>
              <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                Últimos 7 dias
              </span>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={visitsByPromoter}>
                <defs>
                  <linearGradient id="colorVisit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#7c3aed" stopOpacity={0.2} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis
                  dataKey="promoterName"
                  stroke="#6B7280"
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis stroke="#6B7280" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }}
                />
                <Bar
                  dataKey="visitCount"
                  fill="url(#colorVisit)"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Estatísticas Adicionais */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-violet-600 to-violet-700 rounded-xl shadow-lg p-6 text-white hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Visitas Este Mês</h3>
              <div className="p-2 bg-white/20 rounded-lg">
                <CalendarIcon />
              </div>
            </div>
            <div className="text-4xl font-bold mb-2">{stats.visitsThisMonth || 0}</div>
            <p className="text-violet-100 text-sm">+15% em relação ao mês anterior</p>
          </div>

          <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl shadow-lg p-6 text-white hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Promotores Ativos Hoje</h3>
              <div className="p-2 bg-white/20 rounded-lg">
                <UsersIcon />
              </div>
            </div>
            <div className="text-4xl font-bold mb-2">
              {stats.activePromotersToday || 0}
            </div>
            <p className="text-amber-100 text-sm">
              {stats.totalPromoters
                ? `${Math.round(((stats.activePromotersToday || 0) / stats.totalPromoters) * 100)}% dos promotores`
                : 'Nenhum promotor ativo'}
            </p>
          </div>
        </div>
      </div>

      {/* Lista de Promotores */}
      {promotersData?.promoters && promotersData.promoters.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-900">Promotores</h2>
            <p className="text-sm text-gray-500 mt-1">
              Gerencie e visualize os detalhes dos seus promotores
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Nome
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {promotersData.promoters.map((promoter: any) => (
                  <tr
                    key={promoter.id}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-600 to-amber-500 flex items-center justify-center text-white font-semibold mr-3 shadow-md">
                          {promoter.name?.charAt(0).toUpperCase() || 'P'}
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {promoter.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">{promoter.email}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-3">
                        <Link
                          to={`/promoters/${promoter.id}`}
                          className="inline-flex items-center px-3 py-1.5 bg-violet-50 text-violet-700 rounded-lg hover:bg-violet-100 transition-colors font-medium shadow-sm"
                        >
                          Ver Detalhes
                        </Link>
                        <Link
                          to={`/promoters/${promoter.id}/route`}
                          className="inline-flex items-center px-3 py-1.5 bg-amber-50 text-amber-700 rounded-lg hover:bg-amber-100 transition-colors font-medium shadow-sm"
                        >
                          Ver Rota
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
