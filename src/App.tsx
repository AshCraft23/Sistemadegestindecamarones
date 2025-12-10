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

// Nuevo Lote FINAL (vista + tabla real)
export interface Lote {
  id: string;
  nombre: string;
  fecha_inicio: string;
  fecha_estimada_pesca: string;
  tipo_camaron: string;
  estado: EstadoLote;
  costo_produccion: number;

  // Vista
  libras_cosechadas: number;
  libras_vendidas: number;
  ingresos_totales: number;
  libras_en_inventario: number;

  pescador_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Cosecha {
  id: string;
  lote_id: string;
  fecha: string;
  libras: number;
  pescador: string;
}

export interface Venta {
  id: string;
  lote_id: string;
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

export default function App() {
  const [currentUser, setCurrentUser] = useState<Usuario | null>(null);

  const [lotes, setLotes] = useState<Lote[]>([]);
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [pescadores, setPescadores] = useState<Pescador[]>([]);
  const [vendedores, setVendedores] = useState<Vendedor[]>([]);

  const [selectedLoteId, setSelectedLoteId] = useState<string | null>(null);
  const [showLoteForm, setShowLoteForm] = useState(false);

  const selectedLote = lotes.find((l) => l.id === selectedLoteId);

  // ====================
  // FETCH LOTES DESDE LA VISTA
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

    setLotes(data ?? []);

    if (!selectedLoteId && data && data.length > 0) {
      setSelectedLoteId(data[0].id);
    }
  };

  // ====================
  // FETCH VENTAS
  // ====================
  const fetchVentas = async () => {
    const { data } = await supabase
      .from("ventas")
      .select("*")
      .order("fecha", { ascending: false });

    setVentas(data ?? []);
  };

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

    const tables = ["lotes", "cosechas", "ventas"];

    const channels = tables.map((table) =>
      supabase
        .channel(`rt_${table}`)
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table },
          () => fetchLotes()
        )
        .subscribe()
    );

    return () => channels.forEach((c) => supabase.removeChannel(c));
  }, []);

  // ====================
  // LOGIN
  // ====================
  const handleLogin = (user: Usuario) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setSelectedLoteId(null);
  };

  // ====================
  // CREAR LOTE (snake_case)
  // ====================

  const handleCreateLote = async (form: {
    nombre: string;
    fecha_inicio: string;
    fecha_estimada_pesca: string;
    tipo_camaron: string;
    estado: EstadoLote;
    costo_produccion: number;
  }) => {
    const { error } = await supabase.from("lotes").insert({
      nombre: form.nombre,
      fecha_inicio: form.fecha_inicio,
      fecha_estimada_pesca: form.fecha_estimada_pesca,
      tipo_camaron: form.tipo_camaron,
      estado: form.estado,
      costo_produccion: form.costo_produccion,
    });

    if (error) {
      alert("Error creando lote: " + error.message);
      return;
    }

    setShowLoteForm(false);
  };

  // ====================
  // UI LOGIN
  // ====================

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoginForm onLogin={handleLogin} />
      </div>
    );
  }

  // ====================
  // UI GENERAL
  // ====================

  return (
    <div className="min-h-screen">
      <header className="bg-white shadow">
        <div className="p-4 flex justify-between items-center">
          <h2>GELCA</h2>

          <div className="flex gap-4">
            <Select value={selectedLoteId || ""} onValueChange={setSelectedLoteId}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Seleccionar lote" />
              </SelectTrigger>
              <SelectContent>
                {lotes.map((lote) => (
                  <SelectItem key={lote.id} value={lote.id}>
                    {lote.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="size-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </header>

      <main className="p-6">
        <Tabs defaultValue="dashboard">
          <TabsList>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="lotes">Lotes</TabsTrigger>
            <TabsTrigger value="venta">Venta</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            {selectedLote ? (
              <Dashboard lote={selectedLote} ventas={ventas.filter(v => v.lote_id === selectedLote.id)} />
            ) : (
              <p>Selecciona un lote.</p>
            )}
          </TabsContent>

          <TabsContent value="lotes">
            <div className="flex justify-end mb-4">
              <Dialog open={showLoteForm} onOpenChange={setShowLoteForm}>
                <DialogTrigger asChild>
                  <Button>Nuevo Lote</Button>
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
            <VentaForm
              lotes={lotes.filter(l => l.libras_en_inventario > 0)}
              vendedores={vendedores}
              proveedores={proveedores}
              vendedorNombre={currentUser.nombre}
              onSubmit={() => {}}
              onCreateProveedor={() => {}}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
