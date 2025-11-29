import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Plus, Edit2, Trash2, Eye, EyeOff } from 'lucide-react';
import { Usuario, UserRole } from '../App';

// En producción, esto vendría de una API/Base de datos
const usuariosIniciales: Usuario[] = [
  {
    id: 'U-001',
    nombre: 'Admin Principal',
    username: 'admin',
    password: 'admin123',
    rol: 'Administrador',
    activo: true
  },
  {
    id: 'U-002',
    nombre: 'Propietario Principal',
    username: 'propietario',
    password: 'prop123',
    rol: 'Propietario',
    activo: true
  },
  {
    id: 'U-003',
    nombre: 'María González',
    username: 'maria',
    password: 'vend123',
    rol: 'Vendedor',
    activo: true
  },
  {
    id: 'U-004',
    nombre: 'Juan Pérez',
    username: 'juan',
    password: 'pesc123',
    rol: 'Pescador',
    activo: true
  }
];

export function UsuariosPanel() {
  const [usuarios, setUsuarios] = useState<Usuario[]>(usuariosIniciales);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<Usuario | null>(null);
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [formData, setFormData] = useState({
    nombre: '',
    username: '',
    password: '',
    rol: 'Vendedor' as UserRole,
    activo: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingUser) {
      // Actualizar usuario existente
      setUsuarios(usuarios.map(u =>
        u.id === editingUser.id ? { ...formData, id: editingUser.id } : u
      ));
    } else {
      // Crear nuevo usuario
      const newUser: Usuario = {
        ...formData,
        id: `U-${String(usuarios.length + 1).padStart(3, '0')}`
      };
      setUsuarios([...usuarios, newUser]);
    }
    
    setFormData({
      nombre: '',
      username: '',
      password: '',
      rol: 'Vendedor',
      activo: true
    });
    setEditingUser(null);
    setShowForm(false);
  };

  const handleEdit = (user: Usuario) => {
    setFormData({
      nombre: user.nombre,
      username: user.username,
      password: user.password,
      rol: user.rol,
      activo: user.activo
    });
    setEditingUser(user);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Estás seguro de eliminar este usuario?')) {
      setUsuarios(usuarios.filter(u => u.id !== id));
    }
  };

  const togglePasswordVisibility = (userId: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  const rolColors: Record<UserRole, string> = {
    'Administrador': 'bg-purple-100 text-purple-800 border-purple-200',
    'Propietario': 'bg-blue-100 text-blue-800 border-blue-200',
    'Vendedor': 'bg-green-100 text-green-800 border-green-200',
    'Pescador': 'bg-cyan-100 text-cyan-800 border-cyan-200'
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={showForm} onOpenChange={(open) => {
          setShowForm(open);
          if (!open) {
            setEditingUser(null);
            setFormData({
              nombre: '',
              username: '',
              password: '',
              rol: 'Vendedor',
              activo: true
            });
          }
        }}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
              <Plus className="mr-2 size-4" />
              {editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre Completo</Label>
                <Input
                  id="nombre"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Nombre de Usuario</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="text"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
                <p className="text-xs text-gray-500">La contraseña se mostrará en texto plano para facilitar la gestión</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="rol">Rol</Label>
                <Select
                  value={formData.rol}
                  onValueChange={(value: UserRole) => setFormData({ ...formData, rol: value })}
                >
                  <SelectTrigger id="rol">
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

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="activo"
                  checked={formData.activo}
                  onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="activo">Usuario Activo</Label>
              </div>

              <Button type="submit" className="w-full">
                {editingUser ? 'Actualizar Usuario' : 'Crear Usuario'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

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
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-mono">
                        {showPasswords[user.id] ? user.password : '••••••••'}
                      </span>
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
                    <Badge className={rolColors[user.rol]}>
                      {user.rol}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={user.activo ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                      {user.activo ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(user)}
                      >
                        <Edit2 className="size-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
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
