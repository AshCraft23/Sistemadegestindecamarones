import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { AlertCircle, Plus } from "lucide-react";
import { Lote, Proveedor, Vendedor } from "../App";

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

  onCreateProveedor: (data: Omit<Proveedor, "id">) => void;
}

export function VentaForm({
  lotes,
  proveedores,
  vendedores,
  vendedorNombre,
  onSubmit,
  onCreateProveedor,
}: VentaFormProps) {
  const [formData, setFormData] = useState({
    loteId: "",
    fecha: new Date().toISOString().split("T")[0],
    libras: 0,
    precioLibra: 3.5,
    proveedor: "",
    vendedor: vendedorNombre,
  });

  const [showProveedorForm, setShowProveedorForm] = useState(false);
  const [newProveedor, setNewProveedor] = useState({
    nombre: "",
    contacto: "",
    telefono: "",
    email: "",
    activo: true,
  });

  // =====================================================
  // 🔥 Libras disponibles del lote seleccionado
  // =====================================================
  const selectedLote = useMemo(
    () => lotes.find((l) => l.id === formData.loteId),
    [formData.loteId, lotes]
  );

  const librasDisponibles = selectedLote
    ? (selectedLote.librascosechadas ?? 0) -
      (selectedLote.librasvendidas ?? 0)
    : 0;

  // =====================================================
  // ✔ SUBMIT VENTA
  // =====================================================
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.loteId) {
      alert("Debes seleccionar un lote.");
      return;
    }
    if (formData.libras <= 0) {
      alert("Las libras deben ser mayores a 0.");
      return;
    }
    if (formData.libras > librasDisponibles) {
      alert(
        `No hay suficientes libras disponibles. Disponible: ${librasDisponibles.toFixed(
          2
        )} lb`
      );
      return;
    }

    onSubmit(formData);

    // 🔄 Reset
    setFormData({
      loteId: "",
      fecha: new Date().toISOString().split("T")[0],
      libras: 0,
      precioLibra: 3.5,
      proveedor: "",
      vendedor: vendedorNombre,
    });
  };

  // =====================================================
  // ✔ Crear nuevo proveedor
  // =====================================================
  const handleCreateProveedor = (e: React.FormEvent) => {
    e.preventDefault();

    onCreateProveedor(newProveedor);

    setFormData((prev) => ({
      ...prev,
      proveedor: newProveedor.nombre,
    }));

    setNewProveedor({
      nombre: "",
      contacto: "",
      telefono: "",
      email: "",
      activo: true,
    });

    setShowProveedorForm(false);
  };

  // =====================================================
  // ✔ Si NO hay lotes disponibles
  // =====================================================
  if (lotes.length === 0) {
    return (
      <Card className="border-yellow-200 bg-yellow-50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 text-yellow-800">
            <AlertCircle className="size-5" />
            <p>
              No hay lotes en estado "En Venta" con libras disponibles para
              registrar ventas.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // =====================================================
  // ✔ FORMULARIO PRINCIPAL
  // =====================================================
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
              value={formData.loteId}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, loteId: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un lote" />
              </SelectTrigger>

              <SelectContent>
                {lotes.map((l) => {
                  const disponible =
                    (l.librascosechadas ?? 0) - (l.librasvendidas ?? 0);
                  return (
                    <SelectItem key={l.id} value={l.id}>
                      {l.id} - {l.nombre} ({disponible.toFixed(2)} lb)
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>

            {selectedLote && (
              <p className="text-sm text-gray-600">
                Libras disponibles:{" "}
                <span className="text-cyan-700 font-semibold">
                  {librasDisponibles.toFixed(2)} lb
                </span>
              </p>
            )}
          </div>

          {/* FECHA */}
          <div className="space-y-2">
            <Label>Fecha</Label>
            <Input
              type="date"
              value={formData.fecha}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, fecha: e.target.value }))
              }
            />
          </div>

          {/* PROVEEDOR */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label>Proveedor / Comprador</Label>

              <Dialog open={showProveedorForm} onOpenChange={setShowProveedorForm}>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline">
                    <Plus className="size-4 mr-1" /> Nuevo Proveedor
                  </Button>
                </DialogTrigger>

                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Agregar Nuevo Proveedor</DialogTitle>
                  </DialogHeader>

                  <form onSubmit={handleCreateProveedor} className="space-y-3">
                    <Input
                      placeholder="Nombre"
                      value={newProveedor.nombre}
                      onChange={(e) =>
                        setNewProveedor({ ...newProveedor, nombre: e.target.value })
                      }
                      required
                    />
                    <Input
                      placeholder="Contacto"
                      value={newProveedor.contacto}
                      onChange={(e) =>
                        setNewProveedor({
                          ...newProveedor,
                          contacto: e.target.value,
                        })
                      }
                      required
                    />
                    <Input
                      placeholder="Telefono"
                      value={newProveedor.telefono}
                      onChange={(e) =>
                        setNewProveedor({
                          ...newProveedor,
                          telefono: e.target.value,
                        })
                      }
                      required
                    />
                    <Input
                      placeholder="Email"
                      type="email"
                      value={newProveedor.email}
                      onChange={(e) =>
                        setNewProveedor({ ...newProveedor, email: e.target.value })
                      }
                      required
                    />

                    <Button className="w-full">Crear Proveedor</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <Select
              value={formData.proveedor}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, proveedor: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar proveedor" />
              </SelectTrigger>

              <SelectContent>
                {proveedores.map((p) => (
                  <SelectItem key={p.id} value={p.nombre}>
                    {p.nombre} - {p.contacto}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* LIBRAS + PRECIO */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Libras</Label>
              <Input
                type="number"
                min="0.01"
                step="0.01"
                value={formData.libras || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    libras: parseFloat(e.target.value) || 0,
                  }))
                }
              />
            </div>

            <div>
              <Label>Precio por libra ($)</Label>
              <Input
                type="number"
                min="0.01"
                step="0.01"
                value={formData.precioLibra || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    precioLibra: parseFloat(e.target.value) || 0,
                  }))
                }
              />
            </div>
          </div>

          {/* TOTAL */}
          <div className="bg-cyan-50 p-3 rounded-lg border border-cyan-200">
            <p className="text-sm flex justify-between">
              <span>Total:</span>
              <span className="font-semibold text-cyan-700">
                $
                {(formData.libras * formData.precioLibra).toLocaleString("es-ES", {
                  minimumFractionDigits: 2,
                })}
              </span>
            </p>
          </div>

          {/* VENDEDOR */}
          <div className="space-y-2">
            <Label>Vendedor</Label>
            <Select
              value={formData.vendedor}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, vendedor: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                {vendedores.map((v) => (
                  <SelectItem key={v.id} value={v.nombre}>
                    {v.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* BOTÓN */}
          <Button className="w-full bg-gradient-to-r from-cyan-600 to-teal-600">
            Registrar Venta
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
