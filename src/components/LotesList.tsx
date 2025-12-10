import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Calendar, Fish } from "lucide-react";
import { Lote, EstadoLote } from "../App";

interface LotesListProps {
  lotes: Lote[];
  onSelectLote: (loteId: string) => void;
  selectedLoteId: string | null;
}

const estadoColors: Record<EstadoLote, string> = {
  Crianza: "bg-blue-100 text-blue-800 border-blue-200",
  "Listo para Pescar": "bg-green-100 text-green-800 border-green-200",
  "En Venta": "bg-cyan-100 text-cyan-800 border-cyan-200",
  Reposo: "bg-yellow-100 text-yellow-800 border-yellow-200",
  Descarte: "bg-red-100 text-red-800 border-red-200",
};

export function LotesList({
  lotes,
  onSelectLote,
  selectedLoteId,
}: LotesListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {lotes.map((lote) => {
        const isSelected = lote.id === selectedLoteId;

        return (
          <Card
            key={lote.id}
            className={`cursor-pointer transition-all hover:shadow-lg ${
              isSelected ? "ring-2 ring-cyan-500 border-cyan-500" : ""
            }`}
            onClick={() => onSelectLote(lote.id)}
          >
            <CardContent className="p-6">
              {/* encabezado */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-gray-900 mb-1">{lote.nombre}</h3>
                  <p className="text-sm text-gray-500">ID: {lote.id}</p>
                </div>

                <Badge className={estadoColors[lote.estado]}>
                  {lote.estado}
                </Badge>
              </div>

              {/* detalles */}
              <div className="space-y-3">
                {/* Tipo de camarón */}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Fish className="size-4 text-cyan-600" />
                  <span>{lote.tipo_camaron}</span>
                </div>

                {/* Fechas */}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="size-4 text-cyan-600" />
                  <span>
                    Inicio:{" "}
                    {new Date(lote.fecha_inicio).toLocaleDateString("es-ES")}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="size-4 text-teal-600" />
                  <span>
                    Est. Pesca:{" "}
                    {new Date(
                      lote.fecha_estimada_pesca
                    ).toLocaleDateString("es-ES")}
                  </span>
                </div>

                {/* Datos futuros (no existen en la tabla actual) */}
                <div className="pt-3 border-t border-gray-200 space-y-2">
                  <p className="text-xs text-gray-500 italic">
                    Datos de cosechas y ventas aparecerán cuando conectemos la vista
                    <strong> lotes_dashboard_view</strong>.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
