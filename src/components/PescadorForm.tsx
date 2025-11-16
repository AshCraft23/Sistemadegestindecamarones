import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Pescador } from '../App';

interface PescadorFormProps {
  initialData?: Pescador;
  onSubmit: (data: Omit<Pescador, 'id'>) => void;
}

export function PescadorForm({ initialData, onSubmit }: PescadorFormProps) {
  const [formData, setFormData] = useState({
    nombre: initialData?.nombre || '',
    telefono: initialData?.telefono || '',
    especialidad: initialData?.especialidad || '',
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
          placeholder="Ej: Juan Pérez"
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
        <Label htmlFor="especialidad">Especialidad</Label>
        <Input
          id="especialidad"
          placeholder="Ej: Camarón Vannamei, General"
          value={formData.especialidad}
          onChange={(e) => setFormData({ ...formData, especialidad: e.target.value })}
          required
        />
      </div>

      <div className="flex items-center justify-between py-2">
        <Label htmlFor="activo">Pescador Activo</Label>
        <Switch
          id="activo"
          checked={formData.activo}
          onCheckedChange={(checked) => setFormData({ ...formData, activo: checked })}
        />
      </div>

      <Button 
        type="submit" 
        className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700"
      >
        {initialData ? 'Actualizar Pescador' : 'Crear Pescador'}
      </Button>
    </form>
  );
}
