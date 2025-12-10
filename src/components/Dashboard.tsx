// src/components/Dashboard.tsx
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend
} from 'recharts';
import { TrendingUp, DollarSign, Package, BarChart3 } from 'lucide-react';
import { KPICard } from './KPICard';
import { useState, useMemo } from 'react';
import { Lote, Venta } from '../types';

interface DashboardProps {
  lotes: Lote[];
  ventas: Venta[];
}

export default function Dashboard({ lotes, ventas }: DashboardProps) {

  // -------------------------------------------------------------
  // AÑOS DISPONIBLES
  // -------------------------------------------------------------
  const añosDisponibles = useMemo(() => {
    const años = new Set<number>();
    ventas.forEach(v => años.add(new Date(v.fecha).getFullYear()));
    años.add(new Date().getFullYear());
    return Array.from(años).sort((a, b) => b - a);
  }, [ventas]);

  const [añoSeleccionado, setAñoSeleccionado] = useState(
    añosDisponibles[0] ?? new Date().getFullYear()
  );

  // -------------------------------------------------------------
  // VENTAS DEL AÑO SELECCIONADO
  // -------------------------------------------------------------
  const ventasDelAño = useMemo(() => {
    return ventas.filter(
      v => new Date(v.fecha).getFullYear() === añoSeleccionado
    );
  }, [ventas, añoSeleccionado]);

  // -------------------------------------------------------------
  // COSTOS DEL AÑO (si Lote.fecha no existe → calcula todos)
  // -------------------------------------------------------------
  const costosTotal = useMemo(() => {
    const tieneFecha = lotes.length > 0 && "fecha" in lotes[0];
    if (tieneFecha) {
      return lotes
        .filter(l => new Date((l as any).fecha).getFullYear() === añoSeleccionado)
        .reduce((sum, l) => sum + l.costoProduccion, 0);
    }
    return lotes.reduce((sum, l) => sum + l.costoProduccion, 0);
  }, [lotes, añoSeleccionado]);

  // -------------------------------------------------------------
  // KPIs
  // -------------------------------------------------------------
  const ingresosTotal = useMemo(() => {
    return ventasDelAño.reduce(
      (sum, v) => sum + v.libras * v.precioLibra,
      0
    );
  }, [ventasDelAño]);

  const gananciaTotal = useMemo(() => ingresosTotal - costosTotal, [ingresosTotal, costosTotal]);

  const margenGanancia = useMemo(() => {
    return costosTotal > 0 ? (gananciaTotal / costosTotal) * 100 : 0;
  }, [gananciaTotal, costosTotal]);

  // -------------------------------------------------------------
  // VENTAS POR MES (ya optimizado)
  // -------------------------------------------------------------
  const ventasPorMes = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const ventasMes = ventasDelAño.filter(v =>
        new Date(v.fecha).getMonth() === i
      );
      return {
        mes: ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'][i],
        libras: ventasMes.reduce((s, v) => s + v.libras, 0),
        ingresos: ventasMes.reduce((s, v) => s + v.libras * v.precioLibra, 0)
      };
    });
  }, [ventasDelAño]);

  // -------------------------------------------------------------
  // TOP 10 LOTES (optimizado)
  // -------------------------------------------------------------
  const rankingLotes = useMemo(() => {
    return lotes
      .map(l => ({
        nombre: l.nombre,
        ingresos: l.ingresosTotales ?? 0,
        costos: l.costoProduccion,
        ganancia: (l.ingresosTotales ?? 0) - l.costoProduccion
      }))
      .sort((a, b) => b.ganancia - a.ganancia)
      .slice(0, 10);
  }, [lotes]);

  // -------------------------------------------------------------
  // UI
  // -------------------------------------------------------------
  return (
    <div className="space-y-6 p-4">

      {/* Header */}
      <Card className="border-2 border-cyan-200 bg-gradient-to-r from-cyan-50 to-teal-50">
        <CardHeader>
          <CardTitle className="text-cyan-900">Dashboard Anual {añoSeleccionado}</CardTitle>
          <p className="text-sm text-gray-600">Resumen financiero general</p>
        </CardHeader>
      </Card>

      {/* Selector Año */}
      <Card>
        <CardHeader><CardTitle>Seleccionar Año</CardTitle></CardHeader>
        <CardContent>
          <Select
            value={String(añoSeleccionado)}
            onValueChange={v => setAñoSeleccionado(parseInt(v))}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecciona un año" />
            </SelectTrigger>

            <SelectContent>
              {añosDisponibles.map(año => (
                <SelectItem key={año} value={String(año)}>
                  {año}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Ingresos Totales"
          value={`$${ingresosTotal.toLocaleString('es-ES', { minimumFractionDigits: 2 })}`}
          icon={<DollarSign className="size-5" />}
          bgColor="from-green-500 to-emerald-500"
        />

        <KPICard
          title="Costos"
          value={`$${costosTotal.toLocaleString('es-ES', { minimumFractionDigits: 2 })}`}
          icon={<Package className="size-5" />}
          bgColor="from-red-500 to-orange-500"
        />

        <KPICard
          title="Ganancia"
          value={`$${gananciaTotal.toLocaleString('es-ES', { minimumFractionDigits: 2 })}`}
          icon={<TrendingUp className="size-5" />}
          trend={gananciaTotal > 0 ? 'up' : 'down'}
          bgColor="from-emerald-500 to-green-500"
        />

        <KPICard
          title="Margen"
          value={`${margenGanancia.toFixed(1)}%`}
          icon={<BarChart3 className="size-5" />}
          trend={margenGanancia > 20 ? 'up' : margenGanancia < 0 ? 'down' : 'neutral'}
          bgColor="from-blue-500 to-indigo-500"
        />
      </div>

      {/* Gráfico ingresos */}
      <Card>
        <CardHeader><CardTitle>Ingresos Mensuales</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={ventasPorMes}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="inggresos" stroke="var(--primary)" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Gráfico libras */}
      <Card>
        <CardHeader><CardTitle>Libras Vendidas</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={ventasPorMes}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="libras" fill="var(--primary)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Lotes rentables */}
      <Card>
        <CardHeader><CardTitle>Top 10 Lotes Más Rentables</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={rankingLotes} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="nombre" type="category" width={150} />
              <Tooltip />
              <Legend />
              <Bar dataKey="ganancia" fill="var(--success)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
