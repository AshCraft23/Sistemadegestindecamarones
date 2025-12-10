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
  X,
  MoreVertical, // Importado para el menú de acciones
  Trash2 // Importado para el icono de borrar
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu"; // Importado para el menú de acciones
import { Lote, Venta, Cosecha, UserRole } from "../App";
import { KPICard } from "./KPICard";
import { TransactionTable } from "./TransactionTable";
import { Badge } from "./ui/badge";
import { useState } from "react";

// Lista de estados posibles (necesario para el DropdownMenu)
const TODOS_LOS_ESTADOS: Lote["estado"][] = [
  "Crianza",
  "Listo para Pescar",
  "En Venta",
  "Reposo",
  "Descarte"
];

interface DashboardProps {
  lote: Lote | null;
  ventas: Venta[];
  cosechas: Cosecha[];
  userRole: UserRole;
  onUpdateEstado: (id: string, estado: Lote["estado"]) => void;
  onUpdateFechaPesca: (id: string, nueva: string) => void;
  onDeleteLote: (id: string) => void; // <--- NUEVA PROP
}

const COLORS = ["#0891b2", "#14b8a6"];

const estadoColors: Record<Lote["estado"], string> = {
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
  onUpdateFechaPesca,
  onDeleteLote // <--- Recibiendo la nueva prop
}: DashboardProps) {

  // ============================================
  // 🧨 SI LOTE ES NULL, NO RENDERIZAR DASHBOARD
  // ============================================
  if (!lote) {
    return (
      <div className="bg-white p-6 rounded shadow text-center text-gray-600">
        Cargando información del lote…
      </div>
    );
  }

  // Normalización FIJA Y SEGURA
  const librasCosechadas = Number(lote.librascosechadas ?? lote.libras_cosechadas ?? 0);
  const librasVendidas = Number(lote.librasvendidas ?? lote.libras_vendidas ?? 0);
  const costoProduccion = Number(lote.costo_produccion ?? 0);
  const ingresosTotales = Number(lote.ingresostotales ?? lote.ingresos_totales ?? 0);

  // Proteger inventario y gráficas
  const librasDisponibles = Math.max(librasCosechadas - librasVendidas, 0);

  const gananciaBruta = ingresosTotales - costoProduccion;
  const porcentajeVendido =
    librasCosechadas > 0 ? (librasVendidas / librasCosechadas) * 100 : 0;
  const margenGanancia =
    costoProduccion > 0 ? (gananciaBruta / costoProduccion) * 100 : 0;

  // ============================================
  // 🔒 Proteger ventas: evitar undefined / null
  // ============================================
  const ventasLista = Array.isArray(ventas) ? ventas : [];

  const ventasPorProveedor = ventasLista.reduce((acc, venta) => {
    const libras = Number(venta.libras) || 0;
    const precio = Number(venta.precioLibra) || 0;

    const existente = acc.find((v) => v.proveedor === venta.proveedor);

    if (existente) {
      existente.libras += libras;
      existente.ingresos += libras * precio;
    } else {
      acc.push({
        proveedor: venta.proveedor || "N/D",
        libras,
        ingresos: libras * precio
      });
    }
    return acc;
  }, [] as Array<{ proveedor: string; libras: number; ingresos: number }>);

  // ============================================
  // ✔ Inventario protegido
  // ============================================
  const inventarioData = [
    { name: "Vendido", value: librasVendidas },
    { name: "Disponible", value: librasDisponibles }
  ];

  const fechaInicio = new Date(lote.fecha_inicio);
  const hoy = new Date();
  const diasEnCiclo = Math.floor(
    (hoy.getTime() - fechaInicio.getTime()) / (1000 * 60 * 60 * 24)
  );

  const [editandoFecha, setEditandoFecha] = useState(false);
  const [nuevaFecha, setNuevaFecha] = useState(lote.fecha_estimada_pesca);
  
  // Función para manejar la eliminación
  const handleDelete = () => {
    if (userRole !== "Administrador") {
        alert("Permiso denegado. Solo un Administrador puede eliminar lotes.");
        return;
    }
    const confirmDelete = window.confirm(
      `¡ATENCIÓN! Está a punto de eliminar el lote "${lote.nombre}" y TODAS sus transacciones (Cosechas y Ventas). Esta acción es irreversible. ¿Desea continuar?`
    );
    if (confirmDelete) {
        onDeleteLote(lote.id);
    }
  };


  return (
    <div className="space-y-6">

      {/* HEADER DEL LOTE */}
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

              <div className="flex items-center flex-wrap gap-6 text-sm text-gray-600">
                <span>ID: {lote.id.substring(0, 8)}...</span>

                <span>Tipo: {lote.tipo_camaron}</span>

                <span>
                  Inicio: {new Date(lote.fecha_inicio).toLocaleDateString("es-ES")}
                </span>

                {/* FECHA ESTIMADA DE PESCA */}
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
                        className="h-8 bg-green-600"
                        onClick={() => {
                          onUpdateFechaPesca(lote.id, nuevaFecha);
                          setEditandoFecha(false);
                        }}
                      >
                        <Check className="size-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8"
                        onClick={() => {
                          setNuevaFecha(lote.fecha_estimada_pesca);
                          setEditandoFecha(false);
                        }}
                      >
                        <X className="size-4" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <span>
                        {new Date(lote.fecha_estimada_pesca).toLocaleDateString(
                          "es-ES"
                        )}
                      </span>

                      {(userRole === "Administrador" || userRole === "Propietario") && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0"
                          onClick={() => setEditandoFecha(true)}
                        >
                          <Edit2 className="size-4" />
                        </Button>
                      )}
                    </>
                  )}
                </div>

                <span>Días en ciclo: {diasEnCiclo}</span>
              </div>
            </div>

            {/* ACCIONES (Dropdown y Eliminación) */}
            {(userRole === "Propietario" || userRole === "Administrador") && (
              <div className="flex gap-2 items-center">

                {/* Botón de Eliminación (Solo Admin) */}
                {userRole === "Administrador" && (
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={handleDelete}
                    className="flex items-center gap-1"
                  >
                    <Trash2 className="size-4" /> Eliminar Lote
                  </Button>
                )}

                {/* Menú de Cambio de Estado */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <MoreVertical className="size-5" />
                      <span className="sr-only">Abrir menú de estado</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Cambiar Estado a...</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {TODOS_LOS_ESTADOS
                      .filter(estado => estado !== lote.estado) // No mostrar el estado actual
                      .map((estado) => (
                        <DropdownMenuItem
                          key={estado}
                          onClick={() => {
                            if (window.confirm(`¿Seguro que desea cambiar el estado de ${lote.nombre} a "${estado}"?`)) {
                                onUpdateEstado(lote.id, estado);
                            }
                          }}
                        >
                          {estado}
                        </DropdownMenuItem>
                      ))}
                  </DropdownMenuContent>
                </DropdownMenu>
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
          trend={gananciaBruta >= 0 ? "up" : "down"}
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
          bgColor="from-blue-500 to-indigo-500"
        />
      </div>

      {/* GRÁFICAS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Ventas por proveedor */}
        {ventasPorProveedor.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Ventas por Proveedor (Libras)</CardTitle>
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
                  <Tooltip formatter={(value: number) => `${value.toFixed(2)} lb`} />
                  <Bar dataKey="libras" fill="#0891b2" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Inventario */}
        {Number.isFinite(librasCosechadas) && librasCosechadas > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Inventario Cosechado</CardTitle>
              <p className="text-sm text-gray-500">Total cosechado: {librasCosechadas.toFixed(2)} lb</p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={inventarioData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                    outerRadius={80}
                  >
                    {inventarioData.map((_, idx) => (
                      <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `${value.toFixed(2)} lb`} />
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
          <TransactionTable ventas={ventasLista} cosechas={cosechas} />
        </CardContent>
      </Card>
    </div>
  );
}
 