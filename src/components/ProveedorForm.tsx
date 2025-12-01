import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Proveedor } from '../App';

interface ProveedorFormProps {
  initialData?: Proveedor;
  onSubmit: (data: Omit<Proveedor, 'id'>) => void;
}

export function ProveedorForm({ initialData, onSubmit }: ProveedorFormProps) {
  const [formData, setFormData] = useState({
    nombre: initialData?.nombre || '',
    contacto: initialData?.contacto || '',
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
        <Label htmlFor="nombre">Nombre de la Empresa</Label>
        <Input
          id="nombre"
          placeholder="Ej: Mariscos del Pacífico"
          value={formData.nombre}
          onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="contacto">Persona de Contacto</Label>
        <Input
          id="contacto"
          placeholder="Nombre del contacto"
          value={formData.contacto}
          onChange={(e) => setFormData({ ...formData, contacto: e.target.value })}
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
          placeholder="contacto@empresa.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
      </div>

      <div className="flex items-center justify-between py-2">
        <Label htmlFor="activo">Proveedor Activo</Label>
        <Switch
          id="activo"
          checked={formData.activo}
          onCheckedChange={(checked) => setFormData({ ...formData, activo: checked })}
        />
      </div>

      <Button 
        type="submit" 
        className="w-full bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700"
      >
        {initialData ? 'Actualizar Proveedor' : 'Crear Proveedor'}
      </Button>
    </form>
  );
}
