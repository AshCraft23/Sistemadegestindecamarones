// ⬇⬇⬇ TU CÓDIGO CORREGIDO COMPLETO COMIENZA AQUÍ ⬇⬇⬇

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

/* =======================================================
   TIPOS
======================================================= */

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
  precioLibra: number;
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

/* =======================================================
   COMPONENTE APP
======================================================= */

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

  /* =======================================================
     FETCH LOTES
  ======================================================= */

  const fetchLotes = async () => {
    const { data, error } = await supabase
      .from("lotes_dashboard_view")
      .select("*")
      .order("fecha_inicio", { ascending: false });

    if (error) {
      console.error("Error cargando lotes:", error);
      return;
    }

    const mapped: Lote[] =
      data?.map((row: any) => ({
        id: row.id,
        nombre: row.nombre,
        fecha_inicio: row.fecha_inicio,
        fecha_estimada_pesca: row.fecha_estimada_pesca,
        tipo_camaron: row.tipo_camaron,
        estado: row.estado,
        librascosechadas: row.libras_cosechadas ?? 0,
        librasvendidas: row.libras_vendidas ?? 0,
        ingresostotales: row.ingresos_totales ?? 0,
        costo_produccion: row.costo_produccion ?? 0,
      })) ?? [];

    setLotes(mapped);

    if (!selectedLoteId && mapped.length > 0) {
      setSelectedLoteId(mapped[0].id);
    }
  };

  /* =======================================================
     FETCH VENTAS
  ======================================================= */

  const fetchVentas = async () => {
    const { data, error } = await supabase
      .from("ventas")
      .select(
        "id, lote_id, fecha, libras, precio_libra, proveedor_nombre, vendedor_nombre"
      )
      .order("fecha", { ascending: false });

    if (error) {
      console.error("Error cargando ventas:", error);
      return;
    }

    const mapped: Venta[] =
      data?.map((row: any) => ({
        id: row.id,
        loteId: row.lote_id,
        fecha: row.fecha,
        libras: Number(row.libras) || 0,
        precioLibra: Number(row.precio_libra) || 0,
        proveedor: row.proveedor_nombre ?? "",
        vendedor: row.vendedor_nombre ?? "",
      })) ?? [];

    setVentas(mapped);
  };

  /* =======================================================
     FETCH PROVEEDORES / PESCADORES / VENDEDORES
  ======================================================= */

  const fetchProveedores = async () => {
    const { data, error } = await supabase
      .from("proveedores")
      .select("*")
      .order("nombre");

    if (!error) {
      setProveedores(data ?? []);
    }
  };

  const fetchPescadores = async () => {
    const { data, error } = await supabase
      .from("pescadores")
      .select("*")
      .order("nombre");

    if (!error) {
      setPescadores(data ?? []);
    }
  };

  const fetchVendedores = async () => {
    const { data, error } = await supabase
      .from("vendedores")
      .select("*")
      .order("nombre");

    if (!error) {
      setVendedores(data ?? []);
    }
  };

  /* =======================================================
     FETCH ALL
  ======================================================= */

  const fetchAll = async () => {
    await Promise.all([
      fetchLotes(),
      fetchVentas(),
      fetchProveedores(),
      fetchPescadores(),
      fetchVendedores(),
    ]);
  };

  /* =======================================================
     REALTIME
  ======================================================= */

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

  /* =======================================================
     LOGIN / LOGOUT
  ======================================================= */

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

  /* =======================================================
     CRUD LOTES
  ======================================================= */

  const handleCreateLote = async (loteData: LoteCreatePayload) => {
    const { error } = await supabase.from("lotes").insert(loteData);

    if (error) {
      alert("Error creando lote: " + error.message);
      return;
    }

    setShowLoteForm(false);
  };

  const handleUpdateLoteEstado = async (loteId: string, estado: EstadoLote) => {
    await supabase.from("lotes").update({ estado }).eq("id", loteId);
  };

  const handleUpdateFechaPesca = async (loteId: string, fecha: string) => {
    await supabase.from("lotes").update({ fecha_estimada_pesca: fecha }).eq("id", loteId);
  };

  /* =======================================================
     COSECHAS
  ======================================================= */

  const handleRegistrarCosecha = async (cosechaData: Omit<Cosecha, "id">) => {
    const lote = lotes.find((l) => l.id === cosechaData.loteId);
    const nuevas = (lote?.librascosechadas ?? 0) + cosechaData.libras;

    await supabase
      .from("lotes")
      .update({ librascosechadas: nuevas, estado: "En Venta" })
      .eq("id", cosechaData.loteId);
  };

  /* =======================================================
     VENTAS
  ======================================================= */

  const handleRegistrarVenta = async (ventaData: Omit<Venta, "id">) => {
    const lote = lotes.find((l) => l.id === ventaData.loteId);

    await supabase.from("ventas").insert({
      lote_id: ventaData.loteId,
      fecha: ventaData.fecha,
      libras: ventaData.libras,
      precio_libra: ventaData.precioLibra,
      proveedor_nombre: ventaData.proveedor,
      vendedor_nombre: ventaData.vendedor,
    });
  };

  /* =======================================================
     INTERFAZ
  ======================================================= */

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoginForm onLogin={handleLogin} />
      </div>
    );
  }

  /* ====================
      VISTA GENERAL
  ==================== */

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-teal-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between">
          <div className="flex gap-3 items-center">
            <Waves className="size-6 text-cyan-700" />
            <div>
              <h1 className="text-cyan-900 font-bold">Sistema GELCA</h1>
              <p className="text-sm text-gray-600">
                {currentUser.nombre} — {currentUser.rol}
              </p>
            </div>
          </div>

          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 size-4" />
            Cerrar Sesión
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs
          defaultValue={
            currentUser.rol === "Administrador"
              ? "dashboard-anual"
              : currentUser.rol === "Vendedor"
              ? "venta"
              : "dashboard"
          }
        >
          <TabsList className="bg-white">
            {currentUser.rol === "Administrador" && (
              <TabsTrigger value="dashboard-anual">Dashboard Anual</TabsTrigger>
            )}

            {currentUser.rol !== "Vendedor" && (
              <>
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="lotes">Gestión de Lotes</TabsTrigger>
              </>
            )}

            {currentUser.rol === "Propietario" && (
              <TabsTrigger value="cosecha">Registrar Cosecha</TabsTrigger>
            )}

            {(currentUser.rol === "Vendedor" ||
              currentUser.rol === "Propietario" ||
              currentUser.rol === "Administrador") && (
              <TabsTrigger value="venta">Registrar Venta</TabsTrigger>
            )}

            {(currentUser.rol === "Propietario" ||
              currentUser.rol === "Administrador") && (
              <TabsTrigger value="administracion">Administración</TabsTrigger>
            )}
          </TabsList>

          {currentUser.rol === "Administrador" && (
            <TabsContent value="dashboard-anual">
              <DashboardAnual lotes={lotes} ventas={ventas} />
            </TabsContent>
          )}

          {currentUser.rol !== "Vendedor" && (
            <>
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
                  <div className="bg-white p-8 rounded text-center">
                    Selecciona un lote
                  </div>
                )}
              </TabsContent>

              <TabsContent value="lotes">
                <div className="flex justify-end mb-4">
                  <Dialog open={showLoteForm} onOpenChange={setShowLoteForm}>
                    <DialogTrigger asChild>
                      <Button className="bg-cyan-600 text-white">
                        Crear Nuevo Lote
                      </Button>
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
                  selectedLoteId={selectedLoteId}
                  onSelectLote={setSelectedLoteId}
                />
              </TabsContent>
            </>
          )}

          {currentUser.rol === "Propietario" && (
            <TabsContent value="cosecha">
              <CosechaForm
                lotes={lotes.filter((l) => l.estado === "Listo para Pescar")}
                onSubmit={handleRegistrarCosecha}
                pescadores={pescadores}
                pescadorNombre={currentUser.nombre}
              />
            </TabsContent>
          )}

          {(currentUser.rol === "Vendedor" ||
            currentUser.rol === "Propietario" ||
            currentUser.rol === "Administrador") && (
            <TabsContent value="venta">
              <VentaForm
                lotes={lotes.filter(
                  (l) => l.estado === "En Venta" && l.librascosechadas > l.librasvendidas
                )}
                proveedores={proveedores}
                vendedores={vendedores}
                vendedorNombre={currentUser.nombre}
                onSubmit={handleRegistrarVenta}
                onCreateProveedor={() => {}}
              />
            </TabsContent>
          )}

          {(currentUser.rol === "Propietario" ||
            currentUser.rol === "Administrador") && (
            <TabsContent value="administracion">
              <AdministracionPanel
                proveedores={proveedores}
                pescadores={pescadores}
                vendedores={vendedores}
                onCreateProveedor={() => {}}
                onUpdateProveedor={() => {}}
                onDeleteProveedor={() => {}}
                onCreatePescador={() => {}}
                onUpdatePescador={() => {}}
                onDeletePescador={() => {}}
                onCreateVendedor={() => {}}
                onUpdateVendedor={() => {}}
                onDeleteVendedor={() => {}}
                userRole={currentUser.rol}
              />
            </TabsContent>
          )}
        </Tabs>
      </main>
    </div>
  );
}

// ⬆⬆⬆ TU CÓDIGO COMPLETAMENTE CORREGIDO TERMINA AQUÍ ⬆⬆⬆
