import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent } from "./ui/card";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem,
} from "./ui/select";

import { AlertCircle } from "lucide-react";

import { Lote, Proveedor, Vendedor } from "../App";

interface Props {
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
}

export function VentaForm({
  lotes,
  proveedores,
  vendedores,
  vendedorNombre,
  onSubmit,
}: Props) {
  const [form, setForm] = useState({
    loteId: "",
    fecha: new Date().toISOString().split("T")[0],
    libras: 0,
    precioLibra: 3.5,
    proveedor: "",
    vendedor: vendedorNombre || "",
  });

  const selected = lotes.find((l) => l.id === form.loteId);
  const inventario = selected ? selected.libras_cosechadas - selected.libras_vendidas : 0;

  const handle = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.loteId) {
      alert("Debes seleccionar un lote.");
      return;
    }

    if (!form.proveedor) {
      alert("Debes seleccionar un proveedor.");
      return;
    }

    if (!form.vendedor) {
      alert("Debes seleccionar un vendedor.");
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

    onSubmit({
      loteId: form.loteId,
      fecha: form.fecha,
      libras: form.libras,
      precioLibra: form.precioLibra,
      proveedor: form.proveedor,
      vendedor: form.vendedor,
    });
  };

  // 🔶 Si no hay lotes, mostrarse mensaje
  if (lotes.length === 0) {
    return (
      <Card className="border-yellow-300 bg-yellow-50">
        <CardContent className="p-4 flex items-center gap-3 text-yellow-800">
          <AlertCircle className="size-5" />
          <p>No hay lotes disponibles para venta.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <form onSubmit={handle} className="space-y-4 bg-white p-6 rounded-lg shadow">

      {/* LOTE */}
      <div>
        <Label>Lote</Label>
        <Select
          value={form.loteId}
          onValueChange={(v) => setForm({ ...form, loteId: v })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar lote" />
          </SelectTrigger>
          <SelectContent>
            {lotes.map((l) => (
              <SelectItem key={l.id} value={l.id}>
                {l.nombre} — {(l.libras_cosechadas - l.libras_vendidas).toFixed(2)} lb disp.
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

      {/* LIBRAS & PRECIO */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Libras</Label>
          <Input
            type="number"
            step="0.01"
            value={form.libras}
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
            value={form.precioLibra}
            onChange={(e) =>
              setForm({
                ...form,
                precioLibra: parseFloat(e.target.value) || 0,
              })
            }
          />
        </div>
      </div>

      {/* TOTAL */}
      <div className="bg-cyan-50 border border-cyan-200 p-3 rounded text-right">
        <p className="font-semibold text-cyan-800">
          Total: ${(form.libras * form.precioLibra).toFixed(2)}
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
            <SelectValue placeholder="Seleccionar vendedor" />
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
