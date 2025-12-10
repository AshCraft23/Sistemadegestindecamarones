import { useEffect, useState } from 'react';
import { Button } from './components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './components/ui/dialog';
import { LogOut, Waves } from 'lucide-react';

import { Dashboard } from './components/Dashboard';
import { DashboardAnual } from './components/DashboardAnual';
import { LoteForm } from './components/LoteForm';
import { CosechaForm } from './components/CosechaForm';
import { VentaForm } from './components/VentaForm';
import { LotesList } from './components/LotesList';
import { AdministracionPanel } from './components/AdministracionPanel';
import { LoginForm } from './components/LoginForm';

import { supabase } from '@/lib/supabase';

export type EstadoLote = 'Crianza' | 'Listo para Pescar' | 'En Venta' | 'Reposo' | 'Descarte';
export type UserRole = 'Administrador' | 'Propietario' | 'Vendedor' | 'Pescador';

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

  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [pescadores, setPescadores] = useState<Pescador[]>([]);
  const [vendedores, setVendedores] = useState<Vendedor[]>([]);

  const [lotes, setLotes] = useState<Lote[]>([]);
  const [cosechas, setCosechas] = useState<Cosecha[]>([]);
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [selectedLoteId, setSelectedLoteId] = useState<string | null>(null);
  const [showLoteForm, setShowLoteForm] = useState(false);

  const selectedLote = lotes.find(l => l.id === selectedLoteId);

  // ==========================================
  // 🔥 FETCH GENERAL DESDE SUPABASE
  // ==========================================
  const fetchProveedores = async () => {
    const { data } = await supabase.from("proveedores").select("*").order("nombre");
    setProveedores(data || []);
  };

  const fetchPescadores = async () => {
    const { data } = await supabase.from("pescadores").select("*").order("nombre");
    setPescadores(data || []);
  };

  const fetchVendedores = async () => {
    const { data } = await supabase.from("vendedores").select("*").order("nombre");
    setVendedores(data || []);
  };

  useEffect(() => {
    fetchProveedores();
    fetchPescadores();
    fetchVendedores();
  }, []);

  // =====================================================
  // 🔥 CRUD SUPABASE — PROVEEDORES
  // =====================================================
  const handleCreateProveedor = async (data: Omit<Proveedor, "id">) => {
    const { data: inserted, error } = await supabase
      .from("proveedores")
      .insert([data])
      .select();

    if (error) return alert(error.message);

    if (inserted && inserted[0]) {
      setProveedores(prev => [...prev, inserted[0]]);
    }
  };

  const handleUpdateProveedor = async (id: string, upd: Omit<Proveedor, "id">) => {
    const { data, error } = await supabase
      .from("proveedores")
      .update(upd)
      .eq("id", id)
      .select();

    if (error) return alert(error.message);
    if (data && data[0]) {
      setProveedores(prev => prev.map(p => p.id === id ? data[0] : p));
    }
  };

  const handleDeleteProveedor = async (id: string) => {
    const { error } = await supabase.from("proveedores").delete().eq("id", id);

    if (error) return alert(error.message);
    setProveedores(prev => prev.filter(p => p.id !== id));
  };

  // =====================================================
  // 🔥 CRUD SUPABASE — PESCADORES
  // =====================================================
  const handleCreatePescador = async (data: Omit<Pescador, "id">) => {
    const { data: inserted, error } = await supabase
      .from("pescadores")
      .insert([data])
      .select();

    if (error) return alert(error.message);
    if (inserted && inserted[0]) {
      setPescadores(prev => [...prev, inserted[0]]);
    }
  };

  const handleUpdatePescador = async (id: string, upd: Omit<Pescador, "id">) => {
    const { data, error } = await supabase
      .from("pescadores")
      .update(upd)
      .eq("id", id)
      .select();

    if (error) return alert(error.message);
    if (data && data[0]) {
      setPescadores(prev => prev.map(p => p.id === id ? data[0] : p));
    }
  };

  const handleDeletePescador = async (id: string) => {
    const { error } = await supabase.from("pescadores").delete().eq("id", id);
    if (error) return alert(error.message);

    setPescadores(prev => prev.filter(p => p.id !== id));
  };

  // =====================================================
  // 🔥 CRUD SUPABASE — VENDEDORES
  // =====================================================
  const handleCreateVendedor = async (data: Omit<Vendedor, "id">) => {
    const { data: inserted, error } = await supabase
      .from("vendedores")
      .insert([data])
      .select();

    if (error) return alert(error.message);
    if (inserted && inserted[0]) {
      setVendedores(prev => [...prev, inserted[0]]);
    }
  };

  const handleUpdateVendedor = async (id: string, upd: Omit<Vendedor, "id">) => {
    const { data, error } = await supabase
      .from("vendedores")
      .update(upd)
      .eq("id", id)
      .select();

    if (error) return alert(error.message);
    if (data && data[0]) {
      setVendedores(prev => prev.map(v => v.id === id ? data[0] : v));
    }
  };

  const handleDeleteVendedor = async (id: string) => {
    const { error } = await supabase.from("vendedores").delete().eq("id", id);
    if (error) return alert(error.message);

    setVendedores(prev => prev.filter(v => v.id !== id));
  };

  // =====================================================
  // 🔥 LOGIN / CONTROL APP (SIN CAMBIOS)
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
  // 🔥 RESTO DE LA APP (NO CAMBIADO)
  // =====================================================

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
          <p className="text-center text-gray-600 mb-8">Gestión de Camarones</p>

          <LoginForm onLogin={handleLogin} />
        </div>
      </div>
    );
  }

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
                <p className="text-sm text-gray-600">{currentUser.nombre} - {currentUser.rol}</p>
              </div>
            </div>

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
              ? "administracion"
              : currentUser.rol === "Vendedor"
              ? "venta"
              : "dashboard"
          }
          className="space-y-6"
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

            {currentUser.rol !== "Pescador" && (
              <TabsTrigger value="venta">Registrar Venta</TabsTrigger>
            )}

            {(currentUser.rol === "Administrador" || currentUser.rol === "Propietario") && (
              <TabsTrigger value="administracion">Administración</TabsTrigger>
            )}
          </TabsList>

          {currentUser.rol === "Administrador" && (
            <TabsContent value="dashboard-anual">
              <DashboardAnual lotes={lotes} ventas={ventas} />
            </TabsContent>
          )}

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
