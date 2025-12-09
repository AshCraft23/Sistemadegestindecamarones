import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { supabase } from '@/lib/supabase';

interface ProveedorFormProps {
  initialData?: any;      // objeto proveedor para editar
  onSubmit?: () => void;  // callback para recargar lista y cerrar modal, etc.
}

export function ProveedorForm({ initialData, onSubmit }: ProveedorFormProps) {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    nombre: initialData?.nombre || '',
    contacto: initialData?.contacto || '',
    telefono: initialData?.telefono || '',
    email: initialData?.email || '',
    activo: initialData?.activo ?? true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let response;

      // 🔁 EDITAR proveedor existente
      if (initialData?.id) {
        response = await supabase
          .from('proveedores')
          .update({
            nombre: formData.nombre,
            contacts: formData.contacto, // 👈 se guarda en la columna "contacts"
            telefono: formData.telefono,
            email: formData.email,
            activo: formData.activo,
          })
          .eq('id', initialData.id);
      } else {
        // 🆕 CREAR nuevo proveedor
        response = await supabase.from('proveedores').insert([
          {
            nombre: formData.nombre,
            contacts: formData.contacto, // 👈 se guarda en "contacts"
            telefono: formData.telefono,
            email: formData.email,
            activo: formData.activo,
          },
        ]);
      }

      const { error } = response;

      if (error) {
        console.error('Error al guardar proveedor:', error);
        alert('Error: ' + error.message);
        return;
      }

      alert('Proveedor guardado correctamente.');
      onSubmit?.();
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="nombre">Nombre de la Empresa</Label>
        <Input
          id="nombre"
          placeholder="Ej: Mariscos del Pacífico"
          value={formData.nombre}
          onChange={(e) =>
            setFormData({ ...formData, nombre: e.target.value })
          }
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="contacto">Persona de Contacto</Label>
        <Input
          id="contacto"
          placeholder="Nombre del contacto"
          value={formData.contacto}
          onChange={(e) =>
            setFormData({ ...formData, contacto: e.target.value })
          }
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
          onChange={(e) =>
            setFormData({ ...formData, telefono: e.target.value })
          }
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
          onChange={(e) =>
            setFormData({ ...formData, email: e.target.value })
          }
          required
        />
      </div>

      <div className="flex items-center justify-between py-2">
        <Label htmlFor="activo">Proveedor Activo</Label>
        <Switch
          id="activo"
          checked={formData.activo}
          onCheckedChange={(checked) =>
            setFormData({ ...formData, activo: checked })
          }
        />
      </div>

      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700"
        disabled={loading}
      >
        {loading
          ? 'Guardando...'
          : initialData
          ? 'Actualizar Proveedor'
          : 'Crear Proveedor'}
      </Button>
    </form>
  );
}
