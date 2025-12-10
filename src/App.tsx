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

  // ====================
  // FETCH: LOTES
  // ====================
  const fetchLotes = async () => {
    const { data, error } = await supabase
      .from("lotes")
      .select(
        "id, nombre, fecha_inicio, fecha_estimada_pesca, tipo_camaron, estado, libras_cosechadas, libras_vendidas, costo_produccion, ingresos_totales"
      )
      .order("fecha_inicio", { ascending: false });

    if (error) {
      console.error("Error cargando lotes:", error);
      return;
    }

    const mapped: Lote[] =
      data?.map((row: any) => ({
        id: row.id,
        nombre: row.nombre,
        fechaInicio: row.fecha_inicio,
        fechaEstimadaPesca: row.fecha_estimada_pesca,
        tipoCamaron: row.tipo_camaron,
        estado: row.estado as EstadoLote,
        librasCosechadas: row.libras_cosechadas ?? 0,
        librasVendidas: row.libras_vendidas ?? 0,
        costoProduccion: row.costo_produccion ?? 0,
        ingresosTotales: row.ingresos_totales ?? 0,
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
        libras: row.libras ?? 0,
        precioLibra: row.precio_libra ?? 0,
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
  // FETCH ALL
  // ====================
  const fetchAll = async () => {
    await Promise.all([
      fetchLotes(),
      fetchVentas(),
      fetchProveedores(),
      fetchPescadores(),
      fetchVendedores(),
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
      "proveedores",
      "pescadores",
      "vendedores",
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
          }
        )
        .subscribe()
    );

    return () => {
      channels.forEach((ch) => supabase.removeChannel(ch));
    };
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
  const handleCreateLote = async (
    loteData: Omit<
      Lote,
      "id" | "librasCosechadas" | "librasVendidas" | "ingresosTotales"
    >
  ) => {
    const { error } = await supabase.from("lotes").insert({
      nombre: loteData.nombre,
      fecha_inicio: loteData.fechaInicio,
      fecha_estimada_pesca: loteData.fechaEstimadaPesca,
      tipo_camaron: loteData.tipoCamaron,
      estado: loteData.estado,
      libras_cosechadas: 0,
      libras_vendidas: 0,
      costo_produccion: loteData.costoProduccion,
      ingresos_totales: 0,
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
        l.id === loteId ? { ...l, fechaEstimadaPesca: nuevaFecha } : l
      )
    );
  };

  // ====================
  // COSECHAS (solo local + update BD)
  // ====================
  const handleRegistrarCosecha = async (cosechaData: Omit<Cosecha, "id">) => {
    const lote = lotes.find((l) => l.id === cosechaData.loteId);
    const nuevasLibras =
      (lote?.librasCosechadas ?? 0) + (cosechaData.libras ?? 0);

    const { error } = await supabase
      .from("lotes")
      .update({
        libras_cosechadas: nuevasLibras,
        estado: "En Venta",
      })
      .eq("id", cosechaData.loteId);

    if (error) {
      alert("Error actualizando lote después de la cosecha: " + error.message);
      return;
    }

    setLotes((prev) =>
      prev.map((l) =>
        l.id === cosechaData.loteId
          ? {
              ...l,
              librasCosechadas: nuevasLibras,
              estado: "En Venta",
            }
          : l
      )
    );
  };

  // ====================
  // VENTAS
  // ====================
  const handleRegistrarVenta = async (ventaData: Omit<Venta, "id">) => {
    const lote = lotes.find((l) => l.id === ventaData.loteId);
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

    // actualizar totales
    const nuevasLibrasVendidas =
      (lote?.librasVendidas ?? 0) + ventaData.libras;
    const nuevosIngresos =
      (lote?.ingresosTotales ?? 0) +
      ventaData.libras * ventaData.precioLibra;

    const { error: errorLote } = await supabase
      .from("lotes")
      .update({
        libras_vendidas: nuevasLibrasVendidas,
        ingresos_totales: nuevosIngresos,
      })
      .eq("id", ventaData.loteId);

    if (errorLote) {
      alert("Error actualizando lote después de la venta: " + errorLote.message);
      return;
    }

    setLotes((prev) =>
      prev.map((l) =>
        l.id === ventaData.loteId
          ? {
              ...l,
              librasVendidas: nuevasLibrasVendidas,
              ingresosTotales: nuevosIngresos,
            }
          : l
      )
    );
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
    await supabase
      .from("proveedores")
      .update(proveedorData)
      .eq("id", id);
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
              <TabsContent value="dashboard
                {selectedLote ? (
                  <Dashboard
                    lote={selectedLote}
                    ventas={ventas.filter((v) => v.loteId === selectedLote.id)}
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
                      l.librasCosechadas - l.librasVendidas > 0
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
          )}
        </Tabs>
      </main>
    </div>
  );
}
