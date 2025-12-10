import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
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
} from "recharts";

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

interface DashboardProps {
  lote: Lote;
  ventas: Venta[];
  cosechas: Cosecha[];
  userRole: UserRole;
  onUpdateEstado: (
    loteId: string,
    nuevoEstado:
      | "Crianza"
      | "Listo para Pescar"
      | "En Venta"
      | "Reposo"
      | "Descarte"
  ) => void;
  onUpdateFechaPesca?: (loteId: string, nuevaFecha: string) => void;
}

const COLORS = ["#0891b2", "#14b8a6"];

const estadoColors = {
  Crianza: "bg-blue-100 text-blue-800 border-blue-200",
  "Listo para Pescar": "bg-green-100 text-green-800 border-green-200",
  "En Venta": "bg-cyan-100 text-cyan-800 border-cyan-200",
  Reposo: "bg-yellow-100 text-yellow-800 border-yellow-200",
  Descarte: "bg-red-100 text-red-800 border-red-200",
};

export function Dashboard({
  lote,
  ventas,
  cosechas,
  userRole,
  onUpdateEstado,
  onUpdateFechaPesca,
}: DashboardProps) {
  const [editandoFecha, setEditandoFecha] = useState(false);
  const [nuevaFechaPesca, setNuevaFechaPesca] = useState(
    lote.fecha_estimada_pesca
  );

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

  // Cálculos
  const gananciaBruta = lote.ingresos_totales - lote.costo_produccion;
  const porcentajeVendido =
    lote.libras_cosechadas > 0
      ? (lote.libras_vendidas / lote.libras_cosechadas) * 100
      : 0;

  const librasDisponibles =
    lote.libras_cosechadas - lote.libras_vendidas;

  const margenGanancia =
    lote.costo_produccion > 0
      ? (gananciaBruta / lote.costo_produccion) * 100
      : 0;

  // Ventas por proveedor
  const ventasPorProveedor = ventas.reduce((acc, venta) => {
    const existing = acc.find((item) => item.proveedor === venta.proveedor);
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

  // Pie de inventario
  const inventarioData = [
    { name: "Vendido", value: lote.libras_vendidas },
    { name: "Disponible", value: librasDisponibles },
  ];

  // Días en ciclo
  const fechaInicio = new Date(lote.fecha_inicio);
  const hoy = new Date();
  const diasEnCiclo = Math.floor(
    (hoy.getTime() - fechaInicio.getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <Card className="border-2 border-cyan-200 bg-gradient-to-r from-cyan-50 to-teal-50">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <CardTitle className="text-cyan-900">
                  {lote.nombre}
                </CardTitle>
                <Badge className={estadoColors[lote.estado]}>
                  {lote.estado}
                </Badge>
              </div>

              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <span>ID:</span>
                  <span>{lote.id}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span>Tipo:</span>
                  <span>{lote.tipo_camaron}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="size-4" />
                  <span>
                    Inicio:{" "}
                    {new Date(lote.fecha_inicio).toLocaleDateString("es-ES")}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="size-4 text-cyan-600" />
                  <span>Estimada pesca: </span>

                  {editandoFecha ? (
                    <div className="flex items-center gap-2">
                      <Input
                        type="date"
                        value={nuevaFechaPesca}
                        onChange={(e) => setNuevaFechaPesca(e.target.value)}
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
                      <span>
                        {new Date(
                          lote.fecha_estimada_pesca
                        ).toLocaleDateString("es-ES")}
                      </span>

                      {userRole === "Administrador" && (
                        <Button
                          onClick={() => setEditandoFecha(true)}
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2"
                        >
                          <Edit2 className="size-3" />
                        </Button>
                      )}
                    </>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span>Días en ciclo: {diasEnCiclo}</span>
                </div>
              </div>
            </div>

            {/* Controles propietarios */}
            {userRole === "Propietario" && (
              <div className="flex gap-2">
                {lote.estado === "Crianza" && (
                  <Button
                    onClick={() =>
                      onUpdateEstado(lote.id, "Listo para Pescar")
                    }
                    className="bg-green-600 hover:bg-green-700"
                    size="sm"
                  >
                    Marcar Listo para Pescar
                  </Button>
                )}

                {lote.estado === "En Venta" && librasDisponibles === 0 && (
                  <Button
                    onClick={() => onUpdateEstado(lote.id, "Reposo")}
                    className="bg-yellow-600 hover:bg-yellow-700"
                    size="sm"
                  >
                    Poner en Reposo
                  </Button>
                )}

                <Button
                  onClick={() => onUpdateEstado(lote.id, "Descarte")}
                  variant="destructive"
                  size="sm"
                >
                  Descartar Lote
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* KPIS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Ganancia Bruta"
          value={`$${gananciaBruta.toLocaleString("es-ES", {
            minimumFractionDigits: 2,
          })}`}
          icon={<DollarSign className="size-5" />}
          trend={
            gananciaBruta > 0
              ? "up"
              : gananciaBruta < 0
              ? "down"
              : "neutral"
          }
          bgColor="from-emerald-500 to-green-500"
        />

        <KPICard
          title="Libras Cosechadas"
          value={`${lote.libras_cosechadas.toFixed(2)} lb`}
          icon={<Weight className="size-5" />}
          bgColor="from-cyan-500 to-blue-500"
        />

        <KPICard
          title="Porcentaje Vendido"
          value={`${porcentajeVendido.toFixed(1)}%`}
          icon={<Percent className="size-5" />}
          subtitle={`${librasDisponibles.toFixed(2)} lb disponibles`}
          bgColor="from-teal-500 to-cyan-500"
        />

        <KPICard
          title="Margen de Ganancia"
          value={`${margenGanancia.toFixed(1)}%`}
          icon={<TrendingUp className="size-5" />}
          trend={
            margenGanancia > 20
              ? "up"
              : margenGanancia < 0
              ? "down"
              : "neutral"
          }
          bgColor="from-blue-500 to-indigo-500"
        />
      </div>

      {/* Alertas */}
      {lote.estado === "Listo para Pescar" && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 text-green-800">
              <AlertCircle className="size-5" />
              <p>
                Este lote está listo para ser cosechado.
                {userRole === "Propietario" &&
                  ' Dirígete a "Registrar Cosecha".'}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {librasDisponibles > 0 && lote.estado === "En Venta" && (
        <Card className="border-cyan-200 bg-cyan-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 text-cyan-800">
              <AlertCircle className="size-5" />
              <p>
                Hay {librasDisponibles.toFixed(2)} lb disponibles para venta.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Gráficas */}
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
                      if (name === "libras") return `${value.toFixed(2)} lb`;
                      if (name === "ingresos")
                        return `$${value.toLocaleString("es-ES")}`;
                      return value;
                    }}
                  />

                  <Bar dataKey="libras" fill="#0891b2" name="Libras" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Inventario */}
        {lote.libras_cosechadas > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Distribución de Inventario</CardTitle>
            </CardHeader>

            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={inventarioData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(e) => `${e.name}: ${e.value.toFixed(2)} lb`}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {inventarioData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>

                  <Tooltip
                    formatter={(value: number) =>
                      `${value.toFixed(2)} lb`
                    }
                  />

                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Resumen financiero */}
      {userRole === "Propietario" && (
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
                  {lote.costo_produccion.toLocaleString("es-ES", {
                    minimumFractionDigits: 2,
                  })}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">
                  Ingresos Totales
                </p>
                <p className="text-green-600">
                  $
                  {lote.ingresos_totales.toLocaleString("es-ES", {
                    minimumFractionDigits: 2,
                  })}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">
                  Ganancia Neta
                </p>
                <p
                  className={
                    gananciaBruta >= 0
                      ? "text-green-600"
                      : "text-red-600"
                  }
                >
                  $
                  {gananciaBruta.toLocaleString("es-ES", {
                    minimumFractionDigits: 2,
                  })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Transacciones */}
      <Card>
        <CardHeader>
          <CardTitle>Historial de Transacciones</CardTitle>
        </CardHeader>

        <CardContent>
          <TransactionTable ventas={ventas} cosechas={cosechas} />
        </CardContent>
      </Card>
    </div>
  );
}
