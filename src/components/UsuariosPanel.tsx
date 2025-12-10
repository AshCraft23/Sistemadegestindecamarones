import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "./ui/select";

import { Badge } from "./ui/badge";
import { Eye, EyeOff, Edit2, Trash2 } from "lucide-react";

import { Usuario, UserRole } from "../App";

interface UsuariosPanelProps {
  usuarios: Usuario[];
  onCreateUsuario: (data: Omit<Usuario, "id">) => void;
  onUpdateUsuario: (id: string, data: Omit<Usuario, "id">) => void;
  onDeleteUsuario: (id: string) => void;
}

export function UsuariosPanel({
  usuarios,
  onCreateUsuario,
  onUpdateUsuario,
  onDeleteUsuario,
}: UsuariosPanelProps) {
  const [editId, setEditId] = useState<string | null>(null);

  const [formData, setFormData] = useState<Omit<Usuario, "id">>({
    nombre: "",
    username: "",
    password: "",
    rol: "Vendedor",
    activo: true,
  });

  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editId) {
      onUpdateUsuario(editId, formData);
      setEditId(null);
    } else {
      onCreateUsuario(formData);
    }

    setFormData({
      nombre: "",
      username: "",
      password: "",
      rol: "Vendedor",
      activo: true,
    });
  };

  const startEdit = (u: Usuario) => {
    setEditId(u.id);
    setFormData({
      nombre: u.nombre,
      username: u.username,
      password: u.password,
      rol: u.rol,
      activo: u.activo,
    });
  };

  const togglePassword = (id: string) => {
    setShowPassword((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const rolColors: Record<UserRole, string> = {
    Administrador: "bg-purple-100 text-purple-800 border-purple-300",
    Propietario: "bg-blue-100 text-blue-800 border-blue-300",
    Vendedor: "bg-green-100 text-green-800 border-green-300",
    Pescador: "bg-cyan-100 text-cyan-800 border-cyan-300",
  };

  return (
    <div className="space-y-8">
      {/* FORMULARIO */}
      <Card>
        <CardHeader>
          <CardTitle>
            {editId ? "Editar Usuario" : "Crear Nuevo Usuario"}
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nombre */}
            <div>
              <Label>Nombre</Label>
              <Input
                value={formData.nombre}
                onChange={(e) =>
                  setFormData({ ...formData, nombre: e.target.value })
                }
                required
              />
            </div>

            {/* Username */}
            <div>
              <Label>Usuario</Label>
              <Input
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                required
              />
            </div>

            {/* Password */}
            <div>
              <Label>Contraseña</Label>
              <Input
                type="text"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
              />
              <p className="text-xs text-gray-500">
                La contraseña se muestra en texto plano para facilitar gestión.
              </p>
            </div>

            {/* Rol */}
            <div>
              <Label>Rol</Label>
              <Select
                value={formData.rol}
                onValueChange={(value: UserRole) =>
                  setFormData({ ...formData, rol: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Administrador">Administrador</SelectItem>
                  <SelectItem value="Propietario">Propietario</SelectItem>
                  <SelectItem value="Vendedor">Vendedor</SelectItem>
                  <SelectItem value="Pescador">Pescador</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Activo */}
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

            <Button className="w-full">
              {editId ? "Guardar Cambios" : "Crear Usuario"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* LISTA DE USUARIOS */}
      <Card>
        <CardHeader>
          <CardTitle>Usuarios Registrados</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="space-y-3">
            {usuarios.length === 0 && (
              <p className="text-center text-gray-500">
                No hay usuarios registrados.
              </p>
            )}

            {usuarios.map((u) => (
              <div
                key={u.id}
                className="flex justify-between items-center p-3 border rounded-md bg-white"
              >
                <div>
                  <p className="font-bold">{u.nombre}</p>
                  <p className="text-sm text-gray-600">{u.username}</p>

                  <div className="flex items-center gap-2">
                    <span className="font-mono">
                      {showPassword[u.id] ? u.password : "••••••••"}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => togglePassword(u.id)}
                    >
                      {showPassword[u.id] ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                    </Button>
                  </div>

                  <Badge className={rolColors[u.rol]}>{u.rol}</Badge>

                  <Badge
                    className={
                      u.activo
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-200 text-gray-700"
                    }
                  >
                    {u.activo ? "Activo" : "Inactivo"}
                  </Badge>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => startEdit(u)}>
                    <Edit2 className="size-4" />
                  </Button>

                  <Button
                    variant="destructive"
                    onClick={() => onDeleteUsuario(u.id)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
