import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { EstadoLote } from '../App';

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
    nombre: '',
    fechaInicio: new Date().toISOString().split('T')[0], // FRONTEND
    fechaEstimadaPesca: '',
    tipoCamaron: 'Vannamei',
    estado: 'Crianza' as EstadoLote,
    costoProduccion: 0
  });

  // Calcular automáticamente los 90 días
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

    // MAPEO CORRECTO A SUPABASE
    const payload = {
      nombre: formData.nombre,
      fecha_inicio: formData.fechaInicio,
      fecha_estimada_pesca: formData.fechaEstimadaPesca,
      tipo_camaron: formData.tipoCamaron,
      estado: formData.estado,
      costo_produccion: formData.costoProduccion
    };

    onSubmit(payload);

    // Reset form
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
          onChange={(e) => setFormData({ ...formData, fechaInicio: e.target.value })}
          required
        />
      </div>

      {/* Fecha estimada pesca */}
      <div className="space-y-2">
        <Label htmlFor="fechaEstimadaPesca">Fecha Estimada de Pesca (90 días)</Label>
        <Input
          id="fechaEstimadaPesca"
          type="date"
          value={formData.fechaEstimadaPesca}
          onChange={(e) => setFormData({ ...formData, fechaEstimadaPesca: e.target.value })}
          required
        />
        <p className="text-xs text-gray-500">
          Se calcula automáticamente 90 días después de la fecha de inicio
        </p>
      </div>

      {/* Tipo Camarón */}
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

      {/* Estado */}
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
