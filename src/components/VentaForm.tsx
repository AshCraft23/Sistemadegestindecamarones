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
    lote_id: string;
    fecha: string;
    libras: number;
    precio_libra: number;
    proveedor_id: string;
    proveedor_nombre: string;
    vendedor_id: string;
    vendedor_nombre: string;
  }) => void;
}

export function VentaForm({
  lotes,
  proveedores,
  vendedores,
  vendedorNombre,
  onSubmit,
}: Props) {

  const vendedorDefault = vendedores.find(v => v.nombre === vendedorNombre);

  const [form, setForm] = useState({
    lote_id: "",
    fecha: new Date().toISOString().split("T")[0],
    libras: 0,
    precio_libra: 3.5,
    proveedor_id: "",
    proveedor_nombre: "",
    vendedor_id: vendedorDefault?.id ?? "",
    vendedor_nombre: vendedorNombre,
  });

  const selected = lotes.find((l) => l.id === form.lote_id);
  const inventario = selected?.libras_en_inventario ?? 0;

  const handle = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.lote_id) return alert("Debes seleccionar un lote.");
    if (!form.proveedor_id) return alert("Debes seleccionar un proveedor.");
    if (!form.vendedor_id) return alert("Debes seleccionar un vendedor.");
    if (form.libras <= 0) return alert("Las libras deben ser mayores que 0.");
    if (form.libras > inventario)
      return alert("No hay suficientes libras disponibles.");

    console.log("DATA DE VENTA RECIBIDA:", form);

    onSubmit(form);
  };

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
          value={form.lote_id}
          onValueChange={(v) => setForm({ ...form, lote_id: v })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar lote" />
          </SelectTrigger>
          <SelectContent>
            {lotes.map((l) => (
              <SelectItem key={l.id} value={l.id}>
                {l.nombre} — {l.libras_en_inventario?.toFixed(2)} lb disp.
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
          value={form.proveedor_id}
          onValueChange={(v) => {
            const prov = proveedores.find((p) => p.id === v);
            setForm({
              ...form,
              proveedor_id: v,
              proveedor_nombre: prov?.nombre ?? "",
            });
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar proveedor" />
          </SelectTrigger>
          <SelectContent>
            {proveedores.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.nombre}
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
          value={form.vendedor_id}
          onValueChange={(v) => {
            const vend = vendedores.find((x) => x.id === v);
            setForm({
              ...form,
              vendedor_id: v,
              vendedor_nombre: vend?.nombre ?? "",
            });
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar vendedor" />
          </SelectTrigger>
          <SelectContent>
            {vendedores.map((v) => (
              <SelectItem key={v.id} value={v.id}>
                {v.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
