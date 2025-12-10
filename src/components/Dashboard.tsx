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
  Legend
} from "recharts";

import {
  Calendar,
  DollarSign,
  TrendingUp,
  Percent,
  Weight,
  Edit2,
  Check,
  X
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
  onUpdateEstado: (id: string, estado: Lote["estado"]) => void;
  onUpdateFechaPesca: (id: string, nueva: string) => void;
}

const COLORS = ["#0891b2", "#14b8a6"];

const estadoColors: Record<string, string> = {
  Crianza: "bg-blue-100 text-blue-800 border-blue-200",
  "Listo para Pescar": "bg-green-100 text-green-800 border-green-200",
  "En Venta": "bg-cyan-100 text-cyan-800 border-cyan-200",
  Reposo: "bg-yellow-100 text-yellow-800 border-yellow-200",
  Descarte: "bg-red-100 text-red-800 border-red-200"
};

export function Dashboard({
  lote,
  ventas,
  cosechas,
  userRole,
  onUpdateEstado,
  onUpdateFechaPesca
}: DashboardProps) {
  const [editandoFecha, setEditandoFecha] = useState(false);
  const [nuevaFecha, setNuevaFecha] = useState(lote.fecha_estimada_pesca);

  // Seguridad total contra undefined
  const ventasSeguras = Array.isArray(ventas) ? ventas : [];
  const cosechasSeguras = Array.isArray(cosechas) ? cosechas : [];

   // Normalización de lote (evita undefined en cálculos)
    const librasCosechadas = cosechasSeguras
  .filter(c => c.lote_id === lote.id)
  .reduce((sum, c) => sum + Number(c.libras || 0), 0);

    const libras_vendidas = Number(lote.libras_vendidas ?? 0);
    const costoProduccion = Number(lote.costo_produccion ?? 0);
    const ingresosTotales = Number(lote.ingresos_totales ?? 0);

    const librasDisponibles = Math.max(librasCosechadas - libras_vendidas, 0);

    const gananciaBruta = ingresosTotales - costoProduccion;
    const porcentajeVendido =
      librasCosechadas > 0 ? (libras_vendidas / librasCosechadas) * 100 : 0;
    const margenGanancia =
      costoProduccion > 0 ? (gananciaBruta / costoProduccion) * 100 : 0;


  // Agrupación segura
  const ventasPorProveedor = ventasSeguras.reduce((acc, venta) => {
    const proveedor = venta.proveedor || "N/D";
    const libras = Number(venta.libras) || 0;
    const precio = Number(venta.precioLibra) || 0;

    const existente = acc.find((x) => x.proveedor === proveedor);

    if (existente) {
      existente.libras += libras;
      existente.ingresos += libras * precio;
    } else {
      acc.push({
        proveedor,
        libras,
        ingresos: libras * precio
      });
    }

    return acc;
  }, [] as Array<{ proveedor: string; libras: number; ingresos: number }>);

  // Inventario para gráfico Pie
  const inventarioData = [
    { name: "Vendido", value: libras_vendidas },
    { name: "Disponible", value: librasDisponibles }
  ];

  // Evita el error "reading length" — si algo está undefined
  const inventarioDataSeguro = Array.isArray(inventarioData) ? inventarioData : [];

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
                <CardTitle className="text-cyan-900">{lote.nombre}</CardTitle>
                <Badge className={estadoColors[lote.estado]}>
                  {lote.estado}
                </Badge>
              </div>

              <div className="flex items-center gap-6 text-sm text-gray-600">
                <span>ID: {lote.id}</span>
                <span>Tipo: {lote.tipo_camaron}</span>

                <span>
                  Inicio:{" "}
                  {new Date(lote.fecha_inicio).toLocaleDateString("es-ES")}
                </span>

                {/* Fecha estimada */}
                <div className="flex items-center gap-2">
                  <Calendar className="size-4 text-cyan-600" />

                  {editandoFecha ? (
                    <>
                      <Input
                        type="date"
                        value={nuevaFecha}
                        onChange={(e) => setNuevaFecha(e.target.value)}
                        className="w-40 h-8"
                      />
                      <Button
                        size="sm"
                        className="bg-green-600"
                        onClick={() => {
                          onUpdateFechaPesca(lote.id, nuevaFecha);
                          setEditandoFecha(false);
                        }}
                      >
                        <Check />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setNuevaFecha(lote.fecha_estimada_pesca);
                          setEditandoFecha(false);
                        }}
                      >
                        <X />
                      </Button>
                    </>
                  ) : (
                    <>
                      <span>
                        {new Date(
                          lote.fecha_estimada_pesca
                        ).toLocaleDateString("es-ES")}
                      </span>

                      {userRole === "Administrador" && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditandoFecha(true)}
                        >
                          <Edit2 />
                        </Button>
                      )}
                    </>
                  )}
                </div>

                <span>Días en ciclo: {diasEnCiclo}</span>
              </div>
            </div>

            {/* BOTONES DE ESTADO */}
            {userRole === "Propietario" && (
              <div className="flex gap-2">
                {lote.estado === "Crianza" && (
                  <Button
                    size="sm"
                    className="bg-green-600"
                    onClick={() => onUpdateEstado(lote.id, "Listo para Pescar")}
                  >
                    Marcar Listo
                  </Button>
                )}

                {lote.estado === "En Venta" && librasDisponibles === 0 && (
                  <Button
                    size="sm"
                    className="bg-yellow-600"
                    onClick={() => onUpdateEstado(lote.id, "Reposo")}
                  >
                    Reposo
                  </Button>
                )}

                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => onUpdateEstado(lote.id, "Descarte")}
                >
                  Descartar
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Ganancia Bruta"
          value={`$${gananciaBruta.toFixed(2)}`}
          icon={<DollarSign />}
          trend={gananciaBruta > 0 ? "up" : "neutral"}
          bgColor="from-green-500 to-emerald-500"
        />

        <KPICard
          title="Libras Cosechadas"
          value={`${librasCosechadas.toFixed(2)} lb`}
          icon={<Weight />}
          bgColor="from-cyan-500 to-blue-500"
        />

        <KPICard
          title="Porcentaje Vendido"
          value={`${porcentajeVendido.toFixed(1)}%`}
          icon={<Percent />}
          subtitle={`${librasDisponibles.toFixed(2)} lb disponibles`}
          bgColor="from-teal-500 to-cyan-500"
        />

        <KPICard
          title="Margen de Ganancia"
          value={`${margenGanancia.toFixed(1)}%`}
          icon={<TrendingUp />}
          trend="neutral"
          bgColor="from-blue-500 to-indigo-500"
        />
      </div>

      {/* GRÁFICAS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* BARRAS */}
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
                    height={80}
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="libras" fill="#0891b2" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* PIE — siempre seguro */}
        {inventarioDataSeguro.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Inventario</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={inventarioDataSeguro}
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    label
                    outerRadius={80}
                  >
                    {inventarioDataSeguro.map((_, idx) => (
                      <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>

      {/* HISTORIAL */}
      <Card>
        <CardHeader>
          <CardTitle>Historial de Transacciones</CardTitle>
        </CardHeader>
        <CardContent>
          <TransactionTable ventas={ventasSeguras} cosechas={cosechasSeguras} />
        </CardContent>
      </Card>
    </div>
  );
}
