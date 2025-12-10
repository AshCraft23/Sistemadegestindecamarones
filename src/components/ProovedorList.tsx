import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Proveedor } from "../App";

import { ProveedorForm } from "./ProveedorForm";
import { ProveedorTable } from "./ProveedorTable";

export default function ProovedorList() {
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [editingProveedor, setEditingProveedor] = useState<Proveedor | null>(null);

  // 🔥 Cargar datos desde Supabase
  const fetchProveedores = async () => {
    const { data, error } = await supabase
      .from("proveedores")
      .select("id, nombre, contacts, telefono, email, activo");

    if (error) {
      console.error("Error cargando proveedores:", error);
      return;
    }

    // 🔥 Mapear contacts → contacto
    const mapped = data.map((p) => ({
      id: p.id,
      nombre: p.nombre,
      contacto: p.contacts,   // ← CORRECCIÓN
      telefono: p.telefono,
      email: p.email,
      activo: p.activo,
    }));

    setProveedores(mapped);
  };

  useEffect(() => {
    fetchProveedores();
  }, []);

  // 🔥 Crear proveedor
  const handleCreate = async (nuevo: Omit<Proveedor, "id">) => {
    const { error } = await supabase
      .from("proveedores")
      .insert({
        nombre: nuevo.nombre,
        telefono: nuevo.telefono,
        email: nuevo.email,
        contacts: nuevo.contacto, // ← CORRECCIÓN
        activo: nuevo.activo,
      });

    if (error) {
      alert("Error creando proveedor: " + error.message);
      return;
    }

    fetchProveedores();
  };

  // 🔥 Editar proveedor
  const handleEdit = async (id: string, data: Omit<Proveedor, "id">) => {
    const { error } = await supabase
      .from("proveedores")
      .update({
        nombre: data.nombre,
        telefono: data.telefono,
        email: data.email,
        contacts: data.contacto, // ← CORRECCIÓN
        activo: data.activo,
      })
      .eq("id", id);

    if (error) {
      alert("Error actualizando proveedor: " + error.message);
      return;
    }

    setEditingProveedor(null);
    fetchProveedores();
  };

  // 🔥 Borrar proveedor
  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from("proveedores")
      .delete()
      .eq("id", id);

    if (error) {
      alert("Error eliminando proveedor: " + error.message);
      return;
    }

    fetchProveedores();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Proveedores</h2>

      <ProveedorForm
        initialData={editingProveedor || undefined}
        onSubmit={(data) => {
          if (editingProveedor) handleEdit(editingProveedor.id, data);
          else handleCreate(data);
        }}
      />

      <ProveedorTable
        proveedores={proveedores}
        onEdit={(p) => setEditingProveedor(p)}
        onDelete={handleDelete}
      />
    </div>
  );
}
