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

export function Dashboard({
  lote,
  ventas,
  cosechas,
  userRole,
  onUpdateEstado,
  onUpdateFechaPesca
}) {

  if (!lote) return <div>Cargando lote…</div>;

  // =====================
  // NORMALIZACIÓN SEGURA
  // =====================

  const fix = (v: any) =>
    typeof v === "number" && !isNaN(v) && v >= 0 ? v : 0;

  const librasCosechadas = fix(lote.librascosechadas ?? lote.libras_cosechadas);
  const librasVendidas = fix(lote.librasvendidas ?? lote.libras_vendidas);
  const costoProduccion = fix(lote.costo_produccion);
  const ingresosTotales = fix(lote.ingresostotales ?? lote.ingresos_totales);

  const librasDisponibles = fix(librasCosechadas - librasVendidas);

  const ventasLista = Array.isArray(ventas)
    ? ventas.filter(v => v && v.libras !== undefined)
    : [];

  // =====================
  // VENTAS POR PROVEEDOR
  // =====================

  const ventasPorProveedor = ventasLista.reduce((acc, v) => {
    const libras = fix(v.libras);
    const precio = fix(v.precioLibra);

    const existente = acc.find(a => a.proveedor === v.proveedor);
    if (existente) {
      existente.libras += libras;
      existente.ingresos += libras * precio;
    } else {
      acc.push({
        proveedor: v.proveedor ?? "N/D",
        libras,
        ingresos: libras * precio
      });
    }
    return acc;
  }, []);

  // =====================
  // INVENTARIO (ANTI-CRASH)
  // =====================

  const inventarioData = [
    { name: "Vendido", value: fix(librasVendidas) },
    { name: "Disponible", value: fix(librasDisponibles) }
  ];

  const inventarioSeguro =
    Array.isArray(inventarioData) &&
    inventarioData.every(i => typeof i.value === "number");

  const fechaInicio = new Date(lote.fecha_inicio);
  const diasEnCiclo = Math.floor(
    (Date.now() - fechaInicio.getTime()) / 86400000
  );

  const [editandoFecha, setEditandoFecha] = useState(false);
  const [nuevaFecha, setNuevaFecha] = useState(lote.fecha_estimada_pesca);

  return (
    <div className="space-y-6">

      {/* Header */}
      <Card className="border-2 border-cyan-200 bg-gradient-to-r from-cyan-50 to-teal-50">
        <CardHeader>
          <div className="flex justify-between">
            <div>
              <div className="flex items-center gap-3">
                <CardTitle>{lote.nombre}</CardTitle>
                <Badge>{lote.estado}</Badge>
              </div>

              <div className="flex gap-4 text-sm text-gray-600 mt-2">
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
                          variant="ghost"
                          size="sm"
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
          </div>
        </CardHeader>
      </Card>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Ganancia Bruta"
          value={`$${(ingresosTotales - costoProduccion).toFixed(2)}`}
          icon={<DollarSign />}
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
          value={
            librasCosechadas > 0
              ? `${((librasVendidas / librasCosechadas) * 100).toFixed(1)}%`
              : "0%"
          }
          icon={<Percent />}
          subtitle={`${librasDisponibles.toFixed(2)} lb disponibles`}
          bgColor="from-teal-500 to-cyan-500"
        />

        <KPICard
          title="Margen de Ganancia"
          value={
            costoProduccion > 0
              ? `${(((ingresosTotales - costoProduccion) /
                  costoProduccion) *
                  100).toFixed(1)}%`
              : "0%"
          }
          icon={<TrendingUp />}
          bgColor="from-blue-500 to-indigo-500"
        />
      </div>

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

        {/* INVENTARIO (siempre validado) */}
        {inventarioSeguro && librasCosechadas > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Inventario</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={inventarioData}
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {inventarioData.map((_, idx) => (
                      <Cell key={idx} fill={["#0891b2", "#14b8a6"][idx]} />
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

      {/* TABLA */}
      <Card>
        <CardHeader>
          <CardTitle>Historial de Transacciones</CardTitle>
        </CardHeader>
        <CardContent>
          <TransactionTable ventas={ventasLista} cosechas={cosechas} />
        </CardContent>
      </Card>
    </div>
  );
}
