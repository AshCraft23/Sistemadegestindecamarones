import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem,
} from "./ui/select";
import { Lote, Proveedor, Vendedor } from "../App";

interface Props {
  lotes: Lote[];
  proveedores: Proveedor[];
  vendedores: Vendedor[];
  vendedorNombre: string;
  onSubmit: (data: {
    lote_id: string;
    fecha: string;
    libras: number;
    precio_libra: number;
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
}: Props) {
  const [form, setForm] = useState({
    lote_id: "",
    fecha: new Date().toISOString().split("T")[0],
    libras: 0,
    precio_libra: 3.5,
    proveedor: "",
    vendedor: vendedorNombre,
  });

  const selected = lotes.find((l) => l.id === form.lote_id);
  const inventario = selected?.libras_en_inventario ?? 0;

  const handle = (e: React.FormEvent) => {
    e.preventDefault();

    if (form.lote_id === "") {
      alert("Debes seleccionar un lote.");
      return;
    }

    if (form.libras <= 0) {
      alert("Las libras deben ser mayores que 0.");
      return;
    }

    if (form.libras > inventario) {
      alert("No hay suficientes libras disponibles.");
      return;
    }

    onSubmit(form);
  };

  return (
    <form onSubmit={handle} className="space-y-4 bg-white p-6 rounded-lg shadow">
      {/* LOTE */}
      <div>
        <Label>Lote</Label>
        <Select
          value={form.lote_id}
          onValueChange={(v) => setForm({ ...form, lote_id: v })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar lote" />
          </SelectTrigger>
          <SelectContent>
            {lotes.map((l) => (
              <SelectItem key={l.id} value={l.id}>
                {l.nombre} — {l.libras_en_inventario.toFixed(2)} lb disp.
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* FECHA */}
      <div>
        <Label>Fecha</Label>
        <Input
          type="date"
          value={form.fecha}
          onChange={(e) => setForm({ ...form, fecha: e.target.value })}
        />
      </div>

      {/* PROVEEDOR */}
      <div>
        <Label>Proveedor</Label>
        <Select
          value={form.proveedor}
          onValueChange={(v) => setForm({ ...form, proveedor: v })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar proveedor" />
          </SelectTrigger>
          <SelectContent>
            {proveedores.map((p) => (
              <SelectItem key={p.id} value={p.nombre}>
                {p.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* LIBRAS Y PRECIO */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Libras</Label>
          <Input
            type="number"
            step="0.01"
            value={form.libras}
            max={inventario}
            onChange={(e) =>
              setForm({ ...form, libras: parseFloat(e.target.value) || 0 })
            }
          />
        </div>
        <div>
          <Label>Precio por libra ($)</Label>
          <Input
            type="number"
            step="0.01"
            value={form.precio_libra}
            onChange={(e) =>
              setForm({
                ...form,
                precio_libra: parseFloat(e.target.value) || 0,
              })
            }
          />
        </div>
      </div>

      {/* TOTAL */}
      <div className="bg-cyan-50 border border-cyan-200 p-3 rounded text-right">
        <p className="font-semibold text-cyan-800">
          Total: ${(form.libras * form.precio_libra).toFixed(2)}
        </p>
      </div>

      {/* VENDEDOR */}
      <div>
        <Label>Vendedor</Label>
        <Select
          value={form.vendedor}
          onValueChange={(v) => setForm({ ...form, vendedor: v })}
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
      <Button className="w-full bg-teal-600 text-white hover:bg-teal-700">
        Registrar venta
      </Button>
    </form>
  );
}
