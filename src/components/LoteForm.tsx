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
    fechaInicio: string;
    fechaEstimadaPesca: string;
    tipoCamaron: string;
    estado: EstadoLote;
    costoProduccion: number;
  }) => void;
}

export function LoteForm({ onSubmit }: LoteFormProps) {
  const [formData, setFormData] = useState({
    nombre: "",
    fechaInicio: new Date().toISOString().split("T")[0],
    fechaEstimadaPesca: "",
    tipoCamaron: "Vannamei",
    estado: "Crianza" as EstadoLote,
    costoProduccion: 0,
  });

  // 🧮 Calcular fecha estimada de pesca = 90 días después
  useEffect(() => {
    const fecha = new Date(formData.fechaInicio);
    const estimada = new Date(fecha);
    estimada.setDate(fecha.getDate() + 90);

    setFormData((f) => ({
      ...f,
      fechaEstimadaPesca: estimada.toISOString().split("T")[0],
    }));
  }, [formData.fechaInicio]);

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

      {/* Fecha inicio */}
      <div className="space-y-2">
        <Label htmlFor="fechaInicio">Fecha de Inicio</Label>
        <Input
          id="fechaInicio"
          type="date"
          value={formData.fechaInicio}
          onChange={(e) =>
            setFormData({ ...formData, fechaInicio: e.target.value })
          }
          required
        />
      </div>

      {/* Fecha estimada pesca */}
      <div className="space-y-2">
        <Label htmlFor="fechaEstimadaPesca">
          Fecha Estimada de Pesca (90 días)
        </Label>
        <Input
          id="fechaEstimadaPesca"
          type="date"
          value={formData.fechaEstimadaPesca}
          onChange={(e) =>
            setFormData({ ...formData, fechaEstimadaPesca: e.target.value })
          }
          required
        />
      </div>

      {/* Tipo camaron */}
      <div className="space-y-2">
        <Label>Tipo de Camarón</Label>
        <Select
          value={formData.tipoCamaron}
          onValueChange={(value) =>
            setFormData({ ...formData, tipoCamaron: value })
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

      {/* Costo */}
      <div className="space-y-2">
        <Label htmlFor="costoProduccion">Costo de Producción</Label>
        <Input
          id="costoProduccion"
          type="number"
          min="0"
          step="0.01"
          placeholder="0.00"
          value={formData.costoProduccion}
          onChange={(e) =>
            setFormData({
              ...formData,
              costoProduccion: parseFloat(e.target.value) || 0,
            })
          }
          required
        />
      </div>

      <Button className="w-full bg-cyan-600">Crear Lote</Button>
    </form>
  );
}
