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
    lote_id: string;
    fecha: string;
    libras: number;
    precioLibra: number;
    proveedor_id: string;
    vendedor_id: string;
  }) => void;

  onCreateProveedor: (data: Omit<Proveedor, 'id'>) => void;
}

export function VentaForm({
  lotes,
  proveedores,
  vendedores,
  vendedorNombre,
  onSubmit,
  onCreateProveedor
}: VentaFormProps) {
  const [formData, setFormData] = useState({
    lote_id: '',
    fecha: new Date().toISOString().split('T')[0],
    libras: 0,
    precioLibra: 3.50,
    proveedor_id: '',
    vendedor_id: vendedores.find(v => v.nombre === vendedorNombre)?.id || ''
  });

  const [showProveedorForm, setShowProveedorForm] = useState(false);
  const [newProveedor, setNewProveedor] = useState({
    nombre: '',
    contacto: '',
    telefono: '',
    email: '',
    activo: true
  });

  const selectedLote = lotes.find(l => l.id === formData.lote_id);
  const librasDisponibles = selectedLote
    ? selectedLote.librasCosechadas - selectedLote.librasVendidas
    : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.libras > librasDisponibles) {
      alert(`No hay suficientes libras disponibles. Disponible: ${librasDisponibles.toFixed(2)} lb`);
      return;
    }

    onSubmit({
      lote_id: formData.lote_id,
      fecha: formData.fecha,
      libras: Number(formData.libras),
      precioLibra: Number(formData.precioLibra),
      proveedor_id: formData.proveedor_id,
      vendedor_id: formData.vendedor_id
    });

    setFormData({
      lote_id: '',
      fecha: new Date().toISOString().split('T')[0],
      libras: 0,
      precioLibra: 3.50,
      proveedor_id: '',
      vendedor_id: vendedores.find(v => v.nombre === vendedorNombre)?.id || ''
    });
  };

  const handleCreateProveedor = (e: React.FormEvent) => {
    e.preventDefault();

    onCreateProveedor(newProveedor);

    // al crear proveedor, seleccionarlo automáticamente
    setFormData(prev => ({ ...prev, proveedor_id: newProveedor.nombre }));

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
            <p>No hay lotes disponibles para venta.</p>
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

          {/* LOTE */}
          <div className="space-y-2">
            <Label>Lote</Label>
            <Select
              value={formData.lote_id}
              onValueChange={(value) => setFormData({ ...formData, lote_id: value })}
              required
            >
              <SelectTrigger>
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
                Disponible: {librasDisponibles.toFixed(2)} lb
              </p>
            )}
          </div>

          {/* FECHA */}
          <div className="space-y-2">
            <Label>Fecha</Label>
            <Input
              type="date"
              value={formData.fecha}
              onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
              required
            />
          </div>

          {/* PROVEEDOR */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label>Proveedor</Label>

              <Dialog open={showProveedorForm} onOpenChange={setShowProveedorForm}>
                <DialogTrigger asChild>
                  <Button type="button" variant="outline" size="sm">
                    <Plus className="size-4 mr-1" /> Nuevo
                  </Button>
                </DialogTrigger>

                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Crear Proveedor</DialogTitle>
                  </DialogHeader>

                  <form onSubmit={handleCreateProveedor} className="space-y-4">
                    <div className="space-y-2">
                      <Label>Nombre</Label>
                      <Input
                        value={newProveedor.nombre}
                        onChange={(e) => setNewProveedor({ ...newProveedor, nombre: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Contacto</Label>
                      <Input
                        value={newProveedor.contacto}
                        onChange={(e) => setNewProveedor({ ...newProveedor, contacto: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Teléfono</Label>
                      <Input
                        value={newProveedor.telefono}
                        onChange={(e) => setNewProveedor({ ...newProveedor, telefono: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input
                        type="email"
                        value={newProveedor.email}
                        onChange={(e) => setNewProveedor({ ...newProveedor, email: e.target.value })}
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full">
                      Guardar
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <Select
              value={formData.proveedor_id}
              onValueChange={(value) => setFormData({ ...formData, proveedor_id: value })}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar proveedor" />
              </SelectTrigger>
              <SelectContent>
                {proveedores.map((prov) => (
                  <SelectItem key={prov.id} value={prov.id}>
                    {prov.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* LIBRAS Y PRECIO */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Libras</Label>
              <Input
                type="number"
                min="0.01"
                max={librasDisponibles}
                step="0.01"
                value={formData.libras || ''}
                onChange={(e) =>
                  setFormData({ ...formData, libras: parseFloat(e.target.value) || 0 })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Precio por Libra</Label>
              <Input
                type="number"
                min="0.01"
                step="0.01"
                value={formData.precioLibra || ''}
                onChange={(e) =>
                  setFormData({ ...formData, precioLibra: parseFloat(e.target.value) || 0 })
                }
                required
              />
            </div>
          </div>

          {/* VENDEDOR */}
          <div className="space-y-2">
            <Label>Vendedor</Label>
            <Select
              value={formData.vendedor_id}
              onValueChange={(value) => setFormData({ ...formData, vendedor_id: value })}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar vendedor" />
              </SelectTrigger>
              <SelectContent>
                {vendedores.map((vend) => (
                  <SelectItem key={vend.id} value={vend.id}>
                    {vend.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* SUBMIT */}
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-cyan-600 to-teal-600"
            disabled={!selectedLote || formData.libras === 0}
          >
            Registrar Venta
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
