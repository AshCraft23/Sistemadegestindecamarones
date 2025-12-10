import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { LoginForm } from "./components/LoginForm";
import { Dashboard } from "./components/Dashboard";
import { DashboardAnual } from "./components/DashboardAnual";
import { LoteForm } from "./components/LoteForm";
import { CosechaForm } from "./components/CosechaForm";
import { VentaForm } from "./components/VentaForm";
import { LotesList } from "./components/LotesList";
import { AdministracionPanel } from "./components/AdministracionPanel";
import { LogOut, Waves } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import { Button } from "./components/ui/button";
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

// ------------------------
// Tipos
// ------------------------
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
  password?: string;
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

  // campos que vienen de la vista (snake_case)
  libras_cosechadas: number;
  libras_vendidas: number;
  ingresos_totales: number;
}

export interface Cosecha {
  id?: string;
  loteId: string;
  fecha: string;
  libras: number;
  pescador?: string; // nombre
  pescador_id?: string | null;
}

export interface Venta {
  id?: string;
  loteId: string;
  fecha: string;
  libras: number;
  precioLibra: number;
  proveedor?: string;
  vendedor?: string;
}

export interface Proveedor {
  id: string;
  nombre: string;
  contacto?: string;
  telefono?: string;
  email?: string;
  activo?: boolean;
}

export interface Pescador {
  id: string;
  nombre: string;
  telefono?: string;
  especialidad?: string;
  activo?: boolean;
}

export interface Vendedor {
  id: string;
  nombre: string;
  telefono?: string;
  email?: string;
  activo?: boolean;
}

// ------------------------
// App component
// ------------------------
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

  const selectedLote = lotes.find((l) => l.id === selectedLoteId) || null;

  // ====================
  // FETCH: lotes (vista lotes_dashboard_view)
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

    const mapped: Lote[] =
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
      })) ?? [];

    setLotes(mapped);
    if (!selectedLoteId && mapped.length > 0) setSelectedLoteId(mapped[0].id);
  };

  // ====================
  // FETCH: cosechas
  // ====================
  const fetchCosechas = async () => {
    const { data, error } = await supabase
      .from("cosechas")
      .select("id, lote_id, fecha, libras, pescador_id, pescador_nombre")
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
      pescador_id: row.pescador_id ?? null,
    }));

    setCosechas(mapped);
  };

  // ====================
  // FETCH: ventas
  // ====================
  const fetchVentas = async () => {
    const { data, error } = await supabase
      .from("ventas")
      .select("id, lote_id, fecha, libras, precio_libra, proveedor_nombre, vendedor_nombre")
      .order("fecha", { ascending: false });

    if (error) {
      console.error("Error cargando ventas:", error);
      setVentas([]);
      return;
    }

    const mapped: Venta[] = (data ?? []).map((row: any) => ({
      id: row.id,
      loteId: row.lote_id,
      fecha: row.fecha,
      libras: Number(row.libras) || 0,
      precioLibra: Number(row.precio_libra) || 0,
      proveedor: row.proveedor_nombre ?? "",
      vendedor: row.vendedor_nombre ?? "",
    }));

    setVentas(mapped);
  };

  // ====================
  // FETCH: proveedores, pescadores, vendedores
  // ====================
  const fetchProveedores = async () => {
    const { data, error } = await supabase.from("proveedores").select("*").order("nombre");
    if (error) return console.error("Error proveedores:", error);
    setProveedores((data ?? []) as any);
  };
  const fetchPescadores = async () => {
    const { data, error } = await supabase
      .from("pescadores")
      .select("id, nombre, telefono, especialidad, activo")
      .order("nombre");
    if (error) return console.error("Error pescadores:", error);
    setPescadores((data ?? []) as any);
  };
  const fetchVendedores = async () => {
    const { data, error } = await supabase.from("vendedores").select("*").order("nombre");
    if (error) return console.error("Error vendedores:", error);
    setVendedores((data ?? []) as any);
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
      fetchCosechas(),
    ]);
  };

  useEffect(() => {
    fetchAll();

    // realtime (opcional)
    const tables = ["lotes", "ventas", "cosechas", "proveedores", "pescadores", "vendedores"];
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
              fetchLotes();
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
          }
        })
        .subscribe()
    );

    return () => {
      channels.forEach((c) => supabase.removeChannel(c));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ====================
  // Auth handlers (simples)
  // ====================
  const handleLogin = (user: Usuario) => {
    setCurrentUser(user);
    if (lotes.length > 0 && !selectedLoteId) setSelectedLoteId(lotes[0].id);
  };
  const handleLogout = () => {
    setCurrentUser(null);
    setSelectedLoteId(null);
  };

  // ====================
  // Registrar cosecha (AQUI: importante)
  // ====================
  const handleRegistrarCosecha = async (cosechaData: Omit<Cosecha, "id">) => {
    // si viene pescador_id (autenticado) usamos eso; si no, puede venir null y se selecciona en el form
    const pescador = pescadores.find((p) => p.id === cosechaData.pescador_id);
    const pescadorNombre = pescador ? pescador.nombre : cosechaData.pescador ?? null;

    const payload = {
      lote_id: cosechaData.loteId,
      fecha: cosechaData.fecha,
      libras: cosechaData.libras,
      pescador_id: cosechaData.pescador_id ?? null,
      pescador_nombre: pescadorNombre,
    };

    const { data, error } = await supabase.from("cosechas").insert(payload).select().single();

    if (error) {
      // LOG detallado para depurar (muy útil si la DB menciona columnas inexistentes)
      console.error("Error registrando cosecha:", error);
      alert("Error registrando cosecha: " + (error.message ?? JSON.stringify(error)));
      return;
    }

    // actualizar estado del lote a "En Venta"
    await supabase.from("lotes").update({ estado: "En Venta" }).eq("id", cosechaData.loteId);

    // refrescar datos
    await fetchCosechas();
    await fetchLotes();

    // actualizar estado local
    setCosechas((prev) => [
      ...prev,
      {
        id: data?.id,
        loteId: data?.lote_id ?? cosechaData.loteId,
        fecha: data?.fecha ?? cosechaData.fecha,
        libras: Number(data?.libras) || cosechaData.libras,
        pescador: data?.pescador_nombre ?? pescadorNombre ?? "",
        pescador_id: data?.pescador_id ?? null,
      },
    ]);
  };

  // ====================
  // Registrar venta (breve)
  // ====================
  const handleRegistrarVenta = async (ventaData: Omit<Venta, "id">) => {
    const proveedorEncontrado = proveedores.find((p) => p.nombre === ventaData.proveedor);
    const vendedorEncontrado = vendedores.find((v) => v.nombre === ventaData.vendedor);
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
    if (error) return alert("Error registrando venta: " + error.message);
    await fetchVentas();
    await fetchLotes();
  };

  // ====================
  // Resto de UI (omitido por brevedad en este snippet)
  // Reemplaza tus llamadas a los componentes como antes, pero asegurándote de pasar:
  // - pescadores (para seleccionar pescador)
  // - currentUser?.id como pescador_id si el usuario es Pescador
  // - onSubmit={handleRegistrarCosecha} en CosechaForm
  // ====================

  return (
    <div>
      {/* Mantén tu UI anterior, sólo asegúrate que CosechaForm reciba:
          - lotes={lotes.filter(l => l.estado === "Listo para Pescar")}
          - pescadores={pescadores.filter(p => p.activo)}
          - currentPescadorId={currentUser?.rol === "Pescador" ? currentUser.id : undefined}
          - onSubmit={handleRegistrarCosecha}
       */}
      {/* ... tu UI aquí ... */}
    </div>
  );
}
