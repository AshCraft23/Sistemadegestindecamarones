import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { AlertCircle, Plus } from 'lucide-react';
import { Lote, Proveedor, Vendedor } from '../App';

interface VentaFormProps {
  lotes: Lote[];
  proveedores: Proveedor[];
  vendedores: Vendedor[];
  vendedorNombre: string;
  onSubmit: (data: {
    loteId: string;
    fecha: string;
    libras: number;
    precioLibra: number;
    proveedor: string;
    vendedor: string;
  }) => void;
  onCreateProveedor: (data: Omit<Proveedor, 'id'>) => void;
}

export function VentaForm({ lotes, proveedores, vendedores, vendedorNombre, onSubmit, onCreateProveedor }: VentaFormProps) {
  const [formData, setFormData] = useState({
    loteId: '',
    fecha: new Date().toISOString().split('T')[0],
    libras: 0,
    precioLibra: 3.50,
    proveedor: '',
    vendedor: vendedorNombre
  });

  const [showProveedorForm, setShowProveedorForm] = useState(false);
  const [newProveedor, setNewProveedor] = useState({
    nombre: '',
    contacto: '',
    telefono: '',
    email: '',
    activo: true
  });

  const selectedLote = lotes.find(l => l.id === formData.loteId);
  const librasDisponibles = selectedLote 
    ? selectedLote.librasCosechadas - selectedLote.librasVendidas 
    : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.libras > librasDisponibles) {
      alert(`No hay suficientes libras disponibles. Disponible: ${librasDisponibles.toFixed(2)} lb`);
      return;
    }

    onSubmit(formData);
    setFormData({
      loteId: '',
      fecha: new Date().toISOString().split('T')[0],
      libras: 0,
      precioLibra: 3.50,
      proveedor: '',
      vendedor: vendedorNombre
    });
  };

  const handleCreateProveedor = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateProveedor(newProveedor);
    setFormData({ ...formData, proveedor: newProveedor.nombre });
    setNewProveedor({
      nombre: '',
      contacto: '',
      telefono: '',
      email: '',
      activo: true
    });
    setShowProveedorForm(false);
  };

  if (lotes.length === 0) {
    return (
      <Card className="border-yellow-200 bg-yellow-50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 text-yellow-800">
            <AlertCircle className="size-5" />
            <p>No hay lotes con inventario disponible para venta. Los lotes deben estar en estado "En Venta" y tener libras cosechadas disponibles.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Registrar Nueva Venta</CardTitle>
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
                {lotes.map((lote) => {
                  const disponible = lote.librasCosechadas - lote.librasVendidas;
                  return (
                    <SelectItem key={lote.id} value={lote.id}>
                      {lote.id} - {lote.nombre} ({disponible.toFixed(2)} lb disponibles)
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            {selectedLote && (
              <p className="text-sm text-gray-600">
                Disponible para venta: {librasDisponibles.toFixed(2)} libras
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="fecha">Fecha de Venta</Label>
            <Input
              id="fecha"
              type="date"
              value={formData.fecha}
              onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="proveedor">Proveedor/Comprador</Label>
              <Dialog open={showProveedorForm} onOpenChange={setShowProveedorForm}>
                <DialogTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8"
                  >
                    <Plus className="size-4 mr-1" />
                    Nuevo Proveedor
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Crear Nuevo Proveedor</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleCreateProveedor} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="new-proveedor-nombre">Nombre del Proveedor</Label>
                      <Input
                        id="new-proveedor-nombre"
                        value={newProveedor.nombre}
                        onChange={(e) => setNewProveedor({ ...newProveedor, nombre: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-proveedor-contacto">Persona de Contacto</Label>
                      <Input
                        id="new-proveedor-contacto"
                        value={newProveedor.contacto}
                        onChange={(e) => setNewProveedor({ ...newProveedor, contacto: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-proveedor-telefono">Teléfono</Label>
                      <Input
                        id="new-proveedor-telefono"
                        value={newProveedor.telefono}
                        onChange={(e) => setNewProveedor({ ...newProveedor, telefono: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-proveedor-email">Email</Label>
                      <Input
                        id="new-proveedor-email"
                        type="email"
                        value={newProveedor.email}
                        onChange={(e) => setNewProveedor({ ...newProveedor, email: e.target.value })}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      Crear Proveedor
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            <Select 
              value={formData.proveedor} 
              onValueChange={(value) => setFormData({ ...formData, proveedor: value })}
              required
            >
              <SelectTrigger id="proveedor">
                <SelectValue placeholder="Seleccionar proveedor" />
              </SelectTrigger>
              <SelectContent>
                {proveedores.map((proveedor) => (
                  <SelectItem key={proveedor.id} value={proveedor.nombre}>
                    {proveedor.nombre} - {proveedor.contacto}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="libras">Libras</Label>
              <Input
                id="libras"
                type="number"
                min="0.01"
                max={librasDisponibles}
                step="0.01"
                placeholder="0.00"
                value={formData.libras || ''}
                onChange={(e) => setFormData({ ...formData, libras: parseFloat(e.target.value) || 0 })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="precioLibra">Precio por Libra ($)</Label>
              <Input
                id="precioLibra"
                type="number"
                min="0.01"
                step="0.01"
                placeholder="3.50"
                value={formData.precioLibra || ''}
                onChange={(e) => setFormData({ ...formData, precioLibra: parseFloat(e.target.value) || 0 })}
                required
              />
            </div>
          </div>

          <div className="bg-cyan-50 p-4 rounded-lg border border-cyan-200">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Subtotal:</span>
              <span className="text-gray-900">
                ${(formData.libras * formData.precioLibra).toLocaleString('es-ES', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-900">Total de Venta:</span>
              <span className="text-cyan-900">
                ${(formData.libras * formData.precioLibra).toLocaleString('es-ES', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="vendedor">Vendedor</Label>
            <Select 
              value={formData.vendedor} 
              onValueChange={(value) => setFormData({ ...formData, vendedor: value })}
              required
            >
              <SelectTrigger id="vendedor">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {vendedores.map((vendedor) => (
                  <SelectItem key={vendedor.id} value={vendedor.nombre}>
                    {vendedor.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700"
            disabled={!selectedLote || formData.libras === 0}
          >
            Registrar Venta
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
