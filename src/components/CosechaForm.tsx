import { useState } from "react";
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
import { AlertCircle } from "lucide-react";
import { Lote, Pescador } from "../App";

interface Props {
  lotes: Lote[];
  pescadores: Pescador[];
  currentPescadorId?: string; // opcional: si el usuario actual es pescador
  currentPescadorNombre?: string; // opcional: nombre a usar si es pescador
  onSubmit: (data: {
    loteId: string;
    fecha: string;
    libras: number;
    pescador_id?: string | null;
    pescador?: string | null;
  }) => void;
}

export function CosechaForm({
  lotes,
  pescadores,
  currentPescadorId,
  currentPescadorNombre,
  onSubmit,
}: Props) {
  const [form, setForm] = useState({
    loteId: "",
    fecha: new Date().toISOString().split("T")[0],
    libras: 0,
    pescador_id: currentPescadorId ?? "",
    pescador: currentPescadorNombre ?? "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.loteId) return alert("Debes seleccionar un lote.");
    if (!form.libras || form.libras <= 0) return alert("Las libras deben ser mayores a 0.");

    // Normalizamos el payload: si hay pescador_id lo mandamos, y además pescador (nombre)
    onSubmit({
      loteId: form.loteId,
      fecha: form.fecha,
      libras: Number(form.libras),
      pescador_id: form.pescador_id || null,
      pescador: form.pescador || null,
    });

    setForm({
      loteId: "",
      fecha: new Date().toISOString().split("T")[0],
      libras: 0,
      pescador_id: currentPescadorId ?? "",
      pescador: currentPescadorNombre ?? "",
    });
  };

  if (lotes.length === 0) {
    return (
      <Card className="border-yellow-200 bg-yellow-50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 text-yellow-800">
            <AlertCircle className="size-5" />
            <p>No hay lotes disponibles para cosecha. Solo los lotes con estado <b>"Listo para Pescar"</b> pueden cosecharse.</p>
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
          <div>
            <Label>Lote</Label>
            <Select value={form.loteId} onValueChange={(v) => setForm({ ...form, loteId: v })}>
              <SelectTrigger><SelectValue placeholder="Seleccionar lote" /></SelectTrigger>
              <SelectContent>
                {lotes.map((l) => (
                  <SelectItem key={l.id} value={l.id}>
                    {l.nombre} — {l.tipo_camaron}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Fecha</Label>
            <Input type="date" value={form.fecha} onChange={(e) => setForm({ ...form, fecha: e.target.value })} />
          </div>

          <div>
            <Label>Libras cosechadas</Label>
            <Input
              type="number"
              min="0.01"
              step="0.01"
              value={form.libras || ""}
              onChange={(e) => setForm({ ...form, libras: parseFloat(e.target.value) || 0 })}
            />
          </div>

          {/* Si currentPescadorId viene (usuario pescador), fijamos el select a ese ID y lo ocultamos */}
          {currentPescadorId ? (
            <div>
              <Label>Pescador</Label>
              <Input value={currentPescadorNombre ?? "Pescador"} readOnly />
            </div>
          ) : (
            <div>
              <Label>Pescador</Label>
              <Select value={form.pescador_id} onValueChange={(v) => {
                const p = pescadores.find((x) => x.id === v);
                setForm({ ...form, pescador_id: v, pescador: p?.nombre ?? "" });
              }}>
                <SelectTrigger><SelectValue placeholder="Seleccionar pescador" /></SelectTrigger>
                <SelectContent>
                  {pescadores.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.nombre} — {p.especialidad}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <Button className="w-full">Registrar Cosecha</Button>
        </form>
      </CardContent>
    </Card>
  );
}
