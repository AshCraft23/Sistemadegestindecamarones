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
import { Lote, Venta } from '../App';
import { KPICard } from './KPICard';
import { useState, useMemo } from 'react';

interface DashboardAnualProps {
  lotes: Lote[];
  ventas: Venta[];
}

export function DashboardAnual({ lotes, ventas }: DashboardAnualProps) {
  // Obtener lista de años disponibles de las ventas
  const añosDisponibles = useMemo(() => {
    const años = new Set<number>();
    ventas.forEach(v => {
      const año = new Date(v.fecha).getFullYear();
      años.add(año);
    });
    // Agregar año actual si no está en la lista
    años.add(new Date().getFullYear());
    return Array.from(años).sort((a, b) => b - a); // Ordenar descendente
  }, [ventas]);

  const [añoSeleccionado, setAñoSeleccionado] = useState(añosDisponibles[0] || new Date().getFullYear());
  
  const ventasDelAño = ventas.filter(v => {
    const añoVenta = new Date(v.fecha).getFullYear();
    return añoVenta === añoSeleccionado;
  });

  const ingresosTotal = ventasDelAño.reduce((sum, v) => sum + (v.libras * v.precioLibra), 0);
  const costosTotal = lotes.reduce((sum, l) => sum + l.costoProduccion, 0);
  const gananciaTotal = ingresosTotal - costosTotal;
  const margenGanancia = costosTotal > 0 ? (gananciaTotal / costosTotal) * 100 : 0;

  // Datos por mes
  const ventasPorMes = Array.from({ length: 12 }, (_, i) => {
    const mes = i + 1;
    const ventasMes = ventasDelAño.filter(v => {
      const mesVenta = new Date(v.fecha).getMonth() + 1;
      return mesVenta === mes;
    });
    
    const librasVendidas = ventasMes.reduce((sum, v) => sum + v.libras, 0);
    const ingresos = ventasMes.reduce((sum, v) => sum + (v.libras * v.precioLibra), 0);
    
    return {
      mes: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'][i],
      libras: librasVendidas,
      ingresos: ingresos
    };
  });

  // Estadísticas por lote
  const lotesConGanancias = lotes.map(lote => ({
    nombre: lote.nombre,
    ingresos: lote.ingresosTotales,
    costos: lote.costoProduccion,
    ganancia: lote.ingresosTotales - lote.costoProduccion
  })).sort((a, b) => b.ganancia - a.ganancia).slice(0, 10);

  return (
    <div className="space-y-6">
      <Card className="border-2 border-cyan-200 bg-gradient-to-r from-cyan-50 to-teal-50">
        <CardHeader>
          <CardTitle className="text-cyan-900">Dashboard Anual {añoSeleccionado}</CardTitle>
          <p className="text-sm text-gray-600">Resumen financiero y métricas de rendimiento</p>
        </CardHeader>
      </Card>

      {/* Selector de año */}
      <Card>
        <CardHeader>
          <CardTitle>Seleccionar Año</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={añoSeleccionado.toString()} onValueChange={(val) => setAñoSeleccionado(parseInt(val))}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecciona un año" />
            </SelectTrigger>
            <SelectContent>
              {añosDisponibles.map(año => (
                <SelectItem key={año} value={año.toString()}>
                  {año}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* KPIs Anuales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Ingresos Totales"
          value={`$${ingresosTotal.toLocaleString('es-ES', { minimumFractionDigits: 2 })}`}
          icon={<DollarSign className="size-5" />}
          bgColor="from-green-500 to-emerald-500"
        />
        
        <KPICard
          title="Costos de Producción"
          value={`$${costosTotal.toLocaleString('es-ES', { minimumFractionDigits: 2 })}`}
          icon={<Package className="size-5" />}
          bgColor="from-red-500 to-orange-500"
        />
        
        <KPICard
          title="Ganancia Neta"
          value={`$${gananciaTotal.toLocaleString('es-ES', { minimumFractionDigits: 2 })}`}
          icon={<TrendingUp className="size-5" />}
          trend={gananciaTotal > 0 ? 'up' : 'down'}
          bgColor="from-emerald-500 to-green-500"
        />
        
        <KPICard
          title="Margen de Ganancia"
          value={`${margenGanancia.toFixed(1)}%`}
          icon={<BarChart3 className="size-5" />}
          trend={margenGanancia > 20 ? 'up' : margenGanancia < 0 ? 'down' : 'neutral'}
          bgColor="from-blue-500 to-indigo-500"
        />
      </div>

      {/* Gráfica de ingresos por mes */}
      <Card>
        <CardHeader>
          <CardTitle>Ingresos Mensuales {añoSeleccionado}</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={ventasPorMes}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip 
                formatter={(value: number) => `$${value.toLocaleString('es-ES', { minimumFractionDigits: 2 })}`}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="ingresos" 
                stroke="#0891b2" 
                strokeWidth={2}
                name="Ingresos" 
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Gráfica de libras vendidas por mes */}
      <Card>
        <CardHeader>
          <CardTitle>Libras Vendidas por Mes</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={ventasPorMes}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip 
                formatter={(value: number) => `${value.toLocaleString('es-ES')} lb`}
              />
              <Bar dataKey="libras" fill="#0891b2" name="Libras" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Ranking de lotes más rentables */}
      <Card>
        <CardHeader>
          <CardTitle>Top 10 Lotes Más Rentables</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={lotesConGanancias} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="nombre" type="category" width={150} />
              <Tooltip 
                formatter={(value: number) => `$${value.toLocaleString('es-ES')}`}
              />
              <Legend />
              <Bar dataKey="ganancia" fill="#10b981" name="Ganancia" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Resumen por estado de lotes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total de Lotes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-cyan-900">{lotes.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Lotes Activos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-cyan-900">
              {lotes.filter(l => l.estado !== 'Descarte' && l.estado !== 'Reposo').length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Libras Vendidas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-cyan-900">
              {ventasDelAño.reduce((sum, v) => sum + v.libras, 0).toLocaleString('es-ES', { minimumFractionDigits: 2 })} lb
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}