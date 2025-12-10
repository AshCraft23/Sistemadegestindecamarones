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
// TIPOS
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
  email?: string;
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
  costo_produccion: number;

  libras_cosechadas: number;
  libras_vendidas: number;
  ingresos_totales: number;
}

export interface Cosecha {
  id: string;
  loteId: string;
  fecha: string;
  libras: number;
  pescador_id: string;
  pescador_nombre: string;
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


// ====================
// APP
// ====================
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
  // FETCH: LOTES
  // ====================
  const fetchLotes = async () => {
    const { data, error } = await supabase
      .from("lotes_dashboard_view")
      .select("*")
      .order("fecha_inicio", { ascending: false });

    if (error) return;

    setLotes(
      (data ?? []).map((row: any) => ({
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
      }))
    );
  };


  // ====================
  // FETCH: COSECHAS (CORREGIDO)
  // ====================
  const fetchCosechas = async () => {
    const { data, error } = await supabase
      .from("cosechas")
      .select("id, lote_id, fecha, libras, pescador_id, pescador_nombre")
      .order("fecha", { ascending: false });

    if (error) return;

    setCosechas(
      (data ?? []).map((row: any) => ({
        id: row.id,
        loteId: row.lote_id,
        fecha: row.fecha,
        libras: Number(row.libras),
        pescador_id: row.pescador_id,
        pescador_nombre: row.pescador_nombre ?? "",
      }))
    );
  };


  // ====================
  // FETCH: VENTAS
  // ====================
  const fetchVentas = async () => {
    const { data, error } = await supabase
      .from("ventas")
      .select("id, lote_id, fecha, libras, precio_libra, proveedor_nombre, vendedor_nombre")
      .order("fecha", { ascending: false });

    if (error) return;

    setVentas(
      (data ?? []).map((row: any) => ({
        id: row.id,
        loteId: row.lote_id,
        fecha: row.fecha,
        libras: Number(row.libras),
        precioLibra: Number(row.precio_libra),
        proveedor: row.proveedor_nombre ?? "",
        vendedor: row.vendedor_nombre ?? "",
      }))
    );
  };


  // ====================
  // FETCH MISC
  // ====================
  const fetchProveedores = async () => {
    const { data } = await supabase
      .from("proveedores")
      .select("*")
      .order("nombre");

    setProveedores(data ?? []);
  };

  const fetchPescadores = async () => {
    const { data } = await supabase
      .from("pescadores")
      .select("*")
      .order("nombre");

    setPescadores(data ?? []);
  };

  const fetchVendedores = async () => {
    const { data } = await supabase
      .from("vendedores")
      .select("*")
      .order("nombre");

    setVendedores(data ?? []);
  };

  const fetchUsuarios = async () => {
    const { data } = await supabase
      .from("users")
      .select("*")
      .order("name");

    setUsuarios(
      (data ?? []).map((u: any) => ({
        id: u.id,
        nombre: u.name,
        username: u.username,
        email: u.email ?? "",
        password: "",
        rol: u.role,
        activo: u.active,
      }))
    );
  };


  // ====================
  // FETCH ALL
  // ====================
  const fetchAll = async () => {
    await Promise.all([
      fetchLotes(),
      fetchCosechas(),
      fetchVentas(),
      fetchProveedores(),
      fetchPescadores(),
      fetchVendedores(),
      fetchUsuarios(),
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
          () => fetchAll()
        )
        .subscribe()
    );

    return () => {
      channels.forEach((ch) => supabase.removeChannel(ch));
    };
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
  // REGISTRAR COSECHA (CORREGIDO COMPLETO)
  // ====================
  const handleRegistrarCosecha = async (cosechaData: {
    loteId: string;
    fecha: string;
    libras: number;
    pescador_id: string;
  }) => {

    const pescador = pescadores.find(p => p.id === cosechaData.pescador_id);

    const { data, error } = await supabase
      .from("cosechas")
      .insert({
        lote_id: cosechaData.loteId,
        fecha: cosechaData.fecha,
        libras: cosechaData.libras,
        pescador_id: cosechaData.pescador_id,
        pescador_nombre: pescador?.nombre ?? null,
      })
      .select()
      .single();

    if (error) {
      alert("Error registrando cosecha: " + error.message);
      return;
    }

    await supabase
      .from("lotes")
      .update({ estado: "En Venta" })
      .eq("id", cosechaData.loteId);

    setCosechas(prev => [
      ...prev,
      {
        id: data.id,
        loteId: cosechaData.loteId,
        fecha: cosechaData.fecha,
        libras: cosechaData.libras,
        pescador_id: cosechaData.pescador_id,
        pescador_nombre: pescador?.nombre ?? "",
      }
    ]);
  };


  // ====================
  // UI LOGIN
  // ====================
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
        <LoginForm onLogin={handleLogin} />
      </div>
    );
  }


  // ====================
  // UI PESCADOR
  // ====================
  if (currentUser.rol === "Pescador") {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <CosechaForm
          lotes={lotes.filter(l => l.estado === "Listo para Pescar")}
          pescadores={pescadores}
          pescadorId={currentUser.id}
          onSubmit={handleRegistrarCosecha}
        />
      </div>
    );
  }


  // ====================
  // UI GENERAL
  // ====================
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-teal-50">

      {/* HEADER */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Waves className="size-7 text-cyan-600" />
            <div>
              <h1 className="text-cyan-900 font-bold">Sistema GELCA</h1>
              <p className="text-gray-600 text-sm">{currentUser.nombre} - {currentUser.rol}</p>
            </div>
          </div>

          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 size-4" />
            Cerrar Sesión
          </Button>
        </div>
      </header>


      {/* MAIN */}
      <main className="container mx-auto px-4 py-8">

        <Tabs defaultValue="dashboard" className="space-y-6">

          <TabsList className="bg-white">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="cosecha">Registrar Cosecha</TabsTrigger>
            <TabsTrigger value="lotes">Gestión de Lotes</TabsTrigger>
          </TabsList>


          {/* DASHBOARD */}
          <TabsContent value="dashboard">
            {selectedLote ? (
              <Dashboard
                lote={selectedLote}
                ventas={ventas.filter(v => v.loteId === selectedLote.id)}
                cosechas={cosechas.filter(c => c.loteId === selectedLote.id)}
                userRole={currentUser.rol}
              />
            ) : (
              <div className="bg-white p-8 rounded shadow text-center">
                Selecciona un lote para ver su dashboard.
              </div>
            )}
          </TabsContent>


          {/* REGISTRAR COSECHA */}
          <TabsContent value="cosecha">
            <div className="max-w-2xl mx-auto">
              <CosechaForm
                lotes={lotes.filter(l => l.estado === "Listo para Pescar")}
                pescadores={pescadores}
                pescadorId={currentUser.id}
                onSubmit={handleRegistrarCosecha}
              />
            </div>
          </TabsContent>


          {/* LOTES */}
          <TabsContent value="lotes">
            <div className="space-y-4">

              <div className="flex justify-end">
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

                    <LoteForm
                      onSubmit={async (data) => {
                        await supabase.from("lotes").insert(data);
                        setShowLoteForm(false);
                      }}
                    />
                  </DialogContent>
                </Dialog>
              </div>

              <LotesList
                lotes={lotes}
                selectedLoteId={selectedLoteId}
                onSelectLote={setSelectedLoteId}
              />

            </div>
          </TabsContent>

        </Tabs>

      </main>
    </div>
  );
}
