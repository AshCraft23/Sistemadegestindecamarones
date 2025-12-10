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

import { supabase } from "@/lib/supabase";

import { Dashboard } from "./components/Dashboard";
import { DashboardAnual } from "./components/DashboardAnual";
import { LoteForm } from "./components/LoteForm";
import { CosechaForm } from "./components/CosechaForm";
import { VentaForm } from "./components/VentaForm";
import { LotesList } from "./components/LotesList";
import { AdministracionPanel } from "./components/AdministracionPanel";
import { LoginForm } from "./components/LoginForm";

// -------------------------------
//  TIPOS
// -------------------------------
export type EstadoLote =
  | "Crianza"
  | "Listo para Pescar"
  | "En Venta"
  | "Reposo"
  | "Descarte";

export type UserRole = "Administrador" | "Propietario" | "Vendedor" | "Pescador";

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
  fechaInicio: string;
  fechaEstimadaPesca: string;
  tipoCamaron: string;
  estado: EstadoLote;
  librasCosechadas: number;
  librasVendidas: number;
  costoProduccion: number;
  ingresosTotales: number;
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

export default function App() {
  // -------------------------------
  // ESTADOS CENTRALES
  // -------------------------------
  const [currentUser, setCurrentUser] = useState<Usuario | null>(null);

  const [lotes, setLotes] = useState<Lote[]>([]);
  const [cosechas, setCosechas] = useState<Cosecha[]>([]);
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [pescadores, setPescadores] = useState<Pescador[]>([]);
  const [vendedores, setVendedores] = useState<Vendedor[]>([]);

  const [selectedLoteId, setSelectedLoteId] = useState<string | null>(null);
  const [showLoteForm, setShowLoteForm] = useState(false);

  // -------------------------------
  // FETCH GENERAL
  // -------------------------------
  const fetchAll = async () => {
    await Promise.all([
      fetchLotes(),
      fetchCosechas(),
      fetchVentas(),
      fetchProveedores(),
      fetchPescadores(),
      fetchVendedores(),
    ]);
  };

  const fetchLotes = async () => {
    const { data } = await supabase.from("lotes").select("*");
    if (data) setLotes(data);
  };

  const fetchCosechas = async () => {
    const { data } = await supabase.from("cosechas").select("*");
    if (data) setCosechas(data);
  };

  const fetchVentas = async () => {
    const { data } = await supabase.from("ventas").select("*");
    if (data) setVentas(data);
  };

  const fetchProveedores = async () => {
    const { data } = await supabase.from("proveedores").select("*");
    if (data) setProveedores(data);
  };

  const fetchPescadores = async () => {
    const { data } = await supabase.from("pescadores").select("*");
    if (data) setPescadores(data);
  };

  const fetchVendedores = async () => {
    const { data } = await supabase.from("vendedores").select("*");
    if (data) setVendedores(data);
  };

  // -------------------------------
  // REALTIME
  // -------------------------------
  const setupRealtime = () => {
    const tables = [
      "lotes",
      "cosechas",
      "ventas",
      "proveedores",
      "pescadores",
      "vendedores",
    ];

    tables.forEach((table) => {
      supabase
        .channel(`rt:${table}`)
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table },
          () => {
            if (table === "lotes") fetchLotes();
            if (table === "cosechas") fetchCosechas();
            if (table === "ventas") fetchVentas();
            if (table === "proveedores") fetchProveedores();
            if (table === "pescadores") fetchPescadores();
            if (table === "vendedores") fetchVendedores();
          }
        )
        .subscribe();
    });
  };

  // -------------------------------
  // CRUD para enviar a los componentes
  // -------------------------------
  const createLote = async (data: any) =>
    await supabase.from("lotes").insert(data);

  const updateLote = async (id: string, data: any) =>
    await supabase.from("lotes").update(data).eq("id", id);

  const deleteLote = async (id: string) =>
    await supabase.from("lotes").delete().eq("id", id);

  const createCosecha = async (data: any) =>
    await supabase.from("cosechas").insert(data);

  const createVenta = async (data: any) =>
    await supabase.from("ventas").insert(data);

  const createProveedor = async (data: any) =>
    await supabase.from("proveedores").insert(data);

  const updateProveedor = async (id: string, data: any) =>
    await supabase.from("proveedores").update(data).eq("id", id);

  const deleteProveedor = async (id: string) =>
    await supabase.from("proveedores").delete().eq("id", id);

  const createPescador = async (data: any) =>
    await supabase.from("pescadores").insert(data);

  const updatePescador = async (id: string, data: any) =>
    await supabase.from("pescadores").update(data).eq("id", id);

  const deletePescador = async (id: string) =>
    await supabase.from("pescadores").delete().eq("id", id);

  const createVendedor = async (data: any) =>
    await supabase.from("vendedores").insert(data);

  const updateVendedor = async (id: string, data: any) =>
    await supabase.from("vendedores").update(data).eq("id", id);

  const deleteVendedor = async (id: string) =>
    await supabase.from("vendedores").delete().eq("id", id);

  // -------------------------------
  // INIT
  // -------------------------------
  useEffect(() => {
    fetchAll();
    setupRealtime();
  }, []);

  // -------------------------------
  // LOGIN
  // -------------------------------
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

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-teal-50 flex items-center justify-center p-4">
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

  // -------------------------------
  // UI PARA PESCADOR
  // -------------------------------
  if (currentUser.rol === "Pescador") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-teal-50">
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
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
              Cerrar Sesión
            </Button>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-cyan-900 mb-6">Registrar Cosecha</h2>
            <CosechaForm
              lotes={lotes.filter((l) => l.estado === "Listo para Pescar")}
              onSubmit={createCosecha}
              pescadores={pescadores.filter((p) => p.activo)}
              pescadorNombre={currentUser.nombre}
            />
          </div>
        </main>
      </div>
    );
  }

  // -------------------------------
  // UI GENERAL
  // -------------------------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-teal-50">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
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

          <div className="flex items-center gap-4">
            {currentUser.rol !== "Vendedor" && (
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-700">Lote:</label>
                <Select
                  value={selectedLoteId || ""}
                  onValueChange={setSelectedLoteId}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Seleccionar lote" />
                  </SelectTrigger>
                  <SelectContent>
                    {lotes.map((l) => (
                      <SelectItem key={l.id} value={l.id}>
                        {l.id} - {l.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2 size-4" />
              Cerrar Sesión
            </Button>
          </div>
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
          className="space-y-6"
        >
          <TabsList className="bg-white">
            {currentUser.rol === "Administrador" && (
              <TabsTrigger value="dashboard-anual">
                Dashboard Anual
              </TabsTrigger>
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

          {/* DASHBOARD ANUAL */}
          {currentUser.rol === "Administrador" && (
            <TabsContent value="dashboard-anual">
              <DashboardAnual lotes={lotes} ventas={ventas} />
            </TabsContent>
          )}

          {/* DASHBOARD */}
          {currentUser.rol !== "Vendedor" && (
            <>
              <TabsContent value="dashboard">
                {selectedLoteId ? (
                  <Dashboard
                    lote={lotes.find((l) => l.id === selectedLoteId)!}
                    ventas={ventas.filter((v) => v.loteId === selectedLoteId)}
                    cosechas={cosechas.filter((c) => c.loteId === selectedLoteId)}
                    userRole={currentUser.rol}
                    onUpdateEstado={(id, estado) =>
                      updateLote(id, { estado })
                    }
                    onUpdateFechaPesca={(id, fecha) =>
                      updateLote(id, { fechaEstimadaPesca: fecha })
                    }
                  />
                ) : (
                  <div className="bg-white rounded-lg shadow p-8 text-center">
                    <p className="text-gray-600">
                      Selecciona un lote para ver su dashboard
                    </p>
                  </div>
                )}
              </TabsContent>

              {/* LOTES */}
              <TabsContent value="lotes">
                <div className="space-y-4">
                  {(currentUser.rol === "Propietario" ||
                    currentUser.rol === "Administrador") && (
                    <div className="flex justify-end">
                      <Dialog
                        open={showLoteForm}
                        onOpenChange={setShowLoteForm}
                      >
                        <DialogTrigger asChild>
                          <Button className="bg-gradient-to-r from-cyan-600 to-teal-600">
                            Crear Nuevo Lote
                          </Button>
                        </DialogTrigger>

                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Nuevo Lote</DialogTitle>
                          </DialogHeader>

                          <LoteForm onSubmit={createLote} />
                        </DialogContent>
                      </Dialog>
                    </div>
                  )}

                  <LotesList
                    lotes={lotes}
                    onSelectLote={setSelectedLoteId}
                    selectedLoteId={selectedLoteId}
                  />
                </div>
              </TabsContent>
            </>
          )}

          {/* COSECHA */}
          {currentUser.rol === "Propietario" && (
            <TabsContent value="cosecha">
              <div className="max-w-2xl mx-auto">
                <CosechaForm
                  lotes={lotes.filter((l) => l.estado === "Listo para Pescar")}
                  onSubmit={createCosecha}
                  pescadores={pescadores.filter((p) => p.activo)}
                  pescadorNombre={currentUser.nombre}
                />
              </div>
            </TabsContent>
          )}

          {/* VENTA */}
          {(currentUser.rol === "Vendedor" ||
            currentUser.rol === "Propietario" ||
            currentUser.rol === "Administrador") && (
            <TabsContent value="venta">
              <div className="max-w-2xl mx-auto">
                <VentaForm
                  lotes={lotes.filter(
                    (l) =>
                      l.estado === "En Venta" &&
                      l.librasCosechadas - l.librasVendidas > 0
                  )}
                  onSubmit={createVenta}
                  proveedores={proveedores.filter((p) => p.activo)}
                  vendedores={vendedores.filter((v) => v.activo)}
                  vendedorNombre={currentUser.nombre}
                  onCreateProveedor={createProveedor}
                />
              </div>
            </TabsContent>
          )}

          {/* ADMINISTRACIÓN */}
          {(currentUser.rol === "Propietario" ||
            currentUser.rol === "Administrador") && (
            <TabsContent value="administracion">
              <AdministracionPanel
                proveedores={proveedores}
                pescadores={pescadores}
                vendedores={vendedores}
                onCreateProveedor={createProveedor}
                onUpdateProveedor={updateProveedor}
                onDeleteProveedor={deleteProveedor}
                onCreatePescador={createPescador}
                onUpdatePescador={updatePescador}
                onDeletePescador={deletePescador}
                onCreateVendedor={createVendedor}
                onUpdateVendedor={updateVendedor}
                onDeleteVendedor={deleteVendedor}
                userRole={currentUser.rol}
              />
            </TabsContent>
          )}
        </Tabs>
      </main>
    </div>
  );
}
