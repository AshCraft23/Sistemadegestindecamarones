<<<<<<< HEAD
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Calendar,
  DollarSign,
  TrendingUp,
  Percent,
  Weight,
  AlertCircle,
  Edit2,
  Check,
  X,
} from "lucide-react";
import { Lote, Venta, Cosecha, UserRole } from "../App";
import { KPICard } from "./KPICard";
import { TransactionTable } from "./TransactionTable";
import { Badge } from "./ui/badge";
import { useState } from "react";
=======
import { useState } from 'react';

// UI Components
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';

// Icons
import {
  Calendar,
  DollarSign,
  TrendingUp,
  Percent,
  Weight,
  AlertCircle,
  Edit2,
  Check,
  X,
} from 'lucide-react';

// Charts
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

// Custom Components
import { KPICard } from './KPICard';
import { TransactionTable } from './TransactionTable';
>>>>>>> d78c55243f30038ad9550db2f36ae5a9c147d70c

// Types
import { Lote, Venta, Cosecha, UserRole } from '../App';

// Props del Dashboard
interface DashboardProps {
  lote: Lote;
  ventas: Venta[];
  cosechas: Cosecha[];
  userRole: UserRole;
  onUpdateEstado: (
    loteId: string,
    nuevoEstado:
<<<<<<< HEAD
      | "Crianza"
      | "Listo para Pescar"
      | "En Venta"
      | "Reposo"
      | "Descarte"
=======
      | 'Crianza'
      | 'Listo para Pescar'
      | 'En Venta'
      | 'Reposo'
      | 'Descarte'
>>>>>>> d78c55243f30038ad9550db2f36ae5a9c147d70c
  ) => void;
  onUpdateFechaPesca?: (loteId: string, nuevaFecha: string) => void;
}

<<<<<<< HEAD
const COLORS = ["#0891b2", "#14b8a6"];
=======
// Colores del gráfico Pie
const COLORS = ['#0891b2', '#14b8a6'];
>>>>>>> d78c55243f30038ad9550db2f36ae5a9c147d70c

// Colores del badge de estado
const estadoColors = {
<<<<<<< HEAD
  Crianza: "bg-blue-100 text-blue-800 border-blue-200",
  "Listo para Pescar": "bg-green-100 text-green-800 border-green-200",
  "En Venta": "bg-cyan-100 text-cyan-800 border-cyan-200",
  Reposo: "bg-yellow-100 text-yellow-800 border-yellow-200",
  Descarte: "bg-red-100 text-red-800 border-red-200",
=======
  Crianza: 'bg-blue-100 text-blue-800 border-blue-200',
  'Listo para Pescar': 'bg-green-100 text-green-800 border-green-200',
  'En Venta': 'bg-cyan-100 text-cyan-800 border-cyan-200',
  Reposo: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  Descarte: 'bg-red-100 text-red-800 border-red-200',
>>>>>>> d78c55243f30038ad9550db2f36ae5a9c147d70c
};

export function Dashboard({
  lote,
  ventas,
  cosechas,
  userRole,
  onUpdateEstado,
  onUpdateFechaPesca,
}: DashboardProps) {
<<<<<<< HEAD
  // Estado local corrección snake_case
  const [editandoFecha, setEditandoFecha] = useState(false);
  const [nuevaFechaPesca, setNuevaFechaPesca] = useState(
    lote.fecha_estimada_pesca
=======
  /* ----------------------------------------------------
   * Estados
   * ---------------------------------------------------- */
  const [editandoFecha, setEditandoFecha] = useState(false);
  const [nuevaFechaPesca, setNuevaFechaPesca] = useState(
    lote.fechaEstimadaPesca
>>>>>>> d78c55243f30038ad9550db2f36ae5a9c147d70c
  );

  /* ----------------------------------------------------
   * Acciones
   * ---------------------------------------------------- */
  const handleGuardarFecha = () => {
    if (onUpdateFechaPesca && nuevaFechaPesca) {
      onUpdateFechaPesca(lote.id, nuevaFechaPesca);
      setEditandoFecha(false);
    }
  };

  const handleCancelarEdicion = () => {
    setNuevaFechaPesca(lote.fecha_estimada_pesca);
    setEditandoFecha(false);
  };

<<<<<<< HEAD
  // ================================
  //      CÁLCULOS CON SNAKE_CASE
  // ================================
  const gananciaBruta =
    (lote.ingresos_totales ?? 0) - (lote.costo_produccion ?? 0);

  const porcentajeVendido =
    lote.libras_cosechadas > 0
      ? (lote.libras_vendidas / lote.libras_cosechadas) * 100
      : 0;

  const librasDisponibles =
    (lote.libras_cosechadas ?? 0) - (lote.libras_vendidas ?? 0);

  const margenGanancia =
    lote.costo_produccion > 0
      ? (gananciaBruta / lote.costo_produccion) * 100
      : 0;

  // ================================
  //      VENTAS POR PROVEEDOR
  // ================================
  const ventasPorProveedor = ventas.reduce((acc, venta) => {
    const existing = acc.find(
      (item) => item.proveedor === venta.proveedor
    );

    if (existing) {
      existing.libras += venta.libras;
      existing.ingresos += venta.libras * venta.precio_libra;
    } else {
      acc.push({
        proveedor: venta.proveedor,
        libras: venta.libras,
        ingresos: venta.libras * venta.precio_libra,
      });
    }
    return acc;
  }, [] as Array<{ proveedor: string; libras: number; ingresos: number }>);

  const inventarioData = [
    { name: "Vendido", value: lote.libras_vendidas },
    { name: "Disponible", value: librasDisponibles },
  ];

  // ================================
  //      DÍAS EN CICLO
  // ================================
  const fechaInicio = new Date(lote.fecha_inicio);
  const hoy = new Date();
  const diasEnCiclo = Math.floor(
    (hoy.getTime() - fechaInicio.getTime()) / (1000 * 60 * 60 * 24)
=======
  /* ----------------------------------------------------
   * CÁLCULOS
   * ---------------------------------------------------- */
  const gananciaBruta = lote.ingresosTotales - lote.costoProduccion;

  const porcentajeVendido =
    lote.librasCosechadas > 0
      ? (lote.librasVendidas / lote.librasCosechadas) * 100
      : 0;

  const librasDisponibles =
    lote.librasCosechadas - lote.librasVendidas;

  const margenGanancia =
    lote.costoProduccion > 0
      ? (gananciaBruta / lote.costoProduccion) * 100
      : 0;

  // Agrupado de ventas por proveedor
  const ventasPorProveedor = ventas.reduce(
    (acc, venta) => {
      const existing = acc.find(
        (item) => item.proveedor === venta.proveedor
      );

      if (existing) {
        existing.libras += venta.libras;
        existing.ingresos += venta.libras * venta.precioLibra;
      } else {
        acc.push({
          proveedor: venta.proveedor,
          libras: venta.libras,
          ingresos: venta.libras * venta.precioLibra,
        });
      }

      return acc;
    },
    [] as Array<{
      proveedor: string;
      libras: number;
      ingresos: number;
    }>
  );

  // Pie chart data
  const inventarioData = [
    { name: 'Vendido', value: lote.librasVendidas },
    { name: 'Disponible', value: librasDisponibles },
  ];

  // Días en ciclo
  const diasEnCiclo = Math.floor(
    (new Date().getTime() -
      new Date(lote.fechaInicio).getTime()) /
      (1000 * 60 * 60 * 24)
>>>>>>> d78c55243f30038ad9550db2f36ae5a9c147d70c
  );

  /* ----------------------------------------------------
   * RENDER
   * ---------------------------------------------------- */
  return (
    <div className="space-y-6">
<<<<<<< HEAD
      {/* HEADER */}
      <Card className="border-2 border-cyan-200 bg-gradient-to-r from-cyan-50 to-teal-50">
        <CardHeader>
          <div className="flex items-start justify-between">
            {/* Información del lote */}
=======
      {/* ------------------------------------------------------
       * HEADER DEL LOTE
       * ------------------------------------------------------ */}
      <Card className="border-2 border-cyan-200 bg-gradient-to-r from-cyan-50 to-teal-50">
        <CardHeader>
          <div className="flex items-start justify-between">
            {/* Información del Lote */}
>>>>>>> d78c55243f30038ad9550db2f36ae5a9c147d70c
            <div>
              <div className="flex items-center gap-3 mb-2">
                <CardTitle className="text-cyan-900">
                  {lote.nombre}
                </CardTitle>
<<<<<<< HEAD
=======

>>>>>>> d78c55243f30038ad9550db2f36ae5a9c147d70c
                <Badge className={estadoColors[lote.estado]}>
                  {lote.estado}
                </Badge>
              </div>

              <div className="flex items-center gap-6 text-sm text-gray-600">
<<<<<<< HEAD
                <span>ID: {lote.id}</span>

                <span>Tipo: {lote.tipo_camaron}</span>

                <span>
                  <Calendar className="inline size-4" /> Inicio:{" "}
                  {new Date(lote.fecha_inicio).toLocaleDateString("es-ES")}
                </span>

                <span>
                  <Calendar className="inline size-4 text-cyan-600" /> Estimada
                  pesca:{" "}
=======
                <div className="flex items-center gap-2">
                  <span>ID:</span>
                  <span>{lote.id}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span>Tipo:</span>
                  <span>{lote.tipoCamaron}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="size-4" />
                  <span>
                    Inicio:{' '}
                    {new Date(
                      lote.fechaInicio
                    ).toLocaleDateString('es-ES')}
                  </span>
                </div>

                {/* Fecha estimada de pesca (editable) */}
                <div className="flex items-center gap-2">
                  <Calendar className="size-4 text-cyan-600" />
                  <span>Estimada pesca:</span>

>>>>>>> d78c55243f30038ad9550db2f36ae5a9c147d70c
                  {editandoFecha ? (
                    <div className="flex items-center gap-2">
                      <Input
                        type="date"
                        value={nuevaFechaPesca}
                        onChange={(e) =>
                          setNuevaFechaPesca(e.target.value)
                        }
                        className="w-40 h-8"
                      />

                      <Button
                        onClick={handleGuardarFecha}
                        className="bg-green-600 hover:bg-green-700"
                        size="sm"
                      >
                        <Check className="size-4" />
                      </Button>

                      <Button
                        onClick={handleCancelarEdicion}
                        variant="outline"
                        size="sm"
                      >
                        <X className="size-4" />
                      </Button>
                    </div>
                  ) : (
                    <>
<<<<<<< HEAD
                      {new Date(
                        lote.fecha_estimada_pesca
                      ).toLocaleDateString("es-ES")}

                      {userRole === "Administrador" && (
=======
                      <span>
                        {new Date(
                          lote.fechaEstimadaPesca
                        ).toLocaleDateString('es-ES')}
                      </span>

                      {userRole === 'Administrador' && (
>>>>>>> d78c55243f30038ad9550db2f36ae5a9c147d70c
                        <Button
                          onClick={() => setEditandoFecha(true)}
                          variant="ghost"
                          size="sm"
                        >
                          <Edit2 className="size-3" />
                        </Button>
                      )}
                    </>
                  )}
<<<<<<< HEAD
                </span>

                <span>Días en ciclo: {diasEnCiclo}</span>
              </div>
            </div>

            {/* Acciones del propietario */}
            {userRole === "Propietario" && (
              <div className="flex gap-2">
                {lote.estado === "Crianza" && (
                  <Button
                    onClick={() =>
                      onUpdateEstado(lote.id, "Listo para Pescar")
=======
                </div>

                <div className="flex items-center gap-2">
                  <span>Días en ciclo: {diasEnCiclo}</span>
                </div>
              </div>
            </div>

            {/* Botones de control */}
            {userRole === 'Propietario' && (
              <div className="flex gap-2">
                {lote.estado === 'Crianza' && (
                  <Button
                    onClick={() =>
                      onUpdateEstado(lote.id, 'Listo para Pescar')
>>>>>>> d78c55243f30038ad9550db2f36ae5a9c147d70c
                    }
                    className="bg-green-600 hover:bg-green-700"
                    size="sm"
                  >
                    Listo para Pescar
                  </Button>
                )}

<<<<<<< HEAD
                {lote.estado === "En Venta" && librasDisponibles === 0 && (
                  <Button
                    onClick={() => onUpdateEstado(lote.id, "Reposo")}
                    className="bg-yellow-600 hover:bg-yellow-700"
                    size="sm"
                  >
                    Reposo
                  </Button>
                )}

                <Button
                  onClick={() => onUpdateEstado(lote.id, "Descarte")}
=======
                {lote.estado === 'En Venta' &&
                  librasDisponibles === 0 && (
                    <Button
                      onClick={() =>
                        onUpdateEstado(lote.id, 'Reposo')
                      }
                      className="bg-yellow-600 hover:bg-yellow-700"
                      size="sm"
                    >
                      Poner en Reposo
                    </Button>
                  )}

                <Button
                  onClick={() =>
                    onUpdateEstado(lote.id, 'Descarte')
                  }
>>>>>>> d78c55243f30038ad9550db2f36ae5a9c147d70c
                  variant="destructive"
                  size="sm"
                >
                  Descartar
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
      </Card>

<<<<<<< HEAD
      {/* KPIS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Ganancia Bruta"
          value={`$${gananciaBruta.toLocaleString("es-ES", {
            minimumFractionDigits: 2,
          })}`}
          icon={<DollarSign className="size-5" />}
=======
      {/* ------------------------------------------------------
       * KPIs
       * ------------------------------------------------------ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Ganancia Bruta"
          value={`$${gananciaBruta.toLocaleString('es-ES', {
            minimumFractionDigits: 2,
          })}`}
          icon={<DollarSign className="size-5" />}
          trend={
            gananciaBruta > 0
              ? 'up'
              : gananciaBruta < 0
              ? 'down'
              : 'neutral'
          }
          bgColor="from-emerald-500 to-green-500"
>>>>>>> d78c55243f30038ad9550db2f36ae5a9c147d70c
        />

        <KPICard
          title="Libras Cosechadas"
          value={`${lote.libras_cosechadas.toFixed(2)} lb`}
          icon={<Weight className="size-5" />}
        />

        <KPICard
          title="Porcentaje Vendido"
          value={`${porcentajeVendido.toFixed(1)}%`}
<<<<<<< HEAD
          subtitle={`${librasDisponibles.toFixed(2)} lb disponibles`}
          icon={<Percent className="size-5" />}
=======
          subtitle={`${librasDisponibles.toFixed(
            2
          )} lb disponibles`}
          icon={<Percent className="size-5" />}
          bgColor="from-teal-500 to-cyan-500"
>>>>>>> d78c55243f30038ad9550db2f36ae5a9c147d70c
        />

        <KPICard
          title="Margen de Ganancia"
          value={`${margenGanancia.toFixed(1)}%`}
          trend={
            margenGanancia > 20
              ? 'up'
              : margenGanancia < 0
              ? 'down'
              : 'neutral'
          }
          icon={<TrendingUp className="size-5" />}
<<<<<<< HEAD
        />
      </div>

      {/* ALERTAS */}
      {lote.estado === "Listo para Pescar" && (
=======
          bgColor="from-blue-500 to-indigo-500"
        />
      </div>

      {/* ------------------------------------------------------
       * ALERTAS
       * ------------------------------------------------------ */}
      {lote.estado === 'Listo para Pescar' && (
>>>>>>> d78c55243f30038ad9550db2f36ae5a9c147d70c
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 text-green-800">
              <AlertCircle className="size-5" />
              <p>
                Este lote está listo para ser cosechado.
<<<<<<< HEAD
                {userRole === "Propietario" &&
                  ' Ve a "Registrar Cosecha" para registrarla.'}
=======
                {userRole === 'Propietario' &&
                  ' Dirígete a la sección "Registrar Cosecha".'}
>>>>>>> d78c55243f30038ad9550db2f36ae5a9c147d70c
              </p>
            </div>
          </CardContent>
        </Card>
      )}

<<<<<<< HEAD
      {librasDisponibles > 0 && lote.estado === "En Venta" && (
=======
      {lote.estado === 'En Venta' && librasDisponibles > 0 && (
>>>>>>> d78c55243f30038ad9550db2f36ae5a9c147d70c
        <Card className="border-cyan-200 bg-cyan-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 text-cyan-800">
              <AlertCircle className="size-5" />

              <p>
<<<<<<< HEAD
                Hay {librasDisponibles.toFixed(2)} lb disponibles para la
                venta.
=======
                Hay {librasDisponibles.toFixed(2)} lb disponibles
                para la venta.{' '}
                {(userRole === 'Vendedor' ||
                  userRole === 'Propietario') &&
                  ' Ve a "Registrar Venta".'}
>>>>>>> d78c55243f30038ad9550db2f36ae5a9c147d70c
              </p>
            </div>
          </CardContent>
        </Card>
      )}

<<<<<<< HEAD
      {/* TABLA HISTORIAL */}
=======
      {/* ------------------------------------------------------
       * GRÁFICAS
       * ------------------------------------------------------ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ventas por proveedor */}
        {ventasPorProveedor.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Ventas por Proveedor</CardTitle>
            </CardHeader>

            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={ventasPorProveedor}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="proveedor"
                    angle={-45}
                    textAnchor="end"
                    height={100}
                  />
                  <YAxis />

                  <Tooltip
                    formatter={(value: number, name: string) => {
                      if (name === 'libras')
                        return `${value.toFixed(2)} lb`;
                      if (name === 'ingresos')
                        return `$${value.toLocaleString(
                          'es-ES'
                        )}`;
                      return value;
                    }}
                  />

                  <Bar dataKey="libras" fill="#0891b2" name="Libras" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Distribución del inventario */}
        {lote.librasCosechadas > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Distribución del Inventario</CardTitle>
            </CardHeader>

            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={inventarioData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    labelLine={false}
                    label={(entry) =>
                      `${entry.name}: ${entry.value.toFixed(2)} lb`
                    }
                    dataKey="value"
                  >
                    {inventarioData.map((entry, index) => (
                      <Cell
                        key={`cel-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v: number) =>
                      `${v.toFixed(2)} lb`
                    }
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>

      {/* ------------------------------------------------------
       * RESUMEN FINANCIERO
       * ------------------------------------------------------ */}
      {userRole === 'Propietario' && (
        <Card>
          <CardHeader>
            <CardTitle>Resumen Financiero</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">
                  Costo de Producción
                </p>
                <p className="text-red-600">
                  $
                  {lote.costoProduccion.toLocaleString(
                    'es-ES',
                    { minimumFractionDigits: 2 }
                  )}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">
                  Ingresos Totales
                </p>
                <p className="text-green-600">
                  $
                  {lote.ingresosTotales.toLocaleString(
                    'es-ES',
                    { minimumFractionDigits: 2 }
                  )}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">
                  Ganancia Neta
                </p>
                <p
                  className={
                    gananciaBruta >= 0
                      ? 'text-green-600'
                      : 'text-red-600'
                  }
                >
                  $
                  {gananciaBruta.toLocaleString('es-ES', {
                    minimumFractionDigits: 2,
                  })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ------------------------------------------------------
       * TABLA DE TRANSACCIONES
       * ------------------------------------------------------ */}
>>>>>>> d78c55243f30038ad9550db2f36ae5a9c147d70c
      <Card>
        <CardHeader>
          <CardTitle>Historial de Transacciones</CardTitle>
        </CardHeader>

        <CardContent>
<<<<<<< HEAD
          <TransactionTable ventas={ventas} cosechas={cosechas} />
=======
          <TransactionTable
            ventas={ventas}
            cosechas={cosechas}
          />
>>>>>>> d78c55243f30038ad9550db2f36ae5a9c147d70c
        </CardContent>
      </Card>
    </div>
  );
}
