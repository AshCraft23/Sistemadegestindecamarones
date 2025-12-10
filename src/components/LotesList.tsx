import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Calendar, Fish } from "lucide-react";
import { Lote, EstadoLote } from "../App";

interface LotesListProps {
  lotes: Lote[];
  onSelectLote: (id: string) => void;
  selectedLoteId: string | null;
}

const estadoColors: Record<EstadoLote, string> = {
  Crianza: "bg-blue-100 text-blue-800",
  "Listo para Pescar": "bg-green-100 text-green-800",
  "En Venta": "bg-cyan-100 text-cyan-800",
  Reposo: "bg-yellow-100 text-yellow-800",
  Descarte: "bg-red-100 text-red-800",
};

export function LotesList({ lotes, onSelectLote, selectedLoteId }: LotesListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {lotes.map((l) => {
        const isSelected = l.id === selectedLoteId;

        return (
          <Card
            key={l.id}
            className={`cursor-pointer hover:shadow-lg transition border ${
              isSelected ? "ring-2 ring-cyan-500 border-cyan-500" : ""
            }`}
            onClick={() => onSelectLote(l.id)}
          >
            <CardContent className="p-6">
              <div className="flex justify-between mb-3">
                <div>
                  <h3 className="text-gray-900 font-medium">{l.nombre}</h3>
                  <p className="text-sm text-gray-500">{l.id}</p>
                </div>

                <Badge className={estadoColors[l.estado]}>{l.estado}</Badge>
              </div>

              {/* Tipo camarón */}
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <Fish className="size-4 text-cyan-600" />
                {l.tipo_camaron}
              </div>

              {/* Fechas */}
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="size-4 text-cyan-600" />
                Inicio: {new Date(l.fecha_inicio).toLocaleDateString("es-ES")}
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                <Calendar className="size-4 text-teal-600" />
                Est. Pesca:{" "}
                {new Date(l.fecha_estimada_pesca).toLocaleDateString("es-ES")}
              </div>

              <div className="border-t pt-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Cosechado:</span>
                  <span>{l.libras_cosechadas.toFixed(2)} lb</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Vendido:</span>
                  <span>{l.libras_vendidas.toFixed(2)} lb</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Inventario:</span>
                  <span className="text-cyan-700 font-medium">
                    {l.libras_en_inventario.toFixed(2)} lb
                  </span>
                </div>

                <div className="flex justify-between border-t pt-2">
                  <span className="text-gray-600">Ingresos:</span>
                  <span className="text-green-700 font-medium">
                    ${l.ingresos_totales.toLocaleString("es-ES")}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
