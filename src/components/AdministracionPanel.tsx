import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Plus } from "lucide-react";

import { Proveedor, Pescador, Vendedor, UserRole } from "../App";
import { ProveedorForm } from "./ProveedorForm";
import { PescadorForm } from "./PescadorForm";
import { VendedorForm } from "./VendedorForm";
import { ProveedorTable } from "./ProveedorTable";
import { PescadorTable } from "./PescadorTable";
import { VendedorTable } from "./VendedorTable";
import { UsuariosPanel } from "./UsuariosPanel";

interface AdministracionPanelProps {
  proveedores: Proveedor[];
  pescadores: Pescador[];
  vendedores: Vendedor[];

  onCreateProveedor: (data: Omit<Proveedor, "id">) => void;
  onUpdateProveedor: (id: string, data: Omit<Proveedor, "id">) => void;
  onDeleteProveedor: (id: string) => void;

  onCreatePescador: (data: Omit<Pescador, "id">) => void;
  onUpdatePescador: (id: string, data: Omit<Pescador, "id">) => void;
  onDeletePescador: (id: string) => void;

  onCreateVendedor: (data: Omit<Vendedor, "id">) => void;
  onUpdateVendedor: (id: string, data: Omit<Vendedor, "id">) => void;
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
  userRole,
}: AdministracionPanelProps) {
  const [showProveedorForm, setShowProveedorForm] = useState(false);
  const [showPescadorForm, setShowPescadorForm] = useState(false);
  const [showVendedorForm, setShowVendedorForm] = useState(false);

  const [editingProveedor, setEditingProveedor] = useState<Proveedor | null>(
    null
  );
  const [editingPescador, setEditingPescador] = useState<Pescador | null>(null);
  const [editingVendedor, setEditingVendedor] = useState<Vendedor | null>(null);

  return (
    <div className="space-y-6">
      <Card className="border-2 border-cyan-200 bg-gradient-to-r from-cyan-50 to-teal-50">
        <CardHeader>
          <CardTitle className="text-cyan-900">Panel de Administración</CardTitle>
          <p className="text-sm text-gray-600">
            Gestiona proveedores, pescadores y vendedores
          </p>
        </CardHeader>
      </Card>

      <Tabs defaultValue="proveedores" className="space-y-4">
        <TabsList className="bg-white">
          <TabsTrigger value="proveedores">Proveedores</TabsTrigger>
          <TabsTrigger value="pescadores">Pescadores</TabsTrigger>
          <TabsTrigger value="vendedores">Vendedores</TabsTrigger>
          {userRole === "Administrador" && (
            <TabsTrigger value="usuarios">Usuarios</TabsTrigger>
          )}
        </TabsList>

        {/* PROVEEDORES */}
        <TabsContent value="proveedores">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Gestión de Proveedores</CardTitle>

                <Dialog
                  open={showProveedorForm}
                  onOpenChange={setShowProveedorForm}
                >
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-cyan-600 to-teal-600">
                      <Plus className="mr-2 size-4" />
                      Agregar Proveedor
                    </Button>
                  </DialogTrigger>

                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Nuevo Proveedor</DialogTitle>
                    </DialogHeader>

                    <ProveedorForm
                      onSubmit={(data) => {
                        onCreateProveedor(data);
                        setShowProveedorForm(false);
                      }}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>

            <CardContent>
              <ProveedorTable
                proveedores={proveedores}
                onEdit={(p) => setEditingProveedor(p)}
                onDelete={onDeleteProveedor}
              />
            </CardContent>
          </Card>

          {/* Editar proveedor */}
          <Dialog
            open={!!editingProveedor}
            onOpenChange={() => setEditingProveedor(null)}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Editar Proveedor</DialogTitle>
              </DialogHeader>

              {editingProveedor && (
                <ProveedorForm
                  initialData={editingProveedor}
                  onSubmit={(data) => {
                    onUpdateProveedor(editingProveedor.id, data);
                    setEditingProveedor(null);
                  }}
                />
              )}
            </DialogContent>
          </Dialog>
        </TabsContent>

        {/* PESCADORES */}
        <TabsContent value="pescadores">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Pescadores</CardTitle>

                <Dialog
                  open={showPescadorForm}
                  onOpenChange={setShowPescadorForm}
                >
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-teal-600 to-green-600">
                      <Plus className="mr-2 size-4" />
                      Agregar Pescador
                    </Button>
                  </DialogTrigger>

                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Nuevo Pescador</DialogTitle>
                    </DialogHeader>

                    <PescadorForm
                      onSubmit={(data) => {
                        onCreatePescador(data);
                        setShowPescadorForm(false);
                      }}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>

            <CardContent>
              <PescadorTable
                pescadores={pescadores}
                onEdit={(p) => setEditingPescador(p)}
                onDelete={onDeletePescador}
              />
            </CardContent>
          </Card>

          <Dialog
            open={!!editingPescador}
            onOpenChange={() => setEditingPescador(null)}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Editar Pescador</DialogTitle>
              </DialogHeader>

              {editingPescador && (
                <PescadorForm
                  initialData={editingPescador}
                  onSubmit={(data) => {
                    onUpdatePescador(editingPescador.id, data);
                    setEditingPescador(null);
                  }}
                />
              )}
            </DialogContent>
          </Dialog>
        </TabsContent>

        {/* VENDEDORES */}
        <TabsContent value="vendedores">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Vendedores</CardTitle>

                <Dialog
                  open={showVendedorForm}
                  onOpenChange={setShowVendedorForm}
                >
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-blue-600 to-indigo-600">
                      <Plus className="mr-2 size-4" />
                      Agregar Vendedor
                    </Button>
                  </DialogTrigger>

                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Nuevo Vendedor</DialogTitle>
                    </DialogHeader>

                    <VendedorForm
                      onSubmit={(data) => {
                        onCreateVendedor(data);
                        setShowVendedorForm(false);
                      }}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>

            <CardContent>
              <VendedorTable
                vendedores={vendedores}
                onEdit={(v) => setEditingVendedor(v)}
                onDelete={onDeleteVendedor}
              />
            </CardContent>
          </Card>

          <Dialog
            open={!!editingVendedor}
            onOpenChange={() => setEditingVendedor(null)}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Editar Vendedor</DialogTitle>
              </DialogHeader>

              {editingVendedor && (
                <VendedorForm
                  initialData={editingVendedor}
                  onSubmit={(data) => {
                    onUpdateVendedor(editingVendedor.id, data);
                    setEditingVendedor(null);
                  }}
                />
              )}
            </DialogContent>
          </Dialog>
        </TabsContent>

        {/* USUARIOS */}
        {userRole === "Administrador" && (
          <TabsContent value="usuarios">
            <Card>
              <CardHeader>
                <CardTitle className="text-cyan-900">Usuarios</CardTitle>
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