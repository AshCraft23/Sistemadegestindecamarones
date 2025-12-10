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

  // === SUBMIT ===
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

  const startEdit = (u: Usuario) => {
    setEditingUser(u);
    setFormData({
      nombre: u.nombre,
      username: u.username,
      password: u.password,
      rol: u.rol,
      activo: u.activo,
    });
    setShowForm(true);
  };

  const togglePass = (id: string) =>
    setShowPasswords((p) => ({ ...p, [id]: !p[id] }));

  const rolColors: Record<UserRole, string> = {
    Administrador: "bg-purple-100 text-purple-800",
    Propietario: "bg-blue-100 text-blue-800",
    Vendedor: "bg-green-100 text-green-800",
    Pescador: "bg-cyan-100 text-cyan-800",
  };

  return (
    <div className="space-y-6">
      {/* Botón Nuevo Usuario */}
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

              {/* Usuario */}
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
              </div>

              {/* Rol */}
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

              <Button type="submit" className="w-full">
                {editingUser ? "Guardar Cambios" : "Crear Usuario"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabla Usuarios */}
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
              {usuarios.map((u) => (
                <TableRow key={u.id}>
                  <TableCell>{u.id}</TableCell>
                  <TableCell>{u.nombre}</TableCell>
                  <TableCell>{u.username}</TableCell>

                  {/* Password con ocultar/mostrar */}
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-mono">
                        {showPasswords[u.id] ? u.password : "••••••••"}
                      </span>

                      <Button variant="ghost" size="sm" onClick={() => togglePass(u.id)}>
                        {showPasswords[u.id] ? (
                          <EyeOff className="w-4" />
                        ) : (
                          <Eye className="w-4" />
                        )}
                      </Button>
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge className={rolColors[u.rol]}>{u.rol}</Badge>
                  </TableCell>

                  <TableCell>
                    <Badge
                      className={
                        u.activo
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-200 text-gray-800"
                      }
                    >
                      {u.activo ? "Activo" : "Inactivo"}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => startEdit(u)}>
                        <Edit2 className="w-4" />
                      </Button>

                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => onDeleteUsuario(u.id)}
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
