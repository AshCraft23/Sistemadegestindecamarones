import { useState } from 'react';
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

// Mock inicial solo para lotes, cosechas y ventas
const initialLotes: Lote[] = [
  {
    id: 'L-001',
    nombre: 'Piscina Norte A',
    fechaInicio: '2025-01-15',
    fechaEstimadaPesca: '2025-04-15',
    tipoCamaron: 'Vannamei',
    estado: 'En Venta',
    librasCosechadas: 27558,
    librasVendidas: 17196,
    costoProduccion: 62500,
    ingresosTotales: 60186
  },
  {
    id: 'L-002',
    nombre: 'Piscina Sur B',
    fechaInicio: '2025-02-01',
    fechaEstimadaPesca: '2025-05-02',
    tipoCamaron: 'Vannamei',
    estado: 'Crianza',
    librasCosechadas: 0,
    librasVendidas: 0,
    costoProduccion: 45000,
    ingresosTotales: 0
  },
  {
    id: 'L-003',
    nombre: 'Piscina Central C',
    fechaInicio: '2024-12-10',
    fechaEstimadaPesca: '2025-03-10',
    tipoCamaron: 'Litopenaeus',
    estado: 'Listo para Pescar',
    librasCosechadas: 0,
    librasVendidas: 0,
    costoProduccion: 58000,
    ingresosTotales: 0
  }
];

const initialCosechas: Cosecha[] = [
  {
    id: 'C-001',
    loteId: 'L-001',
    fecha: '2025-10-20',
    libras: 27558,
    pescador: 'Juan Pérez'
  }
];

const initialVentas: Venta[] = [
  {
    id: 'V-001',
    loteId: 'L-001',
    fecha: '2025-10-22',
    libras: 11023,
    precioLibra: 3.5,
    proveedor: 'Mariscos del Pacífico',
    vendedor: 'María González'
  },
  {
    id: 'V-002',
    loteId: 'L-001',
    fecha: '2025-10-25',
    libras: 6173,
    precioLibra: 3.5,
    proveedor: 'Exportadora Océano',
    vendedor: 'María González'
  }
];

export default function App() {
  const [currentUser, setCurrentUser] = useState<Usuario | null>(null);
  const [lotes, setLotes] = useState<Lote[]>(initialLotes);
  const [cosechas, setCosechas] = useState<Cosecha[]>(initialCosechas);
  const [ventas, setVentas] = useState<Venta[]>(initialVentas);
  const [selectedLoteId, setSelectedLoteId] = useState<string | null>(null);
  const [showLoteForm, setShowLoteForm] = useState(false);

  const selectedLote = lotes.find(l => l.id === selectedLoteId);

  // ======================
  // LOGIN / LOGOUT
  // ======================
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

  // ======================
  // LOTES
  // ======================
  const handleCreateLote = (loteData: Omit<Lote, 'id' | 'librasCosechadas' | 'librasVendidas' | 'ingresosTotales'>) => {
    const newLote: Lote = {
      ...loteData,
      id: `L-${String(lotes.length + 1).padStart(3, '0')}`,
      librasCosechadas: 0,
      librasVendidas: 0,
      ingresosTotales: 0
    };
    setLotes([...lotes, newLote]);
    setShowLoteForm(false);
  };

  const handleUpdateLoteEstado = (loteId: string, nuevoEstado: EstadoLote) => {
    setLotes(lotes.map(l => 
      l.id === loteId ? { ...l, estado: nuevoEstado } : l
    ));
  };

  const handleUpdateFechaPesca = (loteId: string, nuevaFecha: string) => {
    setLotes(lotes.map(l => 
      l.id === loteId ? { ...l, fechaEstimadaPesca: nuevaFecha } : l
    ));
  };

  // ======================
  // COSECHAS
  // ======================
  const handleRegistrarCosecha = (cosechaData: Omit<Cosecha, 'id'>) => {
    const newCosecha: Cosecha = {
      ...cosechaData,
      id: `C-${String(cosechas.length + 1).padStart(3, '0')}`
    };
    setCosechas([...cosechas, newCosecha]);

    setLotes(lotes.map(l => {
      if (l.id === cosechaData.loteId) {
        return {
          ...l,
          librasCosechadas: l.librasCosechadas + cosechaData.libras,
          estado: 'En Venta'
        };
      }
      return l;
    }));
  };

  // ======================
  // VENTAS
  // ======================
  const handleRegistrarVenta = (ventaData: Omit<Venta, 'id'>) => {
    const newVenta: Venta = {
      ...ventaData,
      id: `V-${String(ventas.length + 1).padStart(3, '0')}`
    };
    setVentas([...ventas, newVenta]);
    
    setLotes(lotes.map(l => {
      if (l.id === ventaData.loteId) {
        const nuevasLibrasVendidas = l.librasVendidas + ventaData.libras;
        const nuevosIngresos = l.ingresosTotales + ventaData.libras * ventaData.precioLibra;

        return {
          ...l,
          librasVendidas: nuevasLibrasVendidas,
          ingresosTotales: nuevosIngresos
        };
      }
      return l;
    }));
  };

  // ======================
  // PANTALLA LOGIN
  // ======================
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
          <p className="text-center text-gray-600 mb-8">Gestión de Camarones por Lotes</p>

          <LoginForm onLogin={handleLogin} />
        </div>
      </div>
    );
  }

  // ======================
  // PANTALLA PESCADOR
  // ======================
  if (currentUser.rol === 'Pescador') {
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
                <p className="text-sm text-gray-600">{currentUser.nombre} - Pescador</p>
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
              lotes={lotes.filter(l => l.estado === 'Listo para Pescar')}
              onSubmit={handleRegistrarCosecha}
              pescadores={[]} 
              pescadorNombre={currentUser.nombre}
            />
          </div>
        </main>
      </div>
    );
  }

  // ======================
  // PANEL PRINCIPAL
  // ======================
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

            <div className="flex items-center gap-4">
              {currentUser.rol !== 'Vendedor' && (
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-700">Lote:</label>
                  <Select value={selectedLoteId || ''} onValueChange={setSelectedLoteId}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Seleccionar lote" />
                    </SelectTrigger>
                    <SelectContent>
                      {lotes.map(lote => (
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
            currentUser.rol === 'Administrador' ? 'dashboard-anual' :
            currentUser.rol === 'Vendedor' ? 'venta' : 
            'dashboard'
          } 
          className="space-y-6"
        >
          {/* DASHBOARD ANUAL */}
          {currentUser.rol === 'Administrador' && (
            <TabsContent value="dashboard-anual">
              <DashboardAnual lotes={lotes} ventas={ventas} />
            </TabsContent>
          )}

          {/* DASHBOARD */}
          {currentUser.rol !== 'Vendedor' && (
            <TabsContent value="dashboard">
              {selectedLote ? (
                <Dashboard 
                  lote={selectedLote}
                  ventas={ventas.filter(v => v.loteId === selectedLote.id)}
                  cosechas={cosechas.filter(c => c.loteId === selectedLote.id)}
                  userRole={currentUser.rol}
                  onUpdateEstado={handleUpdateLoteEstado}
                  onUpdateFechaPesca={handleUpdateFechaPesca}
                />
              ) : (
                <div className="bg-white rounded-lg shadow p-8 text-center">
                  <p className="text-gray-600">Selecciona un lote para ver su dashboard</p>
                </div>
              )}
            </TabsContent>
          )}

          {/* LOTES */}
          {currentUser.rol !== 'Vendedor' && (
            <TabsContent value="lotes">
              <div className="space-y-4">
                {(currentUser.rol === 'Propietario' || currentUser.rol === 'Administrador') && (
                  <div className="flex justify-end">
                    <Dialog open={showLoteForm} onOpenChange={setShowLoteForm}>
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
          )}

          {/* REGISTRAR COSECHA */}
          {currentUser.rol === 'Propietario' && (
            <TabsContent value="cosecha">
              <div className="max-w-2xl mx-auto">
                <CosechaForm 
                  lotes={lotes.filter(l => l.estado === 'Listo para Pescar')}
                  onSubmit={handleRegistrarCosecha}
                  pescadores={[]} 
                  pescadorNombre={currentUser.nombre}
                />
              </div>
            </TabsContent>
          )}

          {/* REGISTRAR VENTA */}
          {(currentUser.rol === 'Vendedor' || currentUser.rol === 'Propietario' || currentUser.rol === 'Administrador') && (
            <TabsContent value="venta">
              <div className="max-w-2xl mx-auto">
                <VentaForm 
                  lotes={lotes.filter(l => l.estado === 'En Venta' && (l.librasCosechadas - l.librasVendidas) > 0)}
                  onSubmit={handleRegistrarVenta}
                  proveedores={[]} 
                  vendedores={[]} 
                  vendedorNombre={currentUser.nombre}
                  onCreateProveedor={() => {}} 
                />
              </div>
            </TabsContent>
          )}

          {/* ADMINISTRACIÓN */}
          {(currentUser.rol === 'Propietario' || currentUser.rol === 'Administrador') && (
            <TabsContent value="administracion">
              <AdministracionPanel userRole={currentUser.rol} />
            </TabsContent>
          )}
        </Tabs>
      </main>
    </div>
  );
}
