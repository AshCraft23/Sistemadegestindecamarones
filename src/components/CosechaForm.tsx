import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./ui/select";
import { Lote, Pescador } from "../App";

interface Props {
  lotes: Lote[];
  pescadores: Pescador[];
  pescadorNombre: string;
  onSubmit: (data: {
    lote_id: string;
    fecha: string;
    libras: number;
    pescador: string;
  }) => void;
}

export function CosechaForm({
  lotes,
  pescadores,
  pescadorNombre,
  onSubmit,
}: Props) {
  const [form, setForm] = useState({
    lote_id: "",
    fecha: new Date().toISOString().split("T")[0],
    libras: 0,
    pescador: pescadorNombre,
  });

  const handle = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handle} className="space-y-4 bg-white p-6 rounded-lg shadow">
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
                {l.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Fecha</Label>
        <Input
          type="date"
          value={form.fecha}
          onChange={(e) => setForm({ ...form, fecha: e.target.value })}
        />
      </div>

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
        <Label>Pescador</Label>
        <Select
          value={form.pescador}
          onValueChange={(v) => setForm({ ...form, pescador: v })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {pescadores.map((p) => (
              <SelectItem key={p.id} value={p.nombre}>
                {p.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button className="w-full bg-cyan-600">Registrar Cosecha</Button>
    </form>
  );
}
