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
  // Estado local corrección snake_case
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
  );

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <Card className="border-2 border-cyan-200 bg-gradient-to-r from-cyan-50 to-teal-50">
        <CardHeader>
          <div className="flex items-start justify-between">
            {/* Información del lote */}
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
                <span>ID: {lote.id}</span>

                <span>Tipo: {lote.tipo_camaron}</span>

                <span>
                  <Calendar className="inline size-4" /> Inicio:{" "}
                  {new Date(lote.fecha_inicio).toLocaleDateString("es-ES")}
                </span>

                <span>
                  <Calendar className="inline size-4 text-cyan-600" /> Estimada
                  pesca:{" "}
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
                      {new Date(
                        lote.fecha_estimada_pesca
                      ).toLocaleDateString("es-ES")}

                      {userRole === "Administrador" && (
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
                    }
                    className="bg-green-600 hover:bg-green-700"
                    size="sm"
                  >
                    Listo para Pescar
                  </Button>
                )}

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

      {/* KPIS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Ganancia Bruta"
          value={`$${gananciaBruta.toLocaleString("es-ES", {
            minimumFractionDigits: 2,
          })}`}
          icon={<DollarSign className="size-5" />}
        />

        <KPICard
          title="Libras Cosechadas"
          value={`${lote.libras_cosechadas.toFixed(2)} lb`}
          icon={<Weight className="size-5" />}
        />

        <KPICard
          title="Porcentaje Vendido"
          value={`${porcentajeVendido.toFixed(1)}%`}
          subtitle={`${librasDisponibles.toFixed(2)} lb disponibles`}
          icon={<Percent className="size-5" />}
        />

        <KPICard
          title="Margen de Ganancia"
          value={`${margenGanancia.toFixed(1)}%`}
          icon={<TrendingUp className="size-5" />}
        />
      </div>

      {/* ALERTAS */}
      {lote.estado === "Listo para Pescar" && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 text-green-800">
              <AlertCircle className="size-5" />
              <p>
                Este lote está listo para ser cosechado.
                {userRole === "Propietario" &&
                  ' Ve a "Registrar Cosecha" para registrarla.'}
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
                Hay {librasDisponibles.toFixed(2)} lb disponibles para la
                venta.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* TABLA HISTORIAL */}
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
