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
  // snake_case corregido
  const librasCosechadas = lote.librascosechadas ?? 0;
  const librasVendidas = lote.librasvendidas ?? 0;
  const costoProduccion = lote.costo_produccion ?? 0;
  const ingresosTotales = lote.ingresostotales ?? 0;

  const librasDisponibles = librasCosechadas - librasVendidas;

  const gananciaBruta = ingresosTotales - costoProduccion;
  const porcentajeVendido =
    librasCosechadas > 0 ? (librasVendidas / librasCosechadas) * 100 : 0;
  const margenGanancia =
    costoProduccion > 0 ? (gananciaBruta / costoProduccion) * 100 : 0;

  // FECHAS snake_case
  const fechaInicio = new Date(lote.fecha_inicio);
  const fechaEstimadaPesca = new Date(lote.fecha_estimada_pesca);

  const hoy = new Date();
  const diasEnCiclo = Math.floor(
    (hoy.getTime() - fechaInicio.getTime()) / (1000 * 60 * 60 * 24)
  );

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

  const ventasPorProveedor = ventas.reduce((acc, venta) => {
    const existe = acc.find((i) => i.proveedor === venta.proveedor);
    if (existe) {
      existe.libras += venta.libras;
      existe.ingresos += venta.libras * venta.precioLibra;
    } else {
      acc.push({
        proveedor: venta.proveedor,
        libras: venta.libras,
        ingresos: venta.libras * venta.precioLibra,
      });
    }
    return acc;
  }, [] as Array<{ proveedor: string; libras: number; ingresos: number }>);

  const inventarioData = [
    { name: "Vendido", value: librasVendidas },
    { name: "Disponible", value: librasDisponibles },
  ];

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
                    Inicio: {fechaInicio.toLocaleDateString("es-ES")}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="size-4 text-cyan-600" />
                  <span>Estimada pesca:</span>

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
                        onClick={() => setEditandoFecha(false)}
                        variant="outline"
                        size="sm"
                      >
                        <X className="size-4" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <span>
                        {fechaEstimadaPesca.toLocaleDateString("es-ES")}
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

            {/* ACCIONES */}
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

      {/* KPIs */}
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
          value={`${librasCosechadas.toFixed(2)} lb`}
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

      {/* TRANSACCIONES */}
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
