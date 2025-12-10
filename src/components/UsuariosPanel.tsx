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

    // Validación básica
    if (!formData.nombre || !formData.username || !formData.password || !formData.rol) {
        alert("Todos los campos son obligatorios.");
        return;
    }

    if (editId) {
      // Nota: Aquí, si no se cambia la contraseña, idealmente no se debería enviar el hash
      // o se debería manejar el caso de actualización de contraseña por separado en la lógica de Supabase/Backend.
      // Por ahora, usamos el valor que tenga el estado.
      onUpdateUsuario(editId, formData);
      setEditId(null);
    } else {
      onCreateUsuario(formData);
    }

    // Limpiar formulario después de la operación
    setFormData({
      nombre: "",
      username: "",
      password: "", // Es importante limpiar la contraseña
      rol: "Vendedor",
      activo: true,
    });
  };

  const startEdit = (usuario: Usuario) => {
    setEditId(usuario.id);
    setFormData({
      nombre: usuario.nombre,
      username: usuario.username,
      // NOTA: No se debe precargar el password real aquí por seguridad.
      // Lo establecemos como vacío para forzar al usuario a ingresar uno nuevo
      // si desea actualizarlo, o enviamos un valor vacío si el backend
      // está configurado para ignorar el campo si está vacío en una actualización.
      password: "", 
      rol: usuario.rol,
      activo: usuario.activo,
    });
  };
  
  const cancelEdit = () => {
    setEditId(null);
    setFormData({
      nombre: "",
      username: "",
      password: "",
      rol: "Vendedor",
      activo: true,
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
              <Label htmlFor="nombre">Nombre</Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) =>
                  setFormData({ ...formData, nombre: e.target.value })
                }
                required
              />
            </div>

            {/* Username */}
            <div>
              <Label htmlFor="username">Usuario (Username/Email)</Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                required
              />
            </div>

            {/* Password */}
            <div>
              <Label htmlFor="password">Password {editId ? "(Dejar vacío para no cambiar)" : ""}</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required={!editId} // Requerido solo al crear
              />
            </div>

            {/* Rol (Campo insertado y corregido) */}
            <div className="space-y-1"> 
              <Label htmlFor="rol-select">Rol</Label>
              <Select
                value={formData.rol}
                onValueChange={(value) =>
                  setFormData({ ...formData, rol: value as UserRole })
                }
              >
                <SelectTrigger id="rol-select">
                  <SelectValue placeholder="Seleccionar rol" />
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
            <div className="flex items-center gap-2 pt-2">
              <Switch
                id="activo"
                checked={formData.activo}
                onCheckedChange={(value) =>
                  setFormData({ ...formData, activo: value })
                }
              />
              <Label htmlFor="activo">Activo</Label>
            </div>

            <div className="flex gap-2 pt-4">
                <Button 
                    type="submit" 
                    className="flex-1 bg-cyan-600 hover:bg-cyan-700"
                >
                    {editId ? "Guardar Cambios" : "Crear Usuario"}
                </Button>
                {editId && (
                    <Button type="button" variant="outline" onClick={cancelEdit}>
                        Cancelar Edición
                    </Button>
                )}
            </div>
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
                className="flex justify-between items-center border rounded-md p-3 bg-white hover:shadow-md transition-shadow"
              >
                <div>
                  <p className="font-semibold">{u.nombre} {editId === u.id && <span className="text-xs bg-yellow-100 text-yellow-800 px-2 rounded">Editando...</span>}</p>
                  <p className="text-sm text-gray-600">Usuario: {u.username}</p>
                  <p className="text-sm text-cyan-700 font-medium">Rol: {u.rol}</p>
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
                    disabled={editId !== null} // Deshabilitar si ya se está editando otro
                  >
                    Editar
                  </Button>

                  <Button
                    variant="destructive"
                    onClick={() => {
                        if (window.confirm(`¿Está seguro que desea eliminar a ${u.nombre}?`)) {
                            onDeleteUsuario(u.id);
                        }
                    }}
                    disabled={editId !== null}
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