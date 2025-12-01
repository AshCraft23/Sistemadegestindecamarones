import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Vendedor } from '../App';

interface VendedorFormProps {
  initialData?: Vendedor;
  onSubmit: (data: Omit<Vendedor, 'id'>) => void;
}

export function VendedorForm({ initialData, onSubmit }: VendedorFormProps) {
  const [formData, setFormData] = useState({
    nombre: initialData?.nombre || '',
    telefono: initialData?.telefono || '',
    email: initialData?.email || '',
    activo: initialData?.activo ?? true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="nombre">Nombre Completo</Label>
        <Input
          id="nombre"
          placeholder="Ej: María González"
          value={formData.nombre}
          onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="telefono">Teléfono</Label>
        <Input
          id="telefono"
          type="tel"
          placeholder="+593-99-123-4567"
          value={formData.telefono}
          onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="vendedor@gelca.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
      </div>

      <div className="flex items-center justify-between py-2">
        <Label htmlFor="activo">Vendedor Activo</Label>
        <Switch
          id="activo"
          checked={formData.activo}
          onCheckedChange={(checked) => setFormData({ ...formData, activo: checked })}
        />
      </div>

      <Button 
        type="submit" 
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
      >
        {initialData ? 'Actualizar Vendedor' : 'Crear Vendedor'}
      </Button>
    </form>
  );
}
