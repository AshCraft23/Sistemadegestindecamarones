import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";

interface PescadorFormProps {
  initialData?: any;
  onSubmit: (data: any) => void;
}

export function PescadorForm({ initialData, onSubmit }: PescadorFormProps) {
  const [formData, setFormData] = useState({
    nombre: initialData?.nombre || "",
    telefono: initialData?.telefono || "",
    especialidad: initialData?.especialidad || "",
    activo: initialData?.activo ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      <div className="space-y-2">
        <Label>Nombre</Label>
        <Input
          value={formData.nombre}
          onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Teléfono</Label>
        <Input
          value={formData.telefono}
          onChange={(e) =>
            setFormData({ ...formData, telefono: e.target.value })
          }
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Especialidad</Label>
        <Input
          value={formData.especialidad}
          onChange={(e) =>
            setFormData({ ...formData, especialidad: e.target.value })
          }
          required
        />
      </div>

      <div className="flex items-center justify-between py-2">
        <Label>Activo</Label>
        <Switch
          checked={formData.activo}
          onCheckedChange={(checked) =>
            setFormData({ ...formData, activo: checked })
          }
        />
      </div>

      <Button type="submit" className="w-full">
        {initialData ? "Actualizar Pescador" : "Crear Pescador"}
      </Button>
    </form>
  );
}
