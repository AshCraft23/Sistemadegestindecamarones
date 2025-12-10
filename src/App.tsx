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

// =====================
//  TIPOS
// =====================
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

  // Campos provenientes de la vista
  costo_produccion: number;
  libras_cosechadas: number;
  libras_vendidas: number;
  ingresos_totales: number;
  libras_en_inventario: number;
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

// ============================================
// COMPONENTE PRINCIPAL
// ============================================
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

  // ============================
  // CARGAR LOTES DESDE LA VISTA
  // ============================
  const fetchLotes = async () => {
    const { data, error } = await supabase
      .from("lotes_dashboard_view")
      .select("*")
      .order("fecha_inicio", { ascending: false });

    if (error) {
      console.error("Error al cargar lotes:", error);
      return;
    }

    const mapped: Lote[] = data?.map((row: any) => ({
      id: row.id,
      nombre: row.nombre,
      fecha_inicio: row.fecha_inicio,
      fecha_estimada_pesca: row.fecha_estimada_pesca,
      tipo_camaron: row.tipo_camaron,
      estado: row.estado,

      costo_produccion: row.costo_produccion ?? 0,

      libras_cosechadas: row.libras_cosechadas ?? 0,
      libras_vendidas: row.libras_vendidas ?? 0,
      ingresos_totales: row.ingresos_totales ?? 0,
      libras_en_inventario: row.libras_en_inventario ?? 0,
    })) ?? [];

    setLotes(mapped);

    if (!selectedLoteId && mapped.length > 0) {
      setSelectedLoteId(mapped[0].id);
    }
  };

  // ============================
  // CARGAR VENTAS
  // ============================
  const fetchVentas = async () => {
    const { data, error } = await supabase
      .from("ventas")
      .select("*")
      .order("fecha", { ascending: false });

    if (error) return console.error(error);

    setVentas(
      (data ?? []).map((v: any) => ({
        id: v.id,
        loteId: v.lote_id,
        fecha: v.fecha,
        libras: v.libras,
        precioLibra: v.precio_libra,
        proveedor: v.proveedor_nombre,
        vendedor: v.vendedor_nombre,
      }))
    );
  };

  // ============================
  // CARGAR TABLAS BÁSICAS
  // ============================
  const fetchProveedores = async () => {
    const { data } = await supabase.from("proveedores").select("*");
    setProveedores(data ?? []);
  };

  const fetchPescadores = async () => {
    const { data } = await supabase.from("pescadores").select("*");
    setPescadores(data ?? []);
  };

  const fetchVendedores = async () => {
    const { data } = await supabase.from("vendedores").select("*");
    setVendedores(data ?? []);
  };

  // ============================
  // CARGA TOTAL
  // ============================
  const fetchAll = async () => {
    await Promise.all([
      fetchLotes(),
      fetchVentas(),
      fetchProveedores(),
      fetchPescadores(),
      fetchVendedores(),
    ]);
  };

  // ============================
  // REALTIME
  // ============================
  useEffect(() => {
    fetchAll();

    const tables = ["lotes", "ventas", "proveedores", "pescadores", "vendedores"];

    const channels = tables.map((table) =>
      supabase
        .channel("rt:" + table)
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table },
          () => fetchAll()
        )
        .subscribe()
    );

    return () => channels.forEach((ch) => supabase.removeChannel(ch));
  }, []);

  // ============================
  // LOGIN / LOGOUT
  // ============================
  const handleLogin = (user: Usuario) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setSelectedLoteId(null);
  };

  // ============================
  // CREAR LOTE (OK)
  // ============================
  const handleCreateLote = async (payload: {
    nombre: string;
    fecha_inicio: string;
    fecha_estimada_pesca: string;
    tipo_camaron: string;
    estado: EstadoLote;
    costo_produccion: number;
  }) => {
    const { error } = await supabase.from("lotes").insert(payload);

    if (error) {
      alert("Error creando lote:" + error.message);
      return;
    }

    setShowLoteForm(false);
  };

  // ============================
  // CAMBIAR ESTADO DEL LOTE
  // ============================
  const handleUpdateLoteEstado = async (id: string, estado: EstadoLote) => {
    await supabase.from("lotes").update({ estado }).eq("id", id);
  };

  // ============================
  // CAMBIAR FECHA PESCA
  // ============================
  const handleUpdateFechaPesca = async (id: string, fecha: string) => {
    await supabase
      .from("lotes")
      .update({ fecha_estimada_pesca: fecha })
      .eq("id", id);
  };

  // ============================
  // REGISTRAR COSECHA
  // ============================
  const handleRegistrarCosecha = async (c: Omit<Cosecha, "id">) => {
    const { error } = await supabase.from("cosechas").insert({
      lote_id: c.loteId,
      fecha: c.fecha,
      libras: c.libras,
      pescador: c.pescador,
    });

    if (error) alert(error.message);
  };

  // ============================
  // REGISTRAR VENTA
  // ============================
  const handleRegistrarVenta = async (v: Omit<Venta, "id">) => {
    const prov = proveedores.find((p) => p.nombre === v.proveedor);
    const vend = vendedores.find((p) => p.nombre === v.vendedor);

    await supabase.from("ventas").insert({
      lote_id: v.loteId,
      fecha: v.fecha,
      libras: v.libras,
      precio_libra: v.precioLibra,
      proveedor_id: prov?.id ?? null,
      proveedor_nombre: v.proveedor,
      vendedor_id: vend?.id ?? null,
      vendedor_nombre: v.vendedor,
    });
  };

  // =============================
  // PANTALLA DE LOGIN
  // =============================
  if (!currentUser) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <LoginForm onLogin={handleLogin} />
      </div>
    );
  }

  // =============================
  // UI PARA PESCADOR
  // =============================
  if (currentUser.rol === "Pescador") {
    return (
      <>
        <header className="p-4 bg-white shadow">
          <Button onClick={handleLogout}>Cerrar Sesión</Button>
        </header>

        <main className="p-6">
          <CosechaForm
            lotes={lotes.filter((l) => l.estado === "Listo para Pescar")}
            pescadores={pescadores}
            pescadorNombre={currentUser.nombre}
            onSubmit={handleRegistrarCosecha}
          />
        </main>
      </>
    );
  }

  // =============================
  // UI GENERAL
  // =============================
  return (
    <div>
      <header className="p-4 bg-white shadow flex justify-between">
        <div>
          <h1>GELCA</h1>
          <p>{currentUser.nombre} - {currentUser.rol}</p>
        </div>

        {currentUser.rol !== "Vendedor" && (
          <Select value={selectedLoteId ?? ""} onValueChange={setSelectedLoteId}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Seleccionar lote" />
            </SelectTrigger>
            <SelectContent>
              {lotes.map((l) => (
                <SelectItem key={l.id} value={l.id}>
                  {l.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <Button onClick={handleLogout}>Cerrar Sesión</Button>
      </header>

      <main className="container mx-auto p-6">
        <Tabs defaultValue="dashboard">
          <TabsList>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="lotes">Lotes</TabsTrigger>

            {currentUser.rol !== "Vendedor" && (
              <TabsTrigger value="cosecha">Registrar Cosecha</TabsTrigger>
            )}

            {(currentUser.rol !== "Pescador") && (
              <TabsTrigger value="venta">Registrar Venta</TabsTrigger>
            )}

            {currentUser.rol === "Administrador" && (
              <TabsTrigger value="admin">Administración</TabsTrigger>
            )}
          </TabsList>

          {/* DASHBOARD */}
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
              <p className="text-center text-gray-500">Selecciona un lote</p>
            )}
          </TabsContent>

          {/* LOTES */}
          <TabsContent value="lotes">
            <div className="flex justify-end mb-4">
              <Dialog open={showLoteForm} onOpenChange={setShowLoteForm}>
                <DialogTrigger asChild>
                  <Button>Crear lote</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Crear lote</DialogTitle>
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

          {/* COSECHA */}
          <TabsContent value="cosecha">
            <CosechaForm
              lotes={lotes}
              pescadores={pescadores}
              pescadorNombre={currentUser.nombre}
              onSubmit={handleRegistrarCosecha}
            />
          </TabsContent>

          {/* VENTA */}
          <TabsContent value="venta">
            <VentaForm
              lotes={lotes.filter((l) => l.libras_en_inventario > 0)}
              proveedores={proveedores}
              vendedores={vendedores}
              vendedorNombre={currentUser.nombre}
              onSubmit={handleRegistrarVenta}
              onCreateProveedor={async (p) =>
                await supabase.from("proveedores").insert(p)
              }
            />
          </TabsContent>

          {/* ADMIN */}
          <TabsContent value="admin">
            <AdministracionPanel
              proveedores={proveedores}
              pescadores={pescadores}
              vendedores={vendedores}
              onCreateProveedor={async (p) =>
                await supabase.from("proveedores").insert(p)
              }
              onUpdateProveedor={(id, p) =>
                supabase.from("proveedores").update(p).eq("id", id)
              }
              onDeleteProveedor={(id) =>
                supabase.from("proveedores").delete().eq("id", id)
              }
              onCreatePescador={(p) =>
                supabase.from("pescadores").insert(p)
              }
              onUpdatePescador={(id, p) =>
                supabase.from("pescadores").update(p).eq("id", id)
              }
              onDeletePescador={(id) =>
                supabase.from("pescadores").delete().eq("id", id)
              }
              onCreateVendedor={(v) =>
                supabase.from("vendedores").insert(v)
              }
              onUpdateVendedor={(id, v) =>
                supabase.from("vendedores").update(v).eq("id", id)
              }
              onDeleteVendedor={(id) =>
                supabase.from("vendedores").delete().eq("id", id)
              }
              userRole={currentUser.rol}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
