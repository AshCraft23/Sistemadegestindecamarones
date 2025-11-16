import { useState } from 'react';
import { Button } from './components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './components/ui/dialog';
import { User, LogOut, Waves } from 'lucide-react';
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

// Datos mock iniciales
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

const initialProveedores: Proveedor[] = [
  {
    id: 'PR-001',
    nombre: 'Mariscos del Pacífico',
    contacto: 'Carlos Mendoza',
    telefono: '+593-99-123-4567',
    email: 'carlos@mariscospacifico.com',
    activo: true
  },
  {
    id: 'PR-002',
    nombre: 'Exportadora Océano',
    contacto: 'Ana Torres',
    telefono: '+593-98-765-4321',
    email: 'ana@exportadoraoceano.com',
    activo: true
  }
];

const initialPescadores: Pescador[] = [
  {
    id: 'PE-001',
    nombre: 'Juan Pérez',
    telefono: '+593-99-111-2222',
    especialidad: 'Camarón Vannamei',
    activo: true
  },
  {
    id: 'PE-002',
    nombre: 'Pedro Ramírez',
    telefono: '+593-99-333-4444',
    especialidad: 'General',
    activo: true
  }
];

const initialVendedores: Vendedor[] = [
  {
    id: 'VE-001',
    nombre: 'María González',
    telefono: '+593-99-555-6666',
    email: 'maria@gelca.com',
    activo: true
  },
  {
    id: 'VE-002',
    nombre: 'Roberto Silva',
    telefono: '+593-99-777-8888',
    email: 'roberto@gelca.com',
    activo: true
  }
];

export default function App() {
  const [currentUser, setCurrentUser] = useState<Usuario | null>(null);
  const [lotes, setLotes] = useState<Lote[]>(initialLotes);
  const [cosechas, setCosechas] = useState<Cosecha[]>(initialCosechas);
  const [ventas, setVentas] = useState<Venta[]>(initialVentas);
  const [proveedores, setProveedores] = useState<Proveedor[]>(initialProveedores);
  const [pescadores, setPescadores] = useState<Pescador[]>(initialPescadores);
  const [vendedores, setVendedores] = useState<Vendedor[]>(initialVendedores);
  const [selectedLoteId, setSelectedLoteId] = useState<string | null>(null);
  const [showLoteForm, setShowLoteForm] = useState(false);

  const selectedLote = lotes.find(l => l.id === selectedLoteId);

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

  const handleCreateLote = (loteData: Omit<Lote, 'id' | 'librasCosechadas' | 'librasVendidas' | 'ingresosTotales'>) => {
    const newLote: Lote = {
      ...loteData,
      id: `L-${String(lotes.length + 1).padStart(3, '0')}`,
      librasCosechadas: 0,
      librasVendidas: 0,
      ingresosTotales: 0
    };
    setLotes([...lotes, newLote])
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
          estado: 'En Venta' as EstadoLote
        };
      }
      return l;
    }));
  };

  const handleRegistrarVenta = (ventaData: Omit<Venta, 'id'>) => {
    const newVenta: Venta = {
      ...ventaData,
      id: `V-${String(ventas.length + 1).padStart(3, '0')}`
    };
    setVentas([...ventas, newVenta]);
    
    setLotes(lotes.map(l => {
      if (l.id === ventaData.loteId) {
        const nuevasLibrasVendidas = l.librasVendidas + ventaData.libras;
        const nuevosIngresos = l.ingresosTotales + (ventaData.libras * ventaData.precioLibra);
        return {
          ...l,
          librasVendidas: nuevasLibrasVendidas,
          ingresosTotales: nuevosIngresos
        };
      }
      return l;
    }));
  };

  const handleCreateProveedor = (proveedorData: Omit<Proveedor, 'id'>) => {
    const newProveedor: Proveedor = {
      ...proveedorData,
      id: `PR-${String(proveedores.length + 1).padStart(3, '0')}`
    };
    setProveedores([...proveedores, newProveedor]);
  };

  const handleUpdateProveedor = (id: string, proveedorData: Omit<Proveedor, 'id'>) => {
    setProveedores(proveedores.map(p => p.id === id ? { ...proveedorData, id } : p));
  };

  const handleDeleteProveedor = (id: string) => {
    setProveedores(proveedores.filter(p => p.id !== id));
  };

  const handleCreatePescador = (pescadorData: Omit<Pescador, 'id'>) => {
    const newPescador: Pescador = {
      ...pescadorData,
      id: `PE-${String(pescadores.length + 1).padStart(3, '0')}`
    };
    setPescadores([...pescadores, newPescador]);
  };

  const handleUpdatePescador = (id: string, pescadorData: Omit<Pescador, 'id'>) => {
    setPescadores(pescadores.map(p => p.id === id ? { ...pescadorData, id } : p));
  };

  const handleDeletePescador = (id: string) => {
    setPescadores(pescadores.filter(p => p.id !== id));
  };

  const handleCreateVendedor = (vendedorData: Omit<Vendedor, 'id'>) => {
    const newVendedor: Vendedor = {
      ...vendedorData,
      id: `VE-${String(vendedores.length + 1).padStart(3, '0')}`
    };
    setVendedores([...vendedores, newVendedor]);
  };

  const handleUpdateVendedor = (id: string, vendedorData: Omit<Vendedor, 'id'>) => {
    setVendedores(vendedores.map(v => v.id === id ? { ...vendedorData, id } : v));
  };

  const handleDeleteVendedor = (id: string) => {
    setVendedores(vendedores.filter(v => v.id !== id));
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
          <p className="text-center text-gray-600 mb-8">Gestión de Camarones por Lotes</p>
          
          <LoginForm onLogin={handleLogin} />
        </div>
      </div>
    );
  }

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
              pescadores={pescadores.filter(p => p.activo)}
              pescadorNombre={currentUser.nombre}
            />
          </div>
        </main>
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
        <Tabs defaultValue={currentUser.rol === 'Administrador' ? 'dashboard-anual' : currentUser.rol === 'Vendedor' ? 'venta' : 'dashboard'} className="space-y-6">
          <TabsList className="bg-white">
            {currentUser.rol === 'Administrador' && (
              <TabsTrigger value="dashboard-anual">Dashboard Anual</TabsTrigger>
            )}
            {currentUser.rol !== 'Vendedor' && (
              <>
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="lotes">Gestión de Lotes</TabsTrigger>
              </>
            )}
            {currentUser.rol === 'Propietario' && (
              <TabsTrigger value="cosecha">Registrar Cosecha</TabsTrigger>
            )}
            {(currentUser.rol === 'Vendedor' || currentUser.rol === 'Propietario' || currentUser.rol === 'Administrador') && (
              <TabsTrigger value="venta">Registrar Venta</TabsTrigger>
            )}
            {(currentUser.rol === 'Propietario' || currentUser.rol === 'Administrador') && (
              <TabsTrigger value="administracion">Administración</TabsTrigger>
            )}
          </TabsList>

          {currentUser.rol === 'Administrador' && (
            <TabsContent value="dashboard-anual">
              <DashboardAnual lotes={lotes} ventas={ventas} />
            </TabsContent>
          )}

          {currentUser.rol !== 'Vendedor' && (
            <>
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
            </>
          )}

          {currentUser.rol === 'Propietario' && (
            <TabsContent value="cosecha">
              <div className="max-w-2xl mx-auto">
                <CosechaForm 
                  lotes={lotes.filter(l => l.estado === 'Listo para Pescar')}
                  onSubmit={handleRegistrarCosecha}
                  pescadores={pescadores.filter(p => p.activo)}
                  pescadorNombre={currentUser.nombre}
                />
              </div>
            </TabsContent>
          )}

          {(currentUser.rol === 'Vendedor' || currentUser.rol === 'Propietario' || currentUser.rol === 'Administrador') && (
            <TabsContent value="venta">
              <div className="max-w-2xl mx-auto">
                <VentaForm 
                  lotes={lotes.filter(l => l.estado === 'En Venta' && (l.librasCosechadas - l.librasVendidas) > 0)}
                  onSubmit={handleRegistrarVenta}
                  proveedores={proveedores.filter(p => p.activo)}
                  vendedores={vendedores.filter(v => v.activo)}
                  vendedorNombre={currentUser.nombre}
                  onCreateProveedor={handleCreateProveedor}
                />
              </div>
            </TabsContent>
          )}

          {(currentUser.rol === 'Propietario' || currentUser.rol === 'Administrador') && (
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