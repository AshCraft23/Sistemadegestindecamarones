import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";

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

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import { useState } from "react";

import { Lote, Venta, Cosecha, UserRole } from "../App";
import { KPICard } from "./KPICard";
import { TransactionTable } from "./TransactionTable";

interface DashboardProps {
  lote: Lote;
  ventas: Venta[];
  cosechas: Cosecha[];
  userRole: UserRole;
  onUpdateEstado: (
    loteId: string,
    nuevoEstado: Lote["estado"]
  ) => void;
  onUpdateFechaPesca?: (loteId: string, nuevaFecha: string) => void;
}

const COLORS = ["#0891b2", "#14b8a6"];

const estadoColors = {
  Crianza: "bg-blue-100 text-blue-800",
  "Listo para Pescar": "bg-green-100 text-green-800",
  "En Venta": "bg-cyan-100 text-cyan-800",
  Reposo: "bg-yellow-100 text-yellow-800",
  Descarte: "bg-red-100 text-red-800",
};

export function Dashboard({
  lote,
  ventas,
  cosechas,
  userRole,
  onUpdateEstado,
  onUpdateFechaPesca,
}: DashboardProps) {
  // Fechas (renombradas a snake_case)
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

  const handleCancelarFecha = () => {
    setNuevaFechaPesca(lote.fecha_estimada_pesca);
    setEditandoFecha(false);
  };

  // KPIs recalculados con VISTA
  const gananciaBruta = lote.ingresos_totales - lote.costo_produccion;

  const porcentajeVendido =
    lote.libras_cosechadas > 0
      ? (lote.libras_vendidas / lote.libras_cosechadas) * 100
      : 0;

  const margenGanancia =
    lote.costo_produccion > 0
      ? (gananciaBruta / lote.costo_produccion) * 100
      : 0;

  // Gráfica Ventas por proveedor
  const ventasPorProveedor = ventas.reduce((acc, v) => {
    const found = acc.find((x) => x.proveedor === v.proveedor);
    if (found) {
      found.libras += v.libras;
      found.ingresos += v.libras * v.precioLibra;
    } else {
      acc.push({
        proveedor: v.proveedor,
        libras: v.libras,
        ingresos: v.libras * v.precioLibra,
      });
    }
    return acc;
  }, [] as Array<{ proveedor: string; libras: number; ingresos: number }>);

  // Distribución inventario
  const inventarioData = [
    { name: "Vendido", value: lote.libras_vendidas },
    { name: "Disponible", value: lote.libras_en_inventario },
  ];

  const fechaInicio = new Date(lote.fecha_inicio);
  const hoy = new Date();
  const diasEnCiclo = Math.floor(
    (hoy.getTime() - fechaInicio.getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <Card className="border-2 border-cyan-200 bg-gradient-to-r from-cyan-50 to-teal-50">
        <CardHeader>
          <div className="flex justify-between">
            {/* Info principal */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <CardTitle>{lote.nombre}</CardTitle>
                <Badge className={estadoColors[lote.estado]}>
                  {lote.estado}
                </Badge>
              </div>

              <div className="flex flex-wrap gap-6 text-sm text-gray-700">
                <div className="flex items-center gap-2">
                  <Calendar className="size-4" />
                  Inicio:{" "}
                  {new Date(lote.fecha_inicio).toLocaleDateString("es-ES")}
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="size-4 text-cyan-600" />
                  Estimada pesca:
                  {editandoFecha ? (
                    <div className="flex items-center gap-2 ml-2">
                      <Input
                        type="date"
                        className="h-7 w-36"
                        value={nuevaFechaPesca}
                        onChange={(e) =>
                          setNuevaFechaPesca(e.target.value)
                        }
                      />
                      <Button
                        className="bg-green-600"
                        size="sm"
                        onClick={handleGuardarFecha}
                      >
                        <Check className="size-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCancelarFecha}
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
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditandoFecha(true)}
                        >
                          <Edit2 className="size-3" />
                        </Button>
                      )}
                    </>
                  )}
                </div>

                <div>Días en ciclo: {diasEnCiclo}</div>
              </div>
            </div>

            {/* Acciones */}
            {userRole === "Propietario" && (
              <div className="flex flex-col gap-2">
                {lote.estado === "Crianza" && (
                  <Button
                    size="sm"
                    className="bg-green-600"
                    onClick={() =>
                      onUpdateEstado(lote.id, "Listo para Pescar")
                    }
                  >
                    Marcar listo
                  </Button>
                )}

                {lote.estado === "En Venta" &&
                  lote.libras_en_inventario <= 0 && (
                    <Button
                      size="sm"
                      className="bg-yellow-600"
                      onClick={() => onUpdateEstado(lote.id, "Reposo")}
                    >
                      Poner en reposo
                    </Button>
                  )}

                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => onUpdateEstado(lote.id, "Descarte")}
                >
                  Descartar lote
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* KPIs principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Ganancia Bruta"
          value={`$${gananciaBruta.toLocaleString("es-ES")}`}
          icon={<DollarSign />}
          trend={
            gananciaBruta > 0 ? "up" : gananciaBruta < 0 ? "down" : "neutral"
          }
          bgColor="from-green-500 to-emerald-500"
        />

        <KPICard
          title="Libras Cosechadas"
          value={`${lote.libras_cosechadas.toFixed(2)} lb`}
          icon={<Weight />}
          bgColor="from-cyan-500 to-blue-500"
        />

        <KPICard
          title="Porcentaje Vendido"
          value={`${porcentajeVendido.toFixed(1)}%`}
          icon={<Percent />}
          subtitle={`${lote.libras_en_inventario.toFixed(
            2
          )} lb disponibles`}
          bgColor="from-teal-500 to-cyan-500"
        />

        <KPICard
          title="Margen de Ganancia"
          value={`${margenGanancia.toFixed(1)}%`}
          icon={<TrendingUp />}
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
          <CardContent className="flex gap-3 text-green-800 pt-6">
            <AlertCircle />
            Este lote está listo para ser cosechado.
          </CardContent>
        </Card>
      )}

      {lote.estado === "En Venta" && lote.libras_en_inventario > 0 && (
        <Card className="border-cyan-200 bg-cyan-50">
          <CardContent className="flex gap-3 text-cyan-800 pt-6">
            <AlertCircle />
            Hay {lote.libras_en_inventario.toFixed(2)} lb disponibles
            para la venta.
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
                  <XAxis dataKey="proveedor" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="libras" fill="#0891b2" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Inventario */}
        {lote.libras_cosechadas > 0 && (
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
                    dataKey="value"
                    label
                  >
                    {inventarioData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i]} />
                    ))}
                  </Pie>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Historial */}
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
