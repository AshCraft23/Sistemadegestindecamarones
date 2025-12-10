import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "./ui/card";
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
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Eye, EyeOff, Plus, Edit2, Trash2 } from "lucide-react";
import { Badge } from "./ui/badge";
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
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<Usuario | null>(null);

  const [formData, setFormData] = useState<Omit<Usuario, "id">>({
    nombre: "",
    username: "",
    password: "",
    rol: "Vendedor",
    activo: true,
  });

  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>(
    {}
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingUser) {
      onUpdateUsuario(editingUser.id, formData);
    } else {
      onCreateUsuario(formData);
    }

    setEditingUser(null);
    setShowForm(false);

    setFormData({
      nombre: "",
      username: "",
      password: "",
      rol: "Vendedor",
      activo: true,
    });
  };

  const startEdit = (user: Usuario) => {
    setEditingUser(user);
    setFormData({
      nombre: user.nombre,
      username: user.username,
      password: user.password,
      rol: user.rol,
      activo: user.activo,
    });
    setShowForm(true);
  };

  const togglePassword = (id: string) => {
    setShowPasswords((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const rolColors: Record<UserRole, string> = {
    Administrador: "bg-purple-100 text-purple-800 border-purple-200",
    Propietario: "bg-blue-100 text-blue-800 border-blue-200",
    Vendedor: "bg-green-100 text-green-800 border-green-200",
    Pescador: "bg-cyan-100 text-cyan-800 border-cyan-200",
  };

  return (
    <div className="space-y-6">
      {/* Botón Crear */}
      <div className="flex justify-end">
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
              <Plus className="mr-2 w-4" />
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
                <Label>Nombre Completo</Label>
                <Input
                  value={formData.nombre}
                  onChange={(e) =>
                    setFormData({ ...formData, nombre: e.target.value })
                  }
                  required
                />
              </div>

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
              </div>

              <div>
                <Label>Rol</Label>
                <Select
                  value={formData.rol}
                  onValueChange={(v: UserRole) =>
                    setFormData({ ...formData, rol: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar rol" />
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
                <Label>Usuario activo</Label>
              </div>

              <Button type="submit" className="w-full">
                {editingUser ? "Guardar Cambios" : "Crear Usuario"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabla */}
      <Card>
        <CardHeader>
          <CardTitle>Usuarios Registrados</CardTitle>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Usuario</TableHead>
                <TableHead>Contraseña</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {usuarios.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.nombre}</TableCell>
                  <TableCell>{user.username}</TableCell>

                  {/* Contraseña */}
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-mono">
                        {showPasswords[user.id]
                          ? user.password
                          : "••••••••"}
                      </span>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => togglePassword(user.id)}
                      >
                        {showPasswords[user.id] ? (
                          <EyeOff className="w-4" />
                        ) : (
                          <Eye className="w-4" />
                        )}
                      </Button>
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge className={rolColors[user.rol]}>
                      {user.rol}
                    </Badge>
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
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => startEdit(user)}
                      >
                        <Edit2 className="w-4" />
                      </Button>

                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => onDeleteUsuario(user.id)}
                      >
                        <Trash2 className="w-4" />
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
