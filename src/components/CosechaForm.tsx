import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { AlertCircle } from 'lucide-react';
import { Lote, Pescador } from '../App';

interface CosechaFormProps {
  lotes: Lote[];
  pescadores: Pescador[];
  pescadorNombre: string;
  onSubmit: (data: {
    loteId: string;
    fecha: string;
    libras: number;
    pescador: string;
  }) => void;
}

export function CosechaForm({ lotes, pescadores, pescadorNombre, onSubmit }: CosechaFormProps) {
  const [formData, setFormData] = useState({
    loteId: '',
    fecha: new Date().toISOString().split('T')[0],
    libras: 0,
    pescador: pescadorNombre
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      loteId: '',
      fecha: new Date().toISOString().split('T')[0],
      libras: 0,
      pescador: pescadorNombre
    });
  };

  if (lotes.length === 0) {
    return (
      <Card className="border-yellow-200 bg-yellow-50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 text-yellow-800">
            <AlertCircle className="size-5" />
            <p>No hay lotes disponibles para cosecha. Los lotes deben estar en estado "Listo para Pescar".</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Registrar Nueva Cosecha</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="lote">Lote</Label>
            <Select 
              value={formData.loteId} 
              onValueChange={(value) => setFormData({ ...formData, loteId: value })}
              required
            >
              <SelectTrigger id="lote">
                <SelectValue placeholder="Seleccionar lote" />
              </SelectTrigger>
              <SelectContent>
                {lotes.map((lote) => (
                  <SelectItem key={lote.id} value={lote.id}>
                    {lote.id} - {lote.nombre} ({lote.tipoCamaron})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fecha">Fecha de Cosecha</Label>
            <Input
              id="fecha"
              type="date"
              value={formData.fecha}
              onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="libras">Libras Cosechadas</Label>
            <Input
              id="libras"
              type="number"
              min="0.01"
              step="0.01"
              placeholder="0.00"
              value={formData.libras || ''}
              onChange={(e) => setFormData({ ...formData, libras: parseFloat(e.target.value) || 0 })}
              required
            />
            <p className="text-xs text-gray-500">Ingrese el peso total de la cosecha en libras</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pescador">Pescador Responsable</Label>
            <Select 
              value={formData.pescador} 
              onValueChange={(value) => setFormData({ ...formData, pescador: value })}
              required
            >
              <SelectTrigger id="pescador">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {pescadores.map((pescador) => (
                  <SelectItem key={pescador.id} value={pescador.nombre}>
                    {pescador.nombre} - {pescador.especialidad}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700"
          >
            Registrar Cosecha
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
