import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Users, Building2, UserCircle, Plus } from 'lucide-react';

import { Proveedor, Pescador, Vendedor, UserRole } from "../App";
import { ProveedorForm } from "./ProveedorForm";
import { PescadorForm } from "./PescadorForm";
import { VendedorForm } from "./VendedorForm";
import { ProveedorTable } from "./ProveedorTable";
import { PescadorTable } from "./PescadorTable";
import { VendedorTable } from "./VendedorTable";
import { UsuariosPanel } from "./UsuariosPanel";

import { supabase } from "@/lib/supabase";

interface AdministracionPanelProps {
  userRole: UserRole;
}

export function AdministracionPanel({ userRole }: AdministracionPanelProps) {
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [pescadores, setPescadores] = useState<Pescador[]>([]);
  const [vendedores, setVendedores] = useState<Vendedor[]>([]);

  const [showProveedorForm, setShowProveedorForm] = useState(false);
  const [showPescadorForm, setShowPescadorForm] = useState(false);
  const [showVendedorForm, setShowVendedorForm] = useState(false);

  const [editingProveedor, setEditingProveedor] = useState<Proveedor | null>(null);
  const [editingPescador, setEditingPescador] = useState<Pescador | null>(null);
  const [editingVendedor, setEditingVendedor] = useState<Vendedor | null>(null);

  // =============================
  // 🔥 FETCH DE TODOS LOS DATOS
  // =============================
  const fetchProveedores = async () => {
    const { data, error } = await supabase
      .from("proveedores")
      .select("*")
      .order("nombre");

    if (!error) setProveedores(data);
  };

  const fetchPescadores = async () => {
    const { data, error } = await supabase
      .from("pescadores")
      .select("*")
      .order("nombre");

    if (!error) setPescadores(data);
  };

  const fetchVendedores = async () => {
    const { data, error } = await supabase
      .from("vendedores")
      .select("*")
      .order("nombre");

    if (!error) setVendedores(data);
  };

  useEffect(() => {
    fetchProveedores();
    fetchPescadores();
    fetchVendedores();
  }, []);

  // ====================================
  // 🔥 CRUD PROVEEDORES
  // ====================================
  const onCreateProveedor = async (data: Omit<Proveedor, "id">) => {
    const { error } = await supabase.from("proveedores").insert(data);
    if (error) return alert(error.message);

    setShowProveedorForm(false);
    fetchProveedores();
  };

  const onUpdateProveedor = async (id: string, data: Omit<Proveedor, "id">) => {
    const { error } = await supabase
      .from("proveedores")
      .update(data)
      .eq("id", id);
    if (error) return alert(error.message);

    setEditingProveedor(null);
    fetchProveedores();
  };

  const onDeleteProveedor = async (id: string) => {
    const { error } = await supabase
      .from("proveedores")
      .delete()
      .eq("id", id);

    if (error) return alert(error.message);
    fetchProveedores();
  };

  // ====================================
  // 🔥 CRUD PESCADORES
  // ====================================
  const onCreatePescador = async (data: Omit<Pescador, "id">) => {
    const { error } = await supabase.from("pescadores").insert(data);
    if (error) return alert(error.message);

    setShowPescadorForm(false);
    fetchPescadores();
  };

  const onUpdatePescador = async (id: string, data: Omit<Pescador, "id">) => {
    const { error } = await supabase
      .from("pescadores")
      .update(data)
      .eq("id", id);

    if (error) return alert(error.message);

    setEditingPescador(null);
    fetchPescadores();
  };

  const onDeletePescador = async (id: string) => {
    const { error } = await supabase
      .from("pescadores")
      .delete()
      .eq("id", id);

    if (error) return alert(error.message);
    fetchPescadores();
  };

  // ====================================
  // 🔥 CRUD VENDEDORES
  // ====================================
  const onCreateVendedor = async (data: Omit<Vendedor, "id">) => {
    const { error } = await supabase.from("vendedores").insert(data);
    if (error) return alert(error.message);

    setShowVendedorForm(false);
    fetchVendedores();
  };

  const onUpdateVendedor = async (id: string, data: Omit<Vendedor, "id">) => {
    const { error } = await supabase
      .from("vendedores")
      .update(data)
      .eq("id", id);

    if (error) return alert(error.message);

    setEditingVendedor(null);
    fetchVendedores();
  };

  const onDeleteVendedor = async (id: string) => {
    const { error } = await supabase
      .from("vendedores")
      .delete()
      .eq("id", id);

    if (error) return alert(error.message);
    fetchVendedores();
  };

  // ====================================
  // 🖥️  UI DEL PANEL
  // ====================================
  return (
    <div className="space-y-6">
      {/* Tarjeta de encabezado */}
      <Card className="border-2 border-cyan-200 bg-gradient-to-r from-cyan-50 to-teal-50">
        <CardHeader>
          <CardTitle className="text-cyan-900">Panel de Administración</CardTitle>
          <p className="text-sm text-gray-600">
            Gestiona proveedores, pescadores y vendedores del sistema
          </p>
        </CardHeader>
      </Card>

      {/* Tabs */}
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

                {/* Crear */}
                <Dialog open={showProveedorForm} onOpenChange={setShowProveedorForm}>
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
                    <ProveedorForm onSubmit={onCreateProveedor} />
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

          {/* Editar */}
          <Dialog open={!!editingProveedor} onOpenChange={() => setEditingProveedor(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Editar Proveedor</DialogTitle>
              </DialogHeader>

              {editingProveedor && (
                <ProveedorForm
                  initialData={editingProveedor}
                  onSubmit={(data) => onUpdateProveedor(editingProveedor.id, data)}
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

                <Dialog open={showPescadorForm} onOpenChange={setShowPescadorForm}>
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

                    <PescadorForm onSubmit={onCreatePescador} />
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

          <Dialog open={!!editingPescador} onOpenChange={() => setEditingPescador(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Editar Pescador</DialogTitle>
              </DialogHeader>

              {editingPescador && (
                <PescadorForm
                  initialData={editingPescador}
                  onSubmit={(data) => onUpdatePescador(editingPescador.id, data)}
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

                <Dialog open={showVendedorForm} onOpenChange={setShowVendedorForm}>
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

                    <VendedorForm onSubmit={onCreateVendedor} />
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

          <Dialog open={!!editingVendedor} onOpenChange={() => setEditingVendedor(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Editar Vendedor</DialogTitle>
              </DialogHeader>

              {editingVendedor && (
                <VendedorForm
                  initialData={editingVendedor}
                  onSubmit={(data) => onUpdateVendedor(editingVendedor.id, data)}
                />
              )}
            </DialogContent>
          </Dialog>
        </TabsContent>

        {/* USUARIOS (solo admin) */}
        {userRole === "Administrador" && (
          <TabsContent value="usuarios">
            <Card className="border-2 border-cyan-200 bg-gradient-to-r from-cyan-50 to-teal-50">
              <CardHeader>
                <CardTitle className="text-cyan-900">Panel de Usuarios</CardTitle>
                <p className="text-sm text-gray-600">
                  Gestiona los usuarios del sistema
                </p>
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
