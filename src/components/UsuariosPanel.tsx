import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Badge } from "./ui/badge";
import { Plus, Edit2, Trash2, Eye, EyeOff } from "lucide-react";

import { Usuario, UserRole } from "../App";
import { supabase } from "@/lib/supabase";

export function UsuariosPanel() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<Usuario | null>(null);
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>(
    {}
  );

  const [formData, setFormData] = useState({
    nombre: "",
    username: "",
    password: "",
    rol: "Vendedor" as UserRole,
    activo: true,
  });

  // =====================================================
  // 🔥 FETCH USERS
  // =====================================================
  const fetchUsuarios = async () => {
    const { data, error } = await supabase
      .from("usuarios")
      .select("*")
      .order("nombre");

    if (!error) setUsuarios(data);
  };

  // =====================================================
  // 🔥 REALTIME SUBSCRIPTION
  // =====================================================
  useEffect(() => {
    fetchUsuarios();

    const channel = supabase
      .channel("realtime:usuarios")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "usuarios" },
        () => {
          fetchUsuarios();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // =====================================================
  // 🔥 CREATE OR UPDATE USER
  // =====================================================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingUser) {
      // UPDATE
      const { error } = await supabase
        .from("usuarios")
        .update(formData)
        .eq("id", editingUser.id);

      if (error) return alert("Error actualizando usuario: " + error.message);
    } else {
      // CREATE
      const { error } = await supabase.from("usuarios").insert(formData);
      if (error) return alert("Error creando usuario: " + error.message);
    }

    setFormData({
      nombre: "",
      username: "",
      password: "",
      rol: "Vendedor",
      activo: true,
    });
    setEditingUser(null);
    setShowForm(false);
  };

  // =====================================================
  // 🔥 DELETE USER
  // =====================================================
  const handleDelete = async (id: string) => {
    if (!confirm("¿Seguro deseas eliminar este usuario?")) return;

    const { error } = await supabase.from("usuarios").delete().eq("id", id);
    if (error) alert("Error eliminando usuario: " + error.message);
  };

  const handleEdit = (user: Usuario) => {
    setFormData({
      nombre: user.nombre,
      username: user.username,
      password: user.password,
      rol: user.rol,
      activo: user.activo,
    });
    setEditingUser(user);
    setShowForm(true);
  };

  const togglePasswordVisibility = (userId: string) => {
    setShowPasswords((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }));
  };

  const rolColors: Record<UserRole, string> = {
    Administrador: "bg-purple-100 text-purple-800 border-purple-200",
    Propietario: "bg-blue-100 text-blue-800 border-blue-200",
    Vendedor: "bg-green-100 text-green-800 border-green-200",
    Pescador: "bg-cyan-100 text-cyan-800 border-cyan-200",
  };

  return (
    <div className="space-y-4">
      {/* Botón */}
      <div className="flex justify-end">
        <Dialog
          open={showForm}
          onOpenChange={(open) => {
            setShowForm(open);
            if (!open) {
              setEditingUser(null);
              setFormData({
                nombre: "",
                username: "",
                password: "",
                rol: "Vendedor",
                activo: true,
              });
            }
          }}
        >
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-purple-600 to-indigo-600">
              <Plus className="mr-2 size-4" />
              {editingUser ? "Editar Usuario" : "Nuevo Usuario"}
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingUser ? "Editar Usuario" : "Nuevo Usuario"}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="nombre">Nombre Completo</Label>
                <Input
                  id="nombre"
                  value={formData.nombre}
                  onChange={(e) =>
                    setFormData({ ...formData, nombre: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="username">Usuario</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <Label>Rol</Label>
                <Select
                  value={formData.rol}
                  onValueChange={(value: UserRole) =>
                    setFormData({ ...formData, rol: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione rol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Administrador">
                      Administrador
                    </SelectItem>
                    <SelectItem value="Propietario">Propietario</SelectItem>
                    <SelectItem value="Vendedor">Vendedor</SelectItem>
                    <SelectItem value="Pescador">Pescador</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.activo}
                  onChange={(e) =>
                    setFormData({ ...formData, activo: e.target.checked })
                  }
                />
                <Label>Activo</Label>
              </div>

              <Button type="submit" className="w-full">
                {editingUser ? "Actualizar" : "Crear Usuario"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabla */}
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Usuario</TableHead>
                <TableHead>Contraseña</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Activo</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {usuarios.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.nombre}</TableCell>
                  <TableCell>{user.username}</TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2">
                      {showPasswords[user.id] ? user.password : "••••••••"}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => togglePasswordVisibility(user.id)}
                      >
                        {showPasswords[user.id] ? (
                          <EyeOff className="size-4" />
                        ) : (
                          <Eye className="size-4" />
                        )}
                      </Button>
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge className={rolColors[user.rol]}>{user.rol}</Badge>
                  </TableCell>

                  <TableCell>
                    <Badge
                      className={
                        user.activo
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-200 text-gray-800"
                      }
                    >
                      {user.activo ? "Activo" : "Inactivo"}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(user)}>
                        <Edit2 className="size-4" />
                      </Button>

                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(user.id)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
