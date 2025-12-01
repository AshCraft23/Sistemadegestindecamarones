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
  const [formData, setFormData] = useState({
    nombre: '',
    fechaInicio: new Date().toISOString().split('T')[0],
    fechaEstimadaPesca: '',
    tipoCamaron: 'Vannamei',
    estado: 'Crianza' as EstadoLote,
    costoProduccion: 0
  });

  // Calcular fecha estimada de pesca (90 días después de la fecha de inicio)
  useEffect(() => {
    if (formData.fechaInicio) {
      const fechaInicio = new Date(formData.fechaInicio);
      const fechaEstimada = new Date(fechaInicio);
      fechaEstimada.setDate(fechaEstimada.getDate() + 90);
      setFormData(prev => ({
        ...prev,
        fechaEstimadaPesca: fechaEstimada.toISOString().split('T')[0]
      }));
    }
  }, [formData.fechaInicio]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      nombre: '',
      fechaInicio: new Date().toISOString().split('T')[0],
      fechaEstimadaPesca: '',
      tipoCamaron: 'Vannamei',
      estado: 'Crianza',
      costoProduccion: 0
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
        <Label htmlFor="fechaEstimadaPesca">Fecha Estimada de Pesca (90 días)</Label>
        <Input
          id="fechaEstimadaPesca"
          type="date"
          value={formData.fechaEstimadaPesca}
          onChange={(e) => setFormData({ ...formData, fechaEstimadaPesca: e.target.value })}
          required
        />
        <p className="text-xs text-gray-500">Se calcula automáticamente 90 días después de la fecha de inicio</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="tipoCamaron">Tipo de Camarón</Label>
        <Select
          value={formData.tipoCamaron}
          onValueChange={(value) => setFormData({ ...formData, tipoCamaron: value })}
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

      <div className="space-y-2">
        <Label htmlFor="estado">Estado Inicial</Label>
        <Select
          value={formData.estado}
          onValueChange={(value: EstadoLote) => setFormData({ ...formData, estado: value })}
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

      <Button 
        type="submit" 
        className="w-full bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700"
      >
        Crear Lote
      </Button>
    </form>
  );
}