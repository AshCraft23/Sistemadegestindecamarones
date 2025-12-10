import { useEffect, useState } from "react";
import { Button } from "./components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./components/ui/dialog";
import { LogOut, Waves } from "lucide-react";
import { Dashboard } from "./components/Dashboard";
import { DashboardAnual } from "./components/DashboardAnual";
import { LoteForm } from "./components/LoteForm";
import { CosechaForm } from "./components/CosechaForm";
import { VentaForm } from "./components/VentaForm";
import { LotesList } from "./components/LotesList";
import { AdministracionPanel } from "./components/AdministracionPanel";
import { LoginForm } from "./components/LoginForm";
import { supabase } from "@/lib/supabase";

// =====================================================
// TIPOS (TODOS EN SNAKE_CASE IGUAL QUE SUPABASE)
// =====================================================
export type EstadoLote =
  | "Crianza"
  | "Listo para Pescar"
  | "En Venta"
  | "Reposo"
  | "Descarte";

export type UserRole =
  | "Administrador"
  | "Propietario"
  | "Vendedor"
  | "Pescador";

export interface Usuario {
  id: string;
  nombre: string;
  username: string;
  password: string;
  rol: UserRole;
  activo: boolean;
}

export interface Lote {
  id: string;
  nombre: string;
  fecha_inicio: string;
  fecha_estimada_pesca: string;
  tipo_camaron: string;
  estado: EstadoLote;

  librascosechadas: number;
  librasvendidas: number;
  costo_produccion: number;
  ingresostotales: number;
}

export interface Cosecha {
  id: string;
  loteId: string;
  fecha: string;
  libras: number;
  pescador: string;
}

export interface Venta {
  id: string;
  loteId: string;
  fecha: string;
  libras: number;
  precio_libra: number;
  proveedor: string;
  vendedor: string;
}

export interface Proveedor {
  id: string;
  nombre: string;
  contacto: string;
  telefono: string;
  email: string;
  activo: boolean;
}

export interface Pescador {
  id: string;
  nombre: string;
  telefono: string;
  especialidad: string;
  activo: boolean;
}

export interface Vendedor {
  id: string;
  nombre: string;
  telefono: string;
  email: string;
  activo: boolean;
}

// =====================================================
// COMPONENTE PRINCIPAL
// =====================================================

export default function App() {
  const [currentUser, setCurrentUser] = useState<Usuario | null>(null);

  const [lotes, setLotes] = useState<Lote[]>([]);
  const [cosechas, setCosechas] = useState<Cosecha[]>([]);
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [pescadores, setPescadores] = useState<Pescador[]>([]);
  const [vendedores, setVendedores] = useState<Vendedor[]>([]);

  const [selectedLoteId, setSelectedLoteId] = useState<string | null>(null);
  const [showLoteForm, setShowLoteForm] = useState(false);

  const selectedLote = lotes.find((l) => l.id === selectedLoteId);

  // =====================================================
  // FETCH LOTES (CORREGIDO COMPLETAMENTE)
  // =====================================================
  const fetchLotes = async () => {
    const { data, error } = await supabase
      .from("lotes")
      .select("*")
      .order("fecha_inicio", { ascending: false });

    if (error) {
      console.error("Error cargando lotes:", error);
      return;
    }

    setLotes(data ?? []);

    if (!selectedLoteId && data && data.length > 0) {
      setSelectedLoteId(data[0].id);
    }
  };

  // =====================================================
  // FETCH VENTAS
  // =====================================================
  const fetchVentas = async () => {
    const { data, error } = await supabase
      .from("ventas")
      .select("*")
      .order("fecha", { ascending: false });

    if (error) {
      console.error("Error cargando ventas:", error);
      return;
    }

    setVentas(data ?? []);
  };

  // =====================================================
  // FETCH PROVEEDORES
  // =====================================================
  const fetchProveedores = async () => {
    const { data, error } = await supabase
      .from("proveedores")
      .select("*")
      .order("nombre");

    if (error) {
      console.error("Error cargando proveedores:", error);
      return;
    }

    setProveedores(data ?? []);
  };

  // =====================================================
  // FETCH PESCADORES
  // =====================================================
  const fetchPescadores = async () => {
    const { data, error } = await supabase
      .from("pescadores")
      .select("*")
      .order("nombre");

    if (error) {
      console.error("Error cargando pescadores:", error);
      return;
    }

    setPescadores(data ?? []);
  };

  // =====================================================
  // FETCH VENDEDORES
  // =====================================================
  const fetchVendedores = async () => {
    const { data, error } = await supabase
      .from("vendedores")
      .select("*")
      .order("nombre");

    if (error) {
      console.error("Error cargando vendedores:", error);
      return;
    }

    setVendedores(data ?? []);
  };

  // =====================================================
  // FETCH ALL
  // =====================================================

  const fetchAll = async () => {
    await Promise.all([
      fetchLotes(),
      fetchVentas(),
      fetchProveedores(),
      fetchPescadores(),
      fetchVendedores(),
    ]);
  };

  // =====================================================
  // REALTIME
  // =====================================================

  useEffect(() => {
    fetchAll();

    const tables = ["lotes", "ventas", "proveedores", "pescadores", "vendedores"];

    const channels = tables.map((table) =>
      supabase
        .channel(`realtime:${table}`)
        .on("postgres_changes", { event: "*", schema: "public", table }, () => {
          switch (table) {
            case "lotes":
              fetchLotes();
              break;
            case "ventas":
              fetchVentas();
              break;
            case "proveedores":
              fetchProveedores();
              break;
            case "pescadores":
              fetchPescadores();
              break;
            case "vendedores":
              fetchVendedores();
              break;
          }
        })
        .subscribe()
    );

    return () => {
      channels.forEach((ch) => supabase.removeChannel(ch));
    };
  }, []);

  // =====================================================
  // LOGIN / LOGOUT
  // =====================================================

  const handleLogin = (user: Usuario) => {
    setCurrentUser(user);
    if (lotes.length > 0 && !selectedLoteId) {
      setSelectedLoteId(lotes[0].id);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setSelectedLoteId(null);
  };

  // =====================================================
  // CREAR LOTE (CORREGIDO)
  // =====================================================

  const handleCreateLote = async (loteData: any) => {
    const { error } = await supabase.from("lotes").insert({
      nombre: loteData.nombre,
      fecha_inicio: loteData.fechaInicio,
      fecha_estimada_pesca: loteData.fechaEstimadaPesca,
      tipo_camaron: loteData.tipoCamaron,
      estado: loteData.estado,
      librascosechadas: 0,
      librasvendidas: 0,
      costo_produccion: loteData.costoProduccion,
      ingresostotales: 0,
    });

    if (error) {
      alert("Error creando lote: " + error.message);
      return;
    }

    setShowLoteForm(false);
  };

  // =====================================================
  // UPDATE ESTADO LOTE
  // =====================================================

  const handleUpdateLoteEstado = async (loteId: string, nuevoEstado: EstadoLote) => {
    const { error } = await supabase
      .from("lotes")
      .update({ estado: nuevoEstado })
      .eq("id", loteId);

    if (error) {
      alert("Error actualizando estado del lote: " + error.message);
      return;
    }
  };

  // =====================================================
  // UPDATE FECHA PESCA
  // =====================================================

  const handleUpdateFechaPesca = async (loteId: string, nuevaFecha: string) => {
    const { error } = await supabase
      .from("lotes")
      .update({ fecha_estimada_pesca: nuevaFecha })
      .eq("id", loteId);

    if (error) {
      alert("Error actualizando fecha estimada: " + error.message);
    }
  };

  // =====================================================
  // COSECHA
  // =====================================================

  const handleRegistrarCosecha = async (cosechaData: any) => {
    const lote = lotes.find((l) => l.id === cosechaData.loteId);

    const nuevas = (lote?.librascosechadas ?? 0) + cosechaData.libras;

    await supabase
      .from("lotes")
      .update({
        librascosechadas: nuevas,
        estado: "En Venta",
      })
      .eq("id", cosechaData.loteId);

    fetchLotes();
  };

  // =====================================================
  // REGISTRAR VENTA
  // =====================================================

  const handleRegistrarVenta = async (ventaData: any) => {
    const lote = lotes.find((l) => l.id === ventaData.loteId);
    const proveedor = proveedores.find((p) => p.nombre === ventaData.proveedor);
    const vendedor = vendedores.find((v) => v.nombre === ventaData.vendedor);

    await supabase.from("ventas").insert({
      lote_id: ventaData.loteId,
      fecha: ventaData.fecha,
      libras: ventaData.libras,
      precio_libra: ventaData.precioLibra,
      proveedor_id: proveedor?.id ?? null,
      vendedor_id: vendedor?.id ?? null,
      proveedor_nombre: ventaData.proveedor,
      vendedor_nombre: ventaData.vendedor,
    });

    const nuevasVendidas = (lote?.librasvendidas ?? 0) + ventaData.libras;
    const nuevosIngresos =
      (lote?.ingresostotales ?? 0) + ventaData.libras * ventaData.precioLibra;

    await supabase
      .from("lotes")
      .update({
        librasvendidas: nuevasVendidas,
        ingresostotales: nuevosIngresos,
      })
      .eq("id", ventaData.loteId);

    fetchLotes();
  };

  // =====================================================
  // UI LOGIN SCREEN
  // =====================================================

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-50 via-blue-50 to-teal-50 p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gradient-to-br from-cyan-500 to-teal-500 p-3 rounded-full">
              <Waves className="size-8 text-white" />
            </div>
          </div>
          <h1 className="text-center text-cyan-900 mb-2">Sistema GELCA</h1>
          <p className="text-center text-gray-600 mb-8">
            Gestión de Camarones por Lotes
          </p>
          <LoginForm onLogin={handleLogin} />
        </div>
      </div>
    );
  }

  // =====================================================
  // UI PARA PESCADOR
  // =====================================================

  if (currentUser.rol === "Pescador") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-teal-50">
        <header className="bg-white shadow-sm border-b">
          <div className="container mx-auto p-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-cyan-500 to-teal-500 p-2 rounded-lg">
                <Waves className="size-6 text-white" />
              </div>
              <div>
                <h1 className="text-cyan-900">GELCA</h1>
                <p className="text-sm text-gray-600">
                  {currentUser.nombre} - Pescador
                </p>
              </div>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2 size-4" />
              Cerrar sesión
            </Button>
          </div>
        </header>

        <main className="container mx-auto p-8">
          <div className="max-w-2xl mx-auto">
            <CosechaForm
              lotes={lotes.filter((l) => l.estado === "Listo para Pescar")}
              onSubmit={handleRegistrarCosecha}
              pescadores={pescadores}
              pescadorNombre={currentUser.nombre}
            />
          </div>
        </main>
      </div>
    );
  }

  // =====================================================
  // UI GENERAL
  // =====================================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-teal-50">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto p-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-cyan-500 to-teal-500 p-2 rounded-lg">
              <Waves className="size-6 text-white" />
            </div>
            <div>
              <h1 className="text-cyan-900">Sistema GELCA</h1>
              <p className="text-sm text-gray-600">
                {currentUser.nombre} - {currentUser.rol}
              </p>
            </div>
          </div>

          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 size-4" />
            Cerrar sesión
          </Button>
        </div>
      </header>

      <main className="container mx-auto p-8">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="lotes">Lotes</TabsTrigger>
            <TabsTrigger value="venta">Venta</TabsTrigger>
            <TabsTrigger value="administracion">Administración</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            {selectedLote ? (
              <Dashboard
                lote={selectedLote}
                ventas={ventas.filter((v) => v.loteId === selectedLote.id)}
                cosechas={cosechas.filter((c) => c.loteId === selectedLote.id)}
                userRole={currentUser.rol}
                onUpdateEstado={handleUpdateLoteEstado}
                onUpdateFechaPesca={handleUpdateFechaPesca}
              />
            ) : (
              <div className="bg-white p-6 rounded-lg shadow text-center">
                Selecciona un lote para ver su dashboard.
              </div>
            )}
          </TabsContent>

          <TabsContent value="lotes">
            <div className="flex justify-end mb-4">
              <Dialog open={showLoteForm} onOpenChange={setShowLoteForm}>
                <DialogTrigger asChild>
                  <Button>Crear Lote</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Crear Nuevo Lote</DialogTitle>
                  </DialogHeader>
                  <LoteForm onSubmit={handleCreateLote} />
                </DialogContent>
              </Dialog>
            </div>

            <LotesList
              lotes={lotes}
              onSelectLote={setSelectedLoteId}
              selectedLoteId={selectedLoteId}
            />
          </TabsContent>

          <TabsContent value="venta">
            <div className="max-w-2xl mx-auto">
              <VentaForm
                lotes={lotes.filter(
                  (l) =>
                    l.estado === "En Venta" &&
                    l.librascosechadas - l.librasvendidas > 0
                )}
                onSubmit={handleRegistrarVenta}
                proveedores={proveedores}
                vendedores={vendedores}
                vendedorNombre={currentUser.nombre}
                onCreateProveedor={handleCreateProveedor}
              />
            </div>
          </TabsContent>

          <TabsContent value="administracion">
            <AdministracionPanel
              proveedores={proveedores}
              pescadores={pescadores}
              vendedores={vendedores}
              onCreateProveedor={handleCreateProveedor}
              onUpdateProveedor={handleUpdateProveedor}
              onDeleteProveedor={handleDeleteProveedor}
              onCreatePescador={handleCreatePescador}
              onUpdatePescador={handleUpdatePescador}
              onDeletePescador={handleDeletePescador}
              onCreateVendedor={handleCreateVendedor}
              onUpdateVendedor={handleUpdateVendedor}
              onDeleteVendedor={handleDeleteVendedor}
              userRole={currentUser.rol}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
