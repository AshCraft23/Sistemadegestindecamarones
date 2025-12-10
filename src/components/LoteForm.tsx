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
  onSubmit: (loteData: {
    nombre: string;
    fecha_inicio: string;
    fecha_estimada_pesca: string;
    tipo_camaron: string;
    estado: EstadoLote;
    costo_produccion: number;
  }) => void;
}

export function LoteForm({ onSubmit }: LoteFormProps) {
  const [formData, setFormData] = useState({
    nombre: "",
    fecha_inicio: new Date().toISOString().split("T")[0],
    fecha_estimada_pesca: "",
    tipo_camaron: "Vannamei",
    estado: "Crianza" as EstadoLote,
    costo_produccion: 0,
  });

  // 📌 Inicializar fecha estimada la primera vez
  useEffect(() => {
    if (!formData.fecha_estimada_pesca) {
      const fecha = new Date(formData.fecha_inicio);
      fecha.setDate(fecha.getDate() + 90);
      setFormData((prev) => ({
        ...prev,
        fecha_estimada_pesca: fecha.toISOString().split("T")[0],
      }));
    }
  }, []);

  // 📌 Cuando cambia fecha_inicio → recalcular fecha_estimada solo si NO fue cambiada manualmente
  useEffect(() => {
    const nueva = new Date(formData.fecha_inicio);
    nueva.setDate(nueva.getDate() + 90);
    const nuevaISO = nueva.toISOString().split("T")[0];

    setFormData((prev) =>
      prev.fecha_estimada_pesca === nuevaISO
        ? prev // si coincide, no toca nada
        : { ...prev, fecha_estimada_pesca: nuevaISO }
    );
  }, [formData.fecha_inicio]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* Nombre */}
      <div className="space-y-2">
        <Label htmlFor="nombre">Nombre del Lote</Label>
        <Input
          id="nombre"
          placeholder="Ej: Piscina Norte A"
          value={formData.nombre}
          onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
          required
        />
      </div>

      {/* Fecha de inicio */}
      <div className="space-y-2">
        <Label htmlFor="fecha_inicio">Fecha de Inicio</Label>
        <Input
          id="fecha_inicio"
          type="date"
          value={formData.fecha_inicio}
          onChange={(e) =>
            setFormData({ ...formData, fecha_inicio: e.target.value })
          }
          required
        />
      </div>

      {/* Fecha estimada editable */}
      <div className="space-y-2">
        <Label htmlFor="fecha_estimada_pesca">
          Fecha Estimada de Pesca (editable)
        </Label>
        <Input
          id="fecha_estimada_pesca"
          type="date"
          value={formData.fecha_estimada_pesca}
          onChange={(e) =>
            setFormData({
              ...formData,
              fecha_estimada_pesca: e.target.value,
            })
          }
          required
        />
      </div>

      {/* Tipo de camarón */}
      <div className="space-y-2">
        <Label>Tipo de Camarón</Label>
        <Select
          value={formData.tipo_camaron}
          onValueChange={(value) =>
            setFormData({ ...formData, tipo_camaron: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecciona un tipo" />
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
        <Label>Estado Inicial</Label>
        <Select
          value={formData.estado}
          onValueChange={(value: EstadoLote) =>
            setFormData({ ...formData, estado: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecciona un estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Crianza">Crianza</SelectItem>
            <SelectItem value="Listo para Pescar">Listo para Pescar</SelectItem>
            <SelectItem value="Reposo">Reposo</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Costo de producción */}
      <div className="space-y-2">
        <Label htmlFor="costo_produccion">Costo de Producción</Label>
        <Input
          id="costo_produccion"
          type="number"
          min="0"
          step="0.01"
          placeholder="0.00"
          value={formData.costo_produccion}
          onChange={(e) =>
            setFormData({
              ...formData,
              costo_produccion: Number(e.target.value) || 0,
            })
          }
          required
        />
      </div>

      <Button className="w-full bg-cyan-600 hover:bg-cyan-700">
        Crear Lote
      </Button>
    </form>
  );
}
