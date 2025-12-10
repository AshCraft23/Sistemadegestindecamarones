import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "./ui/select";
import { Switch } from "./ui/switch";
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
  const [formData, setFormData] = useState<Omit<Usuario, "id">>({
    nombre: "",
    username: "",
    password: "",
    rol: "Vendedor",
    activo: true,
  });

  const [editId, setEditId] = useState<string | null>(null);

  // ==================================================
  // SUBMIT CREAR / ACTUALIZAR
  // ==================================================
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

  const startEdit = (usuario: Usuario) => {
    setEditId(usuario.id);
    setFormData({
      nombre: usuario.nombre,
      username: usuario.username,
      password: usuario.password,
      rol: usuario.rol,
      activo: usuario.activo,
    });
  };

  return (
    <div className="space-y-8">
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
              <Label>Password</Label>
              <Input
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
              />
            </div>

            <Label>Rol</Label>
              <Select
                value={formData.rol}
                onValueChange={(value) =>
                  setFormData({ ...formData, rol: value as UserRole })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar rol" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="Administrador">Administrador</SelectItem>
                  <SelectItem value="Propietario">Propietario</SelectItem>
                  <SelectItem value="Vendedor">Vendedor</SelectItem>
                  <SelectItem value="Pescador">Pescador</SelectItem>
                </SelectContent>
              </Select>


            {/* Activo */}
            <div className="flex items-center gap-2 mt-2">
              <Switch
                checked={formData.activo}
                onCheckedChange={(value) =>
                  setFormData({ ...formData, activo: value })
                }
              />
              <Label>Activo</Label>
            </div>

            <Button className="w-full bg-cyan-600 hover:bg-cyan-700">
              {editId ? "Guardar Cambios" : "Crear Usuario"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Tabla de usuarios */}
      <Card>
        <CardHeader>
          <CardTitle>Usuarios Registrados</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="space-y-2">
            {usuarios.length === 0 && (
              <p className="text-gray-500 text-center">
                No hay usuarios registrados
              </p>
            )}

            {usuarios.map((u) => (
              <div
                key={u.id}
                className="flex justify-between items-center border rounded-md p-3 bg-white"
              >
                <div>
                  <p className="font-semibold">{u.nombre}</p>
                  <p className="text-sm text-gray-600">{u.username}</p>
                  <p className="text-sm text-gray-700">{u.rol}</p>
                  <p
                    className={
                      u.activo ? "text-green-600 text-sm" : "text-red-600 text-sm"
                    }
                  >
                    {u.activo ? "Activo" : "Inactivo"}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => startEdit(u)}
                  >
                    Editar
                  </Button>

                  <Button
                    variant="destructive"
                    onClick={() => onDeleteUsuario(u.id)}
                  >
                    Eliminar
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
