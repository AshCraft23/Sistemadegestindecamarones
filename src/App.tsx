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

// ====================
// Tipos
// ====================
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
  nombre: string;      // mapea a "name"
  username: string;
  email?: string;
  password: string;
  rol: UserRole;       // mapea a "role"
  activo: boolean;     // mapea a "active"
}

// NOTA: este tipo mezcla lo que viene de la vista (snake_case)
// y alias en camelCase / sin guión bajo para que otros componentes sigan funcionando.


export interface Lote {
  id: string;
  nombre: string;
  fecha_inicio: string;
  fecha_estimada_pesca: string;
  tipo_camaron: string;
  estado: EstadoLote;
  costo_produccion: number;

  // Campos calculados por la vista (snake_case reales)
  libras_cosechadas: number;
  libras_vendidas: number;
  ingresos_totales: number;

  
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
  const [currentUser, setCurrentUser] = useState<Usuario | null>(null);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [lotes, setLotes] = useState<Lote[]>([]);
  const [cosechas, setCosechas] = useState<Cosecha[]>([]);
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [pescadores, setPescadores] = useState<Pescador[]>([]);
  const [vendedores, setVendedores] = useState<Vendedor[]>([]);

  const [selectedLoteId, setSelectedLoteId] = useState<string | null>(null);
  const [showLoteForm, setShowLoteForm] = useState(false);

  const selectedLote = lotes.find((l) => l.id === selectedLoteId) || null;

  // ====================
  // FETCH: LOTES  (vista lotes_dashboard_view)
  // ====================
  const fetchLotes = async () => {
    const { data, error } = await supabase
      .from("lotes_dashboard_view")
      .select("*")
      .order("fecha_inicio", { ascending: false });

    if (error) {
      console.error("Error cargando lotes:", error);
      return;
    }

    const mapped: Lote[] = data?.map((row: any) => ({
      id: row.id,
      nombre: row.nombre,
      fecha_inicio: row.fecha_inicio,
      fecha_estimada_pesca: row.fecha_estimada_pesca,
      tipo_camaron: row.tipo_camaron,
      estado: row.estado,
      costo_produccion: Number(row.costo_produccion) || 0,
      libras_cosechadas: Number(row.libras_cosechadas) || 0,
      libras_vendidas: Number(row.libras_vendidas) || 0,
      ingresos_totales: Number(row.ingresos_totales) || 0,
    })) ?? [];

    setLotes(mapped);

    if (!selectedLoteId && mapped.length > 0) {
      setSelectedLoteId(mapped[0].id);
    }
  };

  // ====================
  // FETCH: VENTAS
  // ====================
  const fetchVentas = async () => {
    const { data, error } = await supabase
      .from("ventas")
      .select(
        `
        id,
        lote_id,
        fecha,
        libras,
        precio_libra,
        proveedor_nombre,
        vendedor_nombre
      `
      )
      .order("fecha", { ascending: false });

    if (error) {
      console.error("Error cargando ventas:", error);
      setVentas([]);
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

  // ====================
  // FETCH: PROVEEDORES
  // ====================
  const fetchProveedores = async () => {
    const { data, error } = await supabase
      .from("proveedores")
      .select("id, nombre, contacto, telefono, email, activo")
      .order("nombre");

    if (error) {
      console.error("Error cargando proveedores:", error);
      return;
    }

    setProveedores(
      (data ?? []).map((p: any) => ({
        id: p.id,
        nombre: p.nombre,
        contacto: p.contacto ?? "",
        telefono: p.telefono ?? "",
        email: p.email ?? "",
        activo: p.activo ?? true,
      }))
    );
  };

  // ====================
  // FETCH: PESCADORES
  // ====================
  const fetchPescadores = async () => {
    const { data, error } = await supabase
      .from("pescadores")
      .select("id, nombre, telefono, especialidad, activo")
      .order("nombre");

    if (error) {
      console.error("Error cargando pescadores:", error);
      return;
    }

    setPescadores(
      (data ?? []).map((p: any) => ({
        id: p.id,
        nombre: p.nombre,
        telefono: p.telefono ?? "",
        especialidad: p.especialidad ?? "",
        activo: p.activo ?? true,
      }))
    );
  };

  // ====================
  // FETCH: VENDEDORES
  // ====================
  const fetchVendedores = async () => {
    const { data, error } = await supabase
      .from("vendedores")
      .select("id, nombre, telefono, email, activo")
      .order("nombre");

    if (error) {
      console.error("Error cargando vendedores:", error);
      return;
    }

    setVendedores(
      (data ?? []).map((v: any) => ({
        id: v.id,
        nombre: v.nombre,
        telefono: v.telefono ?? "",
        email: v.email ?? "",
        activo: v.activo ?? true,
      }))
    );
  };

  // ====================
  // FETCH: USUARIOS (tabla users)
  // ====================
  const fetchUsuarios = async () => {
    const { data, error } = await supabase
      .from("users")
      .select("id, name, username, email, role, active")
      .order("name");

    if (error) {
      console.error("Error cargando usuarios:", error);
      return;
    }

    setUsuarios(
      (data ?? []).map((u: any) => ({
        id: u.id,
        nombre: u.name,
        username: u.username,
        email: u.email ?? "",
        password: "",
        rol: u.role as UserRole,
        activo: u.active ?? true,
      }))
    );
  };
  // FETCH COSECHAS
  // ====================
  const fetchCosechas = async () => {
  const { data, error } = await supabase
    .from("cosechas")
    .select("id, lote_id, fecha, libras, pescador_nombre")
    .order("fecha", { ascending: false });

  if (error) {
    console.error("Error cargando cosechas:", error);
    return;
  }

  const mapped: Cosecha[] = (data ?? []).map((row: any) => ({
    id: row.id,
    loteId: row.lote_id,
    fecha: row.fecha,
    libras: Number(row.libras) || 0,
    pescador: row.pescador_nombre ?? "",
  }));

  setCosechas(mapped);
};

  // ====================
  // FETCH ALL
  // ====================
  const fetchAll = async () => {
    await Promise.all([
      fetchLotes(),
      fetchVentas(),
      fetchProveedores(),
      fetchPescadores(),
      fetchVendedores(),
      fetchUsuarios(),
      fetchCosechas(), // ← NECESARIO
    ]);

  };

  // ====================
  // REALTIME
  // ====================
  useEffect(() => {
    fetchAll();

    const tables = [
      "lotes",
      "ventas",
      "cosechas",
      "proveedores",
      "pescadores",
      "vendedores",
      "users",
    ];

    const channels = tables.map((table) =>
      supabase
        .channel(`realtime:${table}`)
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table },
          () => {
            switch (table) {
              case "lotes":
                fetchLotes();
                break;
              case "ventas":
                fetchVentas();
                fetchLotes(); // para refrescar totales de la vista
                break;
              case "cosechas":
                  fetchCosechas();
                fetchLotes();
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
              case "users":
                fetchUsuarios();
                break;
            }
          }
        )
        .subscribe()
    );

    return () => {
      channels.forEach((ch) => supabase.removeChannel(ch));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ====================
  // AUTH
  // ====================
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

  // ====================
  // CRUD LOTES
  // ====================
  const handleCreateLote = async (loteData: {
    nombre: string;
    fecha_inicio: string;
    fecha_estimada_pesca: string;
    tipo_camaron: string;
    estado: EstadoLote;
    costo_produccion: number;
  }) => {
    const { error } = await supabase.from("lotes").insert({
      nombre: loteData.nombre,
      fecha_inicio: loteData.fecha_inicio,
      fecha_estimada_pesca: loteData.fecha_estimada_pesca,
      tipo_camaron: loteData.tipo_camaron,
      estado: loteData.estado,
      costo_produccion: loteData.costo_produccion,
    });

    if (error) {
      alert("Error creando lote: " + error.message);
      return;
    }

    setShowLoteForm(false);
  };

  const handleUpdateLoteEstado = async (
    loteId: string,
    nuevoEstado: EstadoLote
  ) => {
    const { error } = await supabase
      .from("lotes")
      .update({ estado: nuevoEstado })
      .eq("id", loteId);

    if (error) {
      alert("Error actualizando estado del lote: " + error.message);
      return;
    }

    setLotes((prev) =>
      prev.map((l) => (l.id === loteId ? { ...l, estado: nuevoEstado } : l))
    );
  };

  const handleUpdateFechaPesca = async (loteId: string, nuevaFecha: string) => {
    const { error } = await supabase
      .from("lotes")
      .update({ fecha_estimada_pesca: nuevaFecha })
      .eq("id", loteId);

    if (error) {
      alert("Error actualizando fecha estimada de pesca: " + error.message);
      return;
    }

    setLotes((prev) =>
      prev.map((l) =>
        l.id === loteId ? { ...l, fecha_estimada_pesca: nuevaFecha } : l
      )
    );
  };

  // ====================
  // COSECHAS (inserta en tabla cosechas)
  // ====================
  const handleRegistrarCosecha = async (cosechaData: Omit<Cosecha, "id">) => {
    const pescadorEncontrado = pescadores.find(
      (p) => p.nombre === cosechaData.pescador
    );

    const { data, error } = await supabase
      .from("cosechas")
      .insert({
        lote_id: cosechaData.loteId,
        fecha: cosechaData.fecha,
        libras: cosechaData.libras,
        pescador_id: pescadorEncontrado?.id ?? null,
        pescador_nombre: cosechaData.pescador,
      })
      .select()
      .single();

    if (error) {
      alert("Error registrando cosecha: " + error.message);
      return;
    }

    // marcar lote como En Venta
    await supabase
      .from("lotes")
      .update({ estado: "En Venta" })
      .eq("id", cosechaData.loteId);

    setCosechas((prev) => [
      ...prev,
      {
        ...cosechaData,
        id: data?.id ?? `C-${String(prev.length + 1).padStart(3, "0")}`,
      },
    ]);
  };

  // ====================
  // VENTAS
  // ====================
  const handleRegistrarVenta = async (ventaData: Omit<Venta, "id">) => {
    const proveedorEncontrado = proveedores.find(
      (p) => p.nombre === ventaData.proveedor
    );
    const vendedorEncontrado = vendedores.find(
      (v) => v.nombre === ventaData.vendedor
    );

    const { error } = await supabase.from("ventas").insert({
      lote_id: ventaData.loteId,
      fecha: ventaData.fecha,
      libras: ventaData.libras,
      precio_libra: ventaData.precioLibra,
      proveedor_id: proveedorEncontrado?.id ?? null,
      proveedor_nombre: ventaData.proveedor,
      vendedor_id: vendedorEncontrado?.id ?? null,
      vendedor_nombre: ventaData.vendedor,
    });

    if (error) {
      alert("Error registrando venta: " + error.message);
      return;
    }

    await fetchVentas();
    await fetchLotes();
  };

  // ====================
  // CRUD Proveedor / Pescador / Vendedor
  // ====================
  const handleCreateProveedor = async (proveedorData: Omit<Proveedor, "id">) => {
    await supabase.from("proveedores").insert({
      nombre: proveedorData.nombre,
      contacto: proveedorData.contacto,
      telefono: proveedorData.telefono,
      email: proveedorData.email,
      activo: proveedorData.activo,
    });
  };

  const handleUpdateProveedor = async (
    id: string,
    proveedorData: Omit<Proveedor, "id">
  ) => {
    await supabase.from("proveedores").update(proveedorData).eq("id", id);
  };

  const handleDeleteProveedor = async (id: string) => {
    await supabase.from("proveedores").delete().eq("id", id);
  };

  const handleCreatePescador = async (pescadorData: Omit<Pescador, "id">) => {
    await supabase.from("pescadores").insert(pescadorData);
  };

  const handleUpdatePescador = async (
    id: string,
    pescadorData: Omit<Pescador, "id">
  ) => {
    await supabase.from("pescadores").update(pescadorData).eq("id", id);
  };

  const handleDeletePescador = async (id: string) => {
    await supabase.from("pescadores").delete().eq("id", id);
  };

  const handleCreateVendedor = async (vendedorData: Omit<Vendedor, "id">) => {
    await supabase.from("vendedores").insert(vendedorData);
  };

  const handleUpdateVendedor = async (
    id: string,
    vendedorData: Omit<Vendedor, "id">
  ) => {
    await supabase.from("vendedores").update(vendedorData).eq("id", id);
  };

  const handleDeleteVendedor = async (id: string) => {
    await supabase.from("vendedores").delete().eq("id", id);
  };

  // ====================
  // CRUD USUARIOS (tabla users)
  // ====================
  const handleCreateUsuario = async (data: Omit<Usuario, "id">) => {
    const { error } = await supabase.from("users").insert({
      name: data.nombre,
      username: data.username,
      email: data.email ?? "",
      password: data.password,
      role: data.rol,
      active: data.activo,
    });

    if (error) {
      alert("Error creando usuario: " + error.message);
      return;
    }

    fetchUsuarios();
  };

  const handleUpdateUsuario = async (
    id: string,
    data: Omit<Usuario, "id">
  ) => {
    const { error } = await supabase
      .from("users")
      .update({
        name: data.nombre,
        username: data.username,
        email: data.email ?? "",
        password: data.password,
        role: data.rol,
        active: data.activo,
      })
      .eq("id", id);

    if (error) {
      alert("Error actualizando usuario: " + error.message);
      return;
    }

    fetchUsuarios();
  };

  const handleDeleteUsuario = async (id: string) => {
    const { error } = await supabase.from("users").delete().eq("id", id);

    if (error) {
      alert("Error eliminando usuario: " + error.message);
      return;
    }

    fetchUsuarios();
  };

  // ====================
  // UI LOGIN
  // ====================
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

  // ====================
  // UI PARA PESCADOR
  // ====================
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
              onSubmit={handleRegistrarCosecha}
              pescadores={pescadores.filter((p) => p.activo)}
              pescadorNombre={currentUser.nombre}
            />
          </div>
        </main>
      </div>
    );
  }

  // ====================
  // UI GENERAL
  // ====================
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-teal-50">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
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
                      {lotes.map((lote) => (
                        <SelectItem key={lote.id} value={lote.id}>
                          {lote.id} - {lote.nombre}
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
                    ventas={ventas.filter(
                      (v) => v.loteId === selectedLote.id
                    )}
                    cosechas={cosechas.filter(
                      (c) => c.loteId === selectedLote.id
                    )}
                    userRole={currentUser.rol}
                    onUpdateEstado={handleUpdateLoteEstado}
                    onUpdateFechaPesca={handleUpdateFechaPesca}
                  />
                ) : (
                  <div className="bg-white rounded-lg shadow p-8 text-center">
                    <p className="text-gray-600">
                      Selecciona un lote para ver su dashboard
                    </p>
                  </div>
                )}
              </TabsContent>

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
                          <Button className="bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700">
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

          {currentUser.rol === "Propietario" && (
            <TabsContent value="cosecha">
              <div className="max-w-2xl mx-auto">
                <CosechaForm
                  lotes={lotes.filter((l) => l.estado === "Listo para Pescar")}
                  onSubmit={handleRegistrarCosecha}
                  pescadores={pescadores.filter((p) => p.activo)}
                  pescadorNombre={currentUser.nombre}
                />
              </div>
            </TabsContent>
          )}

          {(currentUser.rol === "Vendedor" ||
            currentUser.rol === "Propietario" ||
            currentUser.rol === "Administrador") && (
            <TabsContent value="venta">
              <div className="max-w-2xl mx-auto">
                <VentaForm
                  lotes={lotes.filter(
                    (l) =>
                      l.estado === "En Venta" &&
                      l.libras_cosechadas - l.libras_vendidas > 0
                  )}
                  onSubmit={handleRegistrarVenta}
                  proveedores={proveedores.filter((p) => p.activo)}
                  vendedores={vendedores.filter((v) => v.activo)}
                  vendedorNombre={currentUser.nombre}
                  onCreateProveedor={handleCreateProveedor}
                />
              </div>
            </TabsContent>
          )}

          {(currentUser.rol === "Propietario" ||
            currentUser.rol === "Administrador") && (
            <TabsContent value="administracion">
              <AdministracionPanel
                proveedores={proveedores}
                pescadores={pescadores}
                vendedores={vendedores}
                usuarios={usuarios}
                onCreateProveedor={handleCreateProveedor}
                onUpdateProveedor={handleUpdateProveedor}
                onDeleteProveedor={handleDeleteProveedor}
                onCreatePescador={handleCreatePescador}
                onUpdatePescador={handleUpdatePescador}
                onDeletePescador={handleDeletePescador}
                onCreateVendedor={handleCreateVendedor}
                onUpdateVendedor={handleUpdateVendedor}
                onDeleteVendedor={handleDeleteVendedor}
                onCreateUsuario={handleCreateUsuario}
                onUpdateUsuario={handleUpdateUsuario}
                onDeleteUsuario={handleDeleteUsuario}
                userRole={currentUser.rol}
              />
            </TabsContent>
          )}
        </Tabs>
      </main>
    </div>
  );
}
