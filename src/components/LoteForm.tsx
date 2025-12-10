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

  // Calcular fecha estimada de pesca = 90 días después
  useEffect(() => {
    const fecha = new Date(formData.fecha_inicio);
    const estimada = new Date(fecha);
    estimada.setDate(fecha.getDate() + 90);

    setFormData((f) => ({
      ...f,
      fecha_estimada_pesca: estimada.toISOString().split("T")[0],
    }));
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
          value={formData.nombre}
          onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
          required
        />
      </div>

      {/* Fecha inicio */}
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

      {/* Fecha estimada pesca */}
      <div className="space-y-2">
        <Label htmlFor="fecha_estimada_pesca">Fecha Estimada de Pesca</Label>
        <Input
          id="fecha_estimada_pesca"
          type="date"
          value={formData.fecha_estimada_pesca}
          onChange={(e) =>
            setFormData({ ...formData, fecha_estimada_pesca: e.target.value })
          }
          required
        />
      </div>

      {/* Tipo de camaron */}
      <div className="space-y-2">
        <Label>Tipo de Camarón</Label>
        <Select
          value={formData.tipo_camaron}
          onValueChange={(value) =>
            setFormData({ ...formData, tipo_camaron: value })
          }
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
        <Label>Estado Inicial</Label>
        <Select
          value={formData.estado}
          onValueChange={(value: EstadoLote) =>
            setFormData({ ...formData, estado: value })
          }
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

      {/* Costo producción */}
      <div className="space-y-2">
        <Label htmlFor="costo_produccion">Costo de Producción</Label>
        <Input
          id="costo_produccion"
          type="number"
          value={formData.costo_produccion}
          onChange={(e) =>
            setFormData({
              ...formData,
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
