import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import { UsuariosTable } from "./UsuariosTable";

interface Usuario {
  id: string;
  name: string;
  username: string;
  email: string;
  password: string;
  role: string;
  active: boolean;
}

export function UsuariosPanel() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<Usuario | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    role: "Administrador",
    active: true,
  });

  // ======================================================
  // 📌 CARGAR USUARIOS
  // ======================================================
  const fetchUsuarios = async () => {
    const { data, error } = await supabase.from("users").select("*");

    if (error) {
      console.error("Error cargando usuarios:", error);
      return;
    }

    setUsuarios(data);
  };

  // ======================================================
  // 🔥 REALTIME (se actualiza solo como proveedores)
  // ======================================================
  useEffect(() => {
    fetchUsuarios();

    const channel = supabase
      .channel("realtime:users")
      .on(
        "postgres_changes",
        { event: "*", table: "users", schema: "public" },
        () => fetchUsuarios()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // ======================================================
  // 🟢 CREAR USUARIO
  // ======================================================
  const onCreateUsuario = async () => {
    const { error } = await supabase.from("users").insert(formData);

    if (error) {
      alert("Error creando usuario: " + error.message);
      return;
    }

    setShowForm(false);
  };

  // ======================================================
  // 🟡 EDITAR USUARIO
  // ======================================================
  const onUpdateUsuario = async () => {
    if (!editingUser) return;

    const { error } = await supabase
      .from("users")
      .update(formData)
      .eq("id", editingUser.id);

    if (error) {
      alert("Error actualizando usuario: " + error.message);
      return;
    }

    setEditingUser(null);
    setShowForm(false);
  };

  // ======================================================
  // 🔴 ELIMINAR USUARIO
  // ======================================================
  const onDeleteUsuario = async (id: string) => {
    const { error } = await supabase.from("users").delete().eq("id", id);

    if (error) {
      alert("Error eliminando usuario: " + error.message);
      return;
    }
  };

  // ======================================================
  // 📌 Abrir modal para editar
  // ======================================================
  const openEdit = (u: Usuario) => {
    setEditingUser(u);
    setFormData({
      name: u.name,
      username: u.username,
      email: u.email,
      password: u.password,
      role: u.role,
      active: u.active,
    });
    setShowForm(true);
  };

  // ======================================================
  // 📌 Abrir modal para crear
  // ======================================================
  const openCreate = () => {
    setEditingUser(null);
    setFormData({
      name: "",
      username: "",
      email: "",
      password: "",
      role: "Administrador",
      active: true,
    });
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      {/* Botón crear usuario */}
      <div className="flex justify-end">
        <Button
          className="bg-gradient-to-r from-cyan-600 to-teal-600"
          onClick={openCreate}
        >
          <Plus className="mr-2 size-4" /> Crear Usuario
        </Button>
      </div>

      {/* Tabla */}
      <UsuariosTable
        usuarios={usuarios}
        onEdit={openEdit}
        onDelete={onDeleteUsuario}
      />

      {/* Modal */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingUser ? "Editar Usuario" : "Crear Usuario"}
            </DialogTitle>
          </DialogHeader>

          {/* FORMULARIO */}
          <div className="space-y-4">
            <input
              className="border p-2 w-full rounded"
              placeholder="Nombre completo"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />

            <input
              className="border p-2 w-full rounded"
              placeholder="Usuario"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
            />

            <input
              className="border p-2 w-full rounded"
              placeholder="Email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />

            <input
              className="border p-2 w-full rounded"
              placeholder="Contraseña"
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />

            {/* ROLE */}
            <select
              className="border p-2 w-full rounded"
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
            >
              <option value="Administrador">Administrador</option>
              <option value="Propietario">Propietario</option>
              <option value="Vendedor">Vendedor</option>
              <option value="Pescador">Pescador</option>
            </select>

            {/* Activo/inactivo */}
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.active}
                onChange={(e) =>
                  setFormData({ ...formData, active: e.target.checked })
                }
              />
              Activo
            </label>

            {/* BOTÓN GUARDAR */}
            <Button
              className="w-full bg-gradient-to-r from-cyan-600 to-teal-600"
              onClick={editingUser ? onUpdateUsuario : onCreateUsuario}
            >
              {editingUser ? "Guardar Cambios" : "Crear Usuario"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
