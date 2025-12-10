import { useState, useEffect } from "react";
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

import { EstadoLote } from "../App";

interface LoteFormProps {
  onSubmit: (data: {
    nombre: string;
    fecha_inicio: string;
    fecha_estimada_pesca: string;
    tipo_camaron: string;
    estado: EstadoLote;
    costo_produccion: number;
  }) => void;
}

export function LoteForm({ onSubmit }: LoteFormProps) {
  const [form, setForm] = useState({
    nombre: "",
    fecha_inicio: new Date().toISOString().split("T")[0],
    fecha_estimada_pesca: "",
    tipo_camaron: "Vannamei",
    estado: "Crianza" as EstadoLote,
    costo_produccion: 0,
  });

  // Auto calcular +90 días
  useEffect(() => {
    const start = new Date(form.fecha_inicio);
    const est = new Date(start);
    est.setDate(start.getDate() + 90);

    setForm((prev) => ({
      ...prev,
      fecha_estimada_pesca: est.toISOString().split("T")[0],
    }));
  }, [form.fecha_inicio]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Nombre */}
      <div className="space-y-2">
        <Label>Nombre del lote</Label>
        <Input
          value={form.nombre}
          onChange={(e) => setForm({ ...form, nombre: e.target.value })}
          required
        />
      </div>

      {/* Fecha inicio */}
      <div className="space-y-2">
        <Label>Fecha de inicio</Label>
        <Input
          type="date"
          value={form.fecha_inicio}
          onChange={(e) => setForm({ ...form, fecha_inicio: e.target.value })}
          required
        />
      </div>

      {/* Fecha estimada pesca */}
      <div className="space-y-2">
        <Label>Fecha estimada de pesca</Label>
        <Input
          type="date"
          value={form.fecha_estimada_pesca}
          onChange={(e) =>
            setForm({ ...form, fecha_estimada_pesca: e.target.value })
          }
          required
        />
      </div>

      {/* Tipo camarón */}
      <div className="space-y-2">
        <Label>Tipo de camarón</Label>
        <Select
          value={form.tipo_camaron}
          onValueChange={(v) => setForm({ ...form, tipo_camaron: v })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Vannamei">Vannamei</SelectItem>
            <SelectItem value="Litopenaeus">Litopenaeus</SelectItem>
            <SelectItem value="Penaeus">Penaeus</SelectItem>
            <SelectItem value="Macrobrachium">Macrobrachium</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Estado */}
      <div className="space-y-2">
        <Label>Estado inicial</Label>
        <Select
          value={form.estado}
          onValueChange={(v: EstadoLote) => setForm({ ...form, estado: v })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Crianza">Crianza</SelectItem>
            <SelectItem value="Listo para Pescar">Listo para Pescar</SelectItem>
            <SelectItem value="Reposo">Reposo</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Costo */}
      <div className="space-y-2">
        <Label>Costo de producción</Label>
        <Input
          type="number"
          step="0.01"
          min="0"
          value={form.costo_produccion}
          onChange={(e) =>
            setForm({
              ...form,
              costo_produccion: parseFloat(e.target.value) || 0,
            })
          }
          required
        />
      </div>

      <Button className="w-full bg-cyan-600">Crear Lote</Button>
    </form>
  );
}
