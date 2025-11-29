import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { AlertCircle } from 'lucide-react';
import { Usuario } from '../App';

// Usuarios de prueba (en producción real esto estaría en una base de datos)
const usuarios: Usuario[] = [
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

interface LoginFormProps {
  onLogin: (user: Usuario) => void;
}

export function LoginForm({ onLogin }: LoginFormProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const user = usuarios.find(
      u => u.username === username && u.password === password && u.activo
    );

    if (user) {
      onLogin(user);
    } else {
      setError('Usuario o contraseña incorrectos');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="username">Usuario</Label>
        <Input
          id="username"
          type="text"
          placeholder="Ingrese su usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Contraseña</Label>
        <Input
          id="password"
          type="password"
          placeholder="Ingrese su contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700"
      >
        Iniciar Sesión
      </Button>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-600 mb-2">Usuarios de prueba:</p>
        <div className="text-xs text-gray-500 space-y-1">
          <p>• admin / admin123 (Administrador)</p>
          <p>• propietario / prop123 (Propietario)</p>
          <p>• maria / vend123 (Vendedor)</p>
          <p>• juan / pesc123 (Pescador)</p>
        </div>
      </div>
    </form>
  );
}
