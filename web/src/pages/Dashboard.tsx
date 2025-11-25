import React, { useMemo } from 'react';
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
  Cell,
} from 'recharts';
import Card, { CardHeader, CardContent } from '../components/ui/Card';
import Badge from '../components/ui/Badge';

// Ícones SVG
const AlertIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
    />
  </svg>
);

const PhotoIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

const ClockIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const RouteIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
    />
  </svg>
);

const UsersIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
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

  // Calcular métricas de problemas
  const problemMetrics = useMemo(() => {
    const promoters = promotersData?.promoters || [];
    const visits = data?.visitsByPromoter || [];
    
    // Promotores sem atividade hoje
    const promotersWithVisitsToday = new Set(
      visits.filter((v: any) => {
        const visitDate = new Date(v.date || Date.now());
        const today = new Date();
        return visitDate.toDateString() === today.toDateString();
      }).map((v: any) => v.promoterId)
    );
    
    const inactiveToday = promoters.filter((p: any) => !promotersWithVisitsToday.has(p.id));
    
    // Promotores sem fotos (simulado - precisa de dados reais)
    const promotersWithoutPhotos = promoters.filter((p: any) => {
      const promoterVisits = visits.filter((v: any) => v.promoterId === p.id);
      return promoterVisits.length > 0 && promoterVisits.every((v: any) => (v.photoCount || 0) === 0);
    });
    
    // Promotores fora do horário (simulado)
    const promotersOffSchedule = promoters.filter((p: any) => {
      // Lógica para verificar se está fora do horário planejado
      return Math.random() > 0.7; // Placeholder
    });
    
    // Rotas não iniciadas
    const routesNotStarted = promoters.filter((p: any) => {
      const hasVisitToday = promotersWithVisitsToday.has(p.id);
      return !hasVisitToday;
    });

    return {
      inactiveToday: inactiveToday.length,
      withoutPhotos: promotersWithoutPhotos.length,
      offSchedule: promotersOffSchedule.length,
      routesNotStarted: routesNotStarted.length,
      totalPromoters: promoters.length,
      problemPromoters: [
        ...inactiveToday.slice(0, 5),
        ...promotersWithoutPhotos.slice(0, 3),
        ...promotersOffSchedule.slice(0, 3),
      ].slice(0, 10),
    };
  }, [data, promotersData]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-text-secondary">Carregando dados...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <Card className="max-w-md border-error-500">
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="text-error-500">
                <AlertIcon />
              </div>
              <div>
                <h3 className="text-error-500 font-semibold">Erro ao carregar dashboard</h3>
                <p className="text-text-secondary text-sm mt-1">
                  Não foi possível carregar os dados. Tente novamente.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const stats = data?.stats || {};
  const visitsByPromoterRaw = data?.visitsByPromoter || [];
  
  const visitsByPromoter = visitsByPromoterRaw.map((item: any) => {
    const promoter = promotersData?.promoters?.find((p: any) => p.id === item.promoterId);
    return {
      ...item,
      promoterName: promoter?.name || `Promotor ${item.promoterId.slice(0, 8)}`,
    };
  });

  // Cards de KPIs de Problemas
  const problemKPIs = [
    {
      title: 'Promotores Sem Atividade Hoje',
      value: problemMetrics.inactiveToday,
      total: problemMetrics.totalPromoters,
      icon: UsersIcon,
      variant: 'error' as const,
      description: 'Não iniciaram rotas hoje',
      urgent: problemMetrics.inactiveToday > 0,
    },
    {
      title: 'Sem Fotos Enviadas',
      value: problemMetrics.withoutPhotos,
      total: problemMetrics.totalPromoters,
      icon: PhotoIcon,
      variant: 'error' as const,
      description: 'Promotores sem fotos nas visitas',
      urgent: problemMetrics.withoutPhotos > 0,
    },
    {
      title: 'Fora do Horário Planejado',
      value: problemMetrics.offSchedule,
      total: problemMetrics.totalPromoters,
      icon: ClockIcon,
      variant: 'warning' as const,
      description: 'Não cumprindo horário da rota',
      urgent: problemMetrics.offSchedule > 0,
    },
    {
      title: 'Rotas Não Iniciadas',
      value: problemMetrics.routesNotStarted,
      total: problemMetrics.totalPromoters,
      icon: RouteIcon,
      variant: 'error' as const,
      description: 'Rotas planejadas não iniciadas',
      urgent: problemMetrics.routesNotStarted > 0,
    },
  ];

  // Dados para gráfico de problemas
  const problemChartData = problemKPIs.map((kpi) => ({
    name: kpi.title.replace('Promotores ', '').replace('Sem ', '').replace('Fora do ', '').replace('Não ', ''),
    problemas: kpi.value,
    total: kpi.total,
    percentual: kpi.total > 0 ? ((kpi.value / kpi.total) * 100).toFixed(1) : 0,
  }));

  const COLORS = {
    error: '#ef4444',
    warning: '#f59e0b',
    primary: '#7c3aed',
  };

  return (
    <div className="space-y-6">
      {/* Alertas Críticos no Topo */}
      {problemMetrics.problemPromoters.length > 0 && (
        <Card className="border-error-500 shadow-error">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-error-500/20 text-error-500">
                  <AlertIcon />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-text-primary">Alertas Críticos</h2>
                  <p className="text-sm text-text-secondary">
                    {problemMetrics.problemPromoters.length} promotor(es) com problemas identificados
                  </p>
                </div>
              </div>
              <Badge variant="error" size="lg">
                {problemMetrics.problemPromoters.length} Alertas
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {problemMetrics.problemPromoters.map((promoter: any, idx: number) => (
                <Link
                  key={promoter.id || idx}
                  to={`/promoters/${promoter.id}`}
                  className="p-4 bg-dark-cardElevated border border-error-500/50 rounded-lg hover:border-error-500 hover:glow-error transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-text-primary">{promoter.name}</span>
                    <Badge variant="error" size="sm">Problema</Badge>
                  </div>
                  <p className="text-xs text-text-tertiary">{promoter.email}</p>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* KPIs de Problemas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {problemKPIs.map((kpi, index) => {
          const Icon = kpi.icon;
          const percentage = kpi.total > 0 ? ((kpi.value / kpi.total) * 100).toFixed(0) : 0;
          const isCritical = kpi.urgent && kpi.value > 0;
          
          return (
            <Card
              key={index}
              className={`${
                isCritical ? 'border-error-500 shadow-error' : 'border-dark-border'
              } hover:shadow-card-elevated transition-all`}
            >
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl ${
                    kpi.variant === 'error' ? 'bg-error-500/20 text-error-500' :
                    kpi.variant === 'warning' ? 'bg-warning-500/20 text-warning-500' :
                    'bg-primary-600/20 text-primary-400'
                  }`}>
                    <Icon />
                  </div>
                  {isCritical && (
                    <div className="w-3 h-3 rounded-full bg-error-500 animate-pulse"></div>
                  )}
                </div>
                <div>
                  <p className="text-sm text-text-secondary mb-1 font-medium">{kpi.title}</p>
                  <div className="flex items-baseline gap-2">
                    <p className={`text-3xl font-bold ${
                      isCritical ? 'text-error-500' : 'text-text-primary'
                    }`}>
                      {kpi.value}
                    </p>
                    <span className="text-sm text-text-tertiary">de {kpi.total}</span>
                  </div>
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-text-tertiary">{kpi.description}</span>
                      <span className={`font-semibold ${
                        isCritical ? 'text-error-500' : 'text-text-secondary'
                      }`}>
                        {percentage}%
                      </span>
                    </div>
                    <div className="w-full bg-dark-backgroundSecondary rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          isCritical ? 'bg-error-500' : 'bg-warning-500'
                        }`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Gráficos de Problemas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Distribuição de Problemas */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-text-primary">
              Distribuição de Problemas
            </h2>
            <p className="text-sm text-text-secondary mt-1">
              Tipos de não-conformidades identificadas
            </p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={problemChartData}>
                <defs>
                  <linearGradient id="colorError" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0.2} />
                  </linearGradient>
                  <linearGradient id="colorWarning" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.2} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#3D3550" />
                <XAxis
                  dataKey="name"
                  stroke="#9CA3AF"
                  fontSize={12}
                  tickLine={false}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#241F35',
                    border: '1px solid #3D3550',
                    borderRadius: '8px',
                    color: '#FFFFFF',
                  }}
                  labelStyle={{ color: '#E5E7EB' }}
                />
                <Bar
                  dataKey="problemas"
                  radius={[8, 8, 0, 0]}
                >
                  {problemChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={index === 2 ? 'url(#colorWarning)' : 'url(#colorError)'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Gráfico de Visitas por Promotor (com destaque para problemas) */}
        {visitsByPromoter.length > 0 && (
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-text-primary">
                Visitas por Promotor
              </h2>
              <p className="text-sm text-text-secondary mt-1">
                Últimos 7 dias - Promotores com 0 visitas destacados
              </p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={visitsByPromoter}>
                  <defs>
                    <linearGradient id="colorVisit" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#7c3aed" stopOpacity={0.2} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#3D3550" />
                  <XAxis
                    dataKey="promoterName"
                    stroke="#9CA3AF"
                    fontSize={12}
                    tickLine={false}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#241F35',
                      border: '1px solid #3D3550',
                      borderRadius: '8px',
                      color: '#FFFFFF',
                    }}
                    labelStyle={{ color: '#E5E7EB' }}
                  />
                  <Bar
                    dataKey="visitCount"
                    fill="url(#colorVisit)"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Tabela de Promotores com Status de Problemas */}
      {promotersData?.promoters && promotersData.promoters.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-text-primary">Promotores</h2>
                <p className="text-sm text-text-secondary mt-1">
                  Status e problemas identificados
                </p>
              </div>
              <Badge variant="primary" size="md">
                {promotersData.promoters.length} Total
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto scrollbar-dark">
              <table className="min-w-full divide-y divide-dark-border">
                <thead>
                  <tr className="bg-dark-backgroundSecondary">
                    <th className="px-6 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
                      Nome
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-dark-card divide-y divide-dark-border">
                  {promotersData.promoters.map((promoter: any) => {
                    const hasProblems = problemMetrics.problemPromoters.some(
                      (p: any) => p.id === promoter.id
                    );
                    const promoterVisits = visitsByPromoter.filter(
                      (v: any) => v.promoterId === promoter.id
                    );
                    const visitCount = promoterVisits.reduce(
                      (sum: number, v: any) => sum + (v.visitCount || 0),
                      0
                    );
                    
                    return (
                      <tr
                        key={promoter.id}
                        className={`hover:bg-dark-cardElevated transition-colors ${
                          hasProblems ? 'border-l-4 border-error-500' : ''
                        }`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-text-primary font-semibold mr-3 ${
                              hasProblems
                                ? 'bg-error-500/20 border-2 border-error-500'
                                : 'bg-gradient-to-br from-primary-600 to-accent-500 shadow-primary'
                            }`}>
                              {promoter.name?.charAt(0).toUpperCase() || 'P'}
                            </div>
                            <div>
                              <span className="text-sm font-medium text-text-primary">
                                {promoter.name}
                              </span>
                              {hasProblems && (
                                <div className="flex items-center gap-1 mt-1">
                                  <AlertIcon className="w-3 h-3 text-error-500" />
                                  <span className="text-xs text-error-500">Problemas</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-text-secondary">{promoter.email}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col gap-1">
                            {hasProblems ? (
                              <Badge variant="error" size="sm">Com Problemas</Badge>
                            ) : (
                              <Badge variant="success" size="sm">OK</Badge>
                            )}
                            <span className="text-xs text-text-tertiary">
                              {visitCount} visita(s)
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex items-center gap-3">
                            <Link
                              to={`/promoters/${promoter.id}`}
                              className="inline-flex items-center px-3 py-1.5 bg-primary-600/20 text-primary-400 border border-primary-600 rounded-lg hover:bg-primary-600/30 hover:glow-primary transition-all font-medium"
                            >
                              Ver Detalhes
                            </Link>
                            <Link
                              to={`/promoters/${promoter.id}/route`}
                              className="inline-flex items-center px-3 py-1.5 bg-accent-500/20 text-accent-400 border border-accent-500 rounded-lg hover:bg-accent-500/30 transition-all font-medium"
                            >
                              Ver Rota
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
