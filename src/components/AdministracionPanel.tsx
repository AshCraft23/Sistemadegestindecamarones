import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Users, Building2, UserCircle, Plus, KeyRound } from 'lucide-react';
import { Proveedor, Pescador, Vendedor, Usuario, UserRole } from '../App';
import { ProveedorForm } from './ProveedorForm';
import { PescadorForm } from './PescadorForm';
import { VendedorForm } from './VendedorForm';
import { ProveedorTable } from './ProveedorTable';
import { PescadorTable } from './PescadorTable';
import { VendedorTable } from './VendedorTable';
import { UsuariosPanel } from './UsuariosPanel';

interface AdministracionPanelProps {
  proveedores: Proveedor[];
  pescadores: Pescador[];
  vendedores: Vendedor[];
  onCreateProveedor: (data: Omit<Proveedor, 'id'>) => void;
  onUpdateProveedor: (id: string, data: Omit<Proveedor, 'id'>) => void;
  onDeleteProveedor: (id: string) => void;
  onCreatePescador: (data: Omit<Pescador, 'id'>) => void;
  onUpdatePescador: (id: string, data: Omit<Pescador, 'id'>) => void;
  onDeletePescador: (id: string) => void;
  onCreateVendedor: (data: Omit<Vendedor, 'id'>) => void;
  onUpdateVendedor: (id: string, data: Omit<Vendedor, 'id'>) => void;
  onDeleteVendedor: (id: string) => void;
  userRole: UserRole;
}

export function AdministracionPanel({
  proveedores,
  pescadores,
  vendedores,
  onCreateProveedor,
  onUpdateProveedor,
  onDeleteProveedor,
  onCreatePescador,
  onUpdatePescador,
  onDeletePescador,
  onCreateVendedor,
  onUpdateVendedor,
  onDeleteVendedor,
  userRole
}: AdministracionPanelProps) {
  const [showProveedorForm, setShowProveedorForm] = useState(false);
  const [showPescadorForm, setShowPescadorForm] = useState(false);
  const [showVendedorForm, setShowVendedorForm] = useState(false);
  const [editingProveedor, setEditingProveedor] = useState<Proveedor | null>(null);
  const [editingPescador, setEditingPescador] = useState<Pescador | null>(null);
  const [editingVendedor, setEditingVendedor] = useState<Vendedor | null>(null);

  const handleCreateProveedor = (data: Omit<Proveedor, 'id'>) => {
    onCreateProveedor(data);
    setShowProveedorForm(false);
  };

  const handleUpdateProveedor = (data: Omit<Proveedor, 'id'>) => {
    if (editingProveedor) {
      onUpdateProveedor(editingProveedor.id, data);
      setEditingProveedor(null);
    }
  };

  const handleCreatePescador = (data: Omit<Pescador, 'id'>) => {
    onCreatePescador(data);
    setShowPescadorForm(false);
  };

  const handleUpdatePescador = (data: Omit<Pescador, 'id'>) => {
    if (editingPescador) {
      onUpdatePescador(editingPescador.id, data);
      setEditingPescador(null);
    }
  };

  const handleCreateVendedor = (data: Omit<Vendedor, 'id'>) => {
    onCreateVendedor(data);
    setShowVendedorForm(false);
  };

  const handleUpdateVendedor = (data: Omit<Vendedor, 'id'>) => {
    if (editingVendedor) {
      onUpdateVendedor(editingVendedor.id, data);
      setEditingVendedor(null);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-2 border-cyan-200 bg-gradient-to-r from-cyan-50 to-teal-50">
        <CardHeader>
          <CardTitle className="text-cyan-900">Panel de Administración</CardTitle>
          <p className="text-sm text-gray-600">Gestiona proveedores, pescadores y vendedores del sistema</p>
        </CardHeader>
      </Card>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Proveedores Activos</p>
                <p className="text-cyan-900">{proveedores.filter(p => p.activo).length}</p>
              </div>
              <div className="bg-gradient-to-br from-cyan-500 to-blue-500 p-3 rounded-lg">
                <Building2 className="size-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pescadores Activos</p>
                <p className="text-cyan-900">{pescadores.filter(p => p.activo).length}</p>
              </div>
              <div className="bg-gradient-to-br from-teal-500 to-emerald-500 p-3 rounded-lg">
                <Users className="size-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Vendedores Activos</p>
                <p className="text-cyan-900">{vendedores.filter(v => v.activo).length}</p>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-indigo-500 p-3 rounded-lg">
                <UserCircle className="size-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs para gestión */}
      <Tabs defaultValue="proveedores" className="space-y-4">
        <TabsList className="bg-white">
          <TabsTrigger value="proveedores">Proveedores</TabsTrigger>
          <TabsTrigger value="pescadores">Pescadores</TabsTrigger>
          <TabsTrigger value="vendedores">Vendedores</TabsTrigger>
          {userRole === 'Administrador' && (
            <TabsTrigger value="usuarios">Usuarios</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="proveedores">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Gestión de Proveedores</CardTitle>
                <Dialog open={showProveedorForm} onOpenChange={setShowProveedorForm}>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700">
                      <Plus className="mr-2 size-4" />
                      Agregar Proveedor
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Nuevo Proveedor</DialogTitle>
                    </DialogHeader>
                    <ProveedorForm onSubmit={handleCreateProveedor} />
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <ProveedorTable
                proveedores={proveedores}
                onEdit={(proveedor) => setEditingProveedor(proveedor)}
                onDelete={onDeleteProveedor}
              />
            </CardContent>
          </Card>

          {/* Dialog para editar */}
          <Dialog open={!!editingProveedor} onOpenChange={() => setEditingProveedor(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Editar Proveedor</DialogTitle>
              </DialogHeader>
              {editingProveedor && (
                <ProveedorForm
                  initialData={editingProveedor}
                  onSubmit={handleUpdateProveedor}
                />
              )}
            </DialogContent>
          </Dialog>
        </TabsContent>

        <TabsContent value="pescadores">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Gestión de Pescadores</CardTitle>
                <Dialog open={showPescadorForm} onOpenChange={setShowPescadorForm}>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700">
                      <Plus className="mr-2 size-4" />
                      Agregar Pescador
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Nuevo Pescador</DialogTitle>
                    </DialogHeader>
                    <PescadorForm onSubmit={handleCreatePescador} />
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <PescadorTable
                pescadores={pescadores}
                onEdit={(pescador) => setEditingPescador(pescador)}
                onDelete={onDeletePescador}
              />
            </CardContent>
          </Card>

          {/* Dialog para editar */}
          <Dialog open={!!editingPescador} onOpenChange={() => setEditingPescador(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Editar Pescador</DialogTitle>
              </DialogHeader>
              {editingPescador && (
                <PescadorForm
                  initialData={editingPescador}
                  onSubmit={handleUpdatePescador}
                />
              )}
            </DialogContent>
          </Dialog>
        </TabsContent>

        <TabsContent value="vendedores">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Gestión de Vendedores</CardTitle>
                <Dialog open={showVendedorForm} onOpenChange={setShowVendedorForm}>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                      <Plus className="mr-2 size-4" />
                      Agregar Vendedor
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Nuevo Vendedor</DialogTitle>
                    </DialogHeader>
                    <VendedorForm onSubmit={handleCreateVendedor} />
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <VendedorTable
                vendedores={vendedores}
                onEdit={(vendedor) => setEditingVendedor(vendedor)}
                onDelete={onDeleteVendedor}
              />
            </CardContent>
          </Card>

          {/* Dialog para editar */}
          <Dialog open={!!editingVendedor} onOpenChange={() => setEditingVendedor(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Editar Vendedor</DialogTitle>
              </DialogHeader>
              {editingVendedor && (
                <VendedorForm
                  initialData={editingVendedor}
                  onSubmit={handleUpdateVendedor}
                />
              )}
            </DialogContent>
          </Dialog>
        </TabsContent>

        {userRole === 'Administrador' && (
          <TabsContent value="usuarios">
            <Card className="border-2 border-cyan-200 bg-gradient-to-r from-cyan-50 to-teal-50">
              <CardHeader>
                <CardTitle className="text-cyan-900">Panel de Usuarios</CardTitle>
                <p className="text-sm text-gray-600">Gestiona los usuarios del sistema</p>
              </CardHeader>
              <CardContent>
                <UsuariosPanel />
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}