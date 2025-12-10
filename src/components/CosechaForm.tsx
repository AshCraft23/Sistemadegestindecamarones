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

interface CosechaFormProps {
  lotes: Lote[];
  pescadores: Pescador[];
  pescadorId: string;
  onSubmit: (data: {
    loteId: string;
    fecha: string;
    libras: number;
    pescador_id: string;
  }) => void;
}

export function CosechaForm({
  lotes,
  pescadores,
  pescadorId,
  onSubmit,
}: CosechaFormProps) {
  const [formData, setFormData] = useState({
    loteId: "",
    fecha: new Date().toISOString().split("T")[0],
    libras: 0,
    pescador_id: pescadorId,  // se autocompleta correctamente
  });

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

    onSubmit({
      loteId: formData.loteId,
      fecha: formData.fecha,
      libras: Number(formData.libras),   // <-- AHORA CORRECTO
      pescador_id: formData.pescador_id,
    });

    setFormData({
      loteId: "",
      fecha: new Date().toISOString().split("T")[0],
      libras: 0,
      pescador_id: pescadorId,
    });
  };

  if (lotes.length === 0) {
    return (
      <Card className="border-yellow-200 bg-yellow-50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 text-yellow-800">
            <AlertCircle className="size-5" />
            <p>
              No hay lotes disponibles para cosecha.
              Solo los lotes con estado <b>"Listo para Pescar"</b> pueden cosecharse.
            </p>
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

          {/* LOTE */}
          <div className="space-y-2">
            <Label>Lote</Label>
            <Select
              value={formData.loteId}
              onValueChange={(value) =>
                setFormData({ ...formData, loteId: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar lote" />
              </SelectTrigger>

              <SelectContent>
                {lotes.map((lote) => (
                  <SelectItem key={lote.id} value={lote.id}>
                    {lote.nombre} — {lote.tipo_camaron}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* FECHA */}
          <div className="space-y-2">
            <Label>Fecha</Label>
            <Input
              type="date"
              value={formData.fecha}
              onChange={(e) =>
                setFormData({ ...formData, fecha: e.target.value })
              }
            />
          </div>

          {/* LIBRAS */}
          <div className="space-y-2">
            <Label>Libras cosechadas</Label>
            <Input
              type="number"
              min="0.01"
              step="0.01"
              value={formData.libras}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  libras: parseFloat(e.target.value) || 0,
                })
              }
            />
          </div>

          {/* PESCADOR */}
          <div className="space-y-2">
            <Label>Pescador</Label>
            <Select
              value={formData.pescador_id}
              onValueChange={(value) =>
                setFormData({ ...formData, pescador_id: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar pescador" />
              </SelectTrigger>

              <SelectContent>
                {pescadores.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.nombre} — {p.especialidad}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button className="w-full bg-gradient-to-r from-cyan-600 to-teal-600 text-white hover:from-cyan-700 hover:to-teal-700">
            Registrar Cosecha
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
