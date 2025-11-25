import React, { useState } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { supervisorService } from '../services/supervisorService';
import { format } from 'date-fns';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix para ícones do Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

export default function RouteMap() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const dateParam = searchParams.get('date');
  const [selectedDate, setSelectedDate] = useState(
    dateParam || format(new Date(), 'yyyy-MM-dd')
  );

  const { data: routeData, isLoading } = useQuery({
    queryKey: ['promoter-route', id, selectedDate],
    queryFn: () => supervisorService.getPromoterRoute(id!, selectedDate),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Carregando...</div>
      </div>
    );
  }

  const route = routeData?.route || [];
  const promoter = routeData?.promoter;

  // Construir pontos para a linha da rota
  const routePoints: [number, number][] = [];
  route.forEach((visit: any) => {
    if (visit.checkInLocation) {
      routePoints.push([visit.checkInLocation.latitude, visit.checkInLocation.longitude]);
    }
    if (visit.checkOutLocation) {
      routePoints.push([visit.checkOutLocation.latitude, visit.checkOutLocation.longitude]);
    }
  });

  // Calcular centro do mapa
  const center: [number, number] =
    route.length > 0 && route[0].checkInLocation
      ? [route[0].checkInLocation.latitude, route[0].checkInLocation.longitude]
      : [-23.5505, -46.6333]; // São Paulo como padrão

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link to="/" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
          ← Voltar ao Dashboard
        </Link>
        <h1 className="text-3xl font-bold">Rastreabilidade de Rota</h1>
        {promoter && (
          <p className="text-text-secondary mt-2">
            {promoter.name} - {format(new Date(selectedDate), 'dd/MM/yyyy')}
          </p>
        )}
      </div>

      {/* Filtro de Data */}
      <div className="bg-dark-card rounded-lg shadow p-4 mb-6">
        <label className="block text-sm font-medium text-text-700 mb-2">Data</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2"
        />
      </div>

      {/* Mapa */}
      <div className="bg-dark-card rounded-lg shadow overflow-hidden">
        <div style={{ height: '600px', width: '100%' }}>
          <MapContainer
            center={center}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {route.map((visit: any, index: number) => (
              <React.Fragment key={visit.id}>
                {visit.checkInLocation && (
                  <Marker
                    position={[visit.checkInLocation.latitude, visit.checkInLocation.longitude]}
                  >
                    <Popup>
                      <div>
                        <strong>Check-in</strong>
                        <br />
                        {visit.store?.name || 'Loja'}
                        <br />
                        {format(new Date(visit.checkInAt), 'dd/MM/yyyy HH:mm')}
                      </div>
                    </Popup>
                  </Marker>
                )}
                {visit.checkOutLocation && (
                  <Marker
                    position={[visit.checkOutLocation.latitude, visit.checkOutLocation.longitude]}
                  >
                    <Popup>
                      <div>
                        <strong>Checkout</strong>
                        <br />
                        {visit.store?.name || 'Loja'}
                        <br />
                        {visit.checkOutAt
                          ? format(new Date(visit.checkOutAt), 'dd/MM/yyyy HH:mm')
                          : '-'}
                      </div>
                    </Popup>
                  </Marker>
                )}
              </React.Fragment>
            ))}
            {routePoints.length > 1 && (
              <Polyline positions={routePoints} color="blue" weight={3} />
            )}
          </MapContainer>
        </div>
      </div>

      {/* Lista de Visitas */}
      <div className="bg-dark-card rounded-lg shadow mt-6">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold">Visitas do Dia</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-dark-backgroundSecondary">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-tertiary uppercase tracking-wider">
                  Loja
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-tertiary uppercase tracking-wider">
                  Check-in
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-tertiary uppercase tracking-wider">
                  Checkout
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-tertiary uppercase tracking-wider">
                  Tempo
                </th>
              </tr>
            </thead>
            <tbody className="bg-dark-card divide-y divide-gray-200">
              {route.map((visit: any) => {
                const hoursWorked = visit.checkOutAt
                  ? ((new Date(visit.checkOutAt).getTime() - new Date(visit.checkInAt).getTime()) /
                      (1000 * 60 * 60)).toFixed(2)
                  : null;
                return (
                  <tr key={visit.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">
                      {visit.store?.name || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-tertiary">
                      {format(new Date(visit.checkInAt), 'HH:mm')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-tertiary">
                      {visit.checkOutAt ? format(new Date(visit.checkOutAt), 'HH:mm') : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">
                      {hoursWorked ? `${hoursWorked}h` : '-'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

