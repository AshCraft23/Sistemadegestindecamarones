import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { EstadoLote } from '../App';

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

  const hoy = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    nombre: "",
    fechaInicio: hoy,
    fechaEstimadaPesca: "",
    tipoCamaron: "Vannamei",
    estado: "Crianza" as EstadoLote,
    costoProduccion: 0,
  });

  // Calcular fecha estimada automáticamente
  useEffect(() => {
    if (formData.fechaInicio) {
      const f = new Date(formData.fechaInicio);
      f.setDate(f.getDate() + 90);
      setFormData((prev) => ({
        ...prev,
        fechaEstimadaPesca: f.toISOString().split("T")[0],
      }));
    }
  }, [formData.fechaInicio]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validación extra por si acaso
    if (!formData.fechaInicio) {
      alert("La fecha de inicio no puede estar vacía.");
      return;
    }

    onSubmit(formData);

    // Reset
    setFormData({
      nombre: "",
      fechaInicio: hoy,
      fechaEstimadaPesca: "",
      tipoCamaron: "Vannamei",
      estado: "Crianza",
      costoProduccion: 0,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      <div className="space-y-2">
        <Label htmlFor="nombre">Nombre del Lote</Label>
        <Input
          id="nombre"
          value={formData.nombre}
          onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="fechaInicio">Fecha de Inicio</Label>
        <Input
          id="fechaInicio"
          type="date"
          value={formData.fechaInicio}
          onChange={(e) => setFormData({ ...formData, fechaInicio: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Fecha Estimada de Pesca (Automática)</Label>
        <Input
          type="date"
          value={formData.fechaEstimadaPesca}
          disabled
        />
      </div>

      <div className="space-y-2">
        <Label>Tipo de Camarón</Label>
        <Select
          value={formData.tipoCamaron}
          onValueChange={(val) => setFormData({ ...formData, tipoCamaron: val })}
        >
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="Vannamei">Vannamei</SelectItem>
            <SelectItem value="Litopenaeus">Litopenaeus</SelectItem>
            <SelectItem value="Penaeus">Penaeus</SelectItem>
            <SelectItem value="Macrobrachium">Macrobrachium</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Estado Inicial</Label>
        <Select
          value={formData.estado}
          onValueChange={(value: EstadoLote) => setFormData({ ...formData, estado: value })}
        >
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="Crianza">Crianza</SelectItem>
            <SelectItem value="Listo para Pescar">Listo para Pescar</SelectItem>
            <SelectItem value="Reposo">Reposo</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="costo">Costo de Producción</Label>
        <Input
          id="costo"
          type="number"
          min="0"
          step="0.01"
          value={formData.costoProduccion}
          onChange={(e) =>
            setFormData({ ...formData, costoProduccion: parseFloat(e.target.value) || 0 })
          }
          required
        />
      </div>

      <Button className="w-full bg-gradient-to-r from-cyan-600 to-teal-600 text-white">
        Crear Lote
      </Button>
    </form>
  );
}
