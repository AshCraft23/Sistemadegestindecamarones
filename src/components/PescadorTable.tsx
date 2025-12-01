import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Pencil, Trash2 } from 'lucide-react';
import { Pescador } from '../App';

interface PescadorTableProps {
  pescadores: Pescador[];
  onEdit: (pescador: Pescador) => void;
  onDelete: (id: string) => void;
}

export function PescadorTable({ pescadores, onEdit, onDelete }: PescadorTableProps) {
  if (pescadores.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No hay pescadores registrados
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Teléfono</TableHead>
            <TableHead>Especialidad</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pescadores.map((pescador) => (
            <TableRow key={pescador.id}>
              <TableCell>{pescador.id}</TableCell>
              <TableCell>{pescador.nombre}</TableCell>
              <TableCell>{pescador.telefono}</TableCell>
              <TableCell>{pescador.especialidad}</TableCell>
              <TableCell>
                <Badge className={pescador.activo 
                  ? 'bg-green-100 text-green-800 border-green-200' 
                  : 'bg-gray-100 text-gray-800 border-gray-200'
                }>
                  {pescador.activo ? 'Activo' : 'Inactivo'}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(pescador)}
                  >
                    <Pencil className="size-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (confirm(`¿Está seguro de eliminar a ${pescador.nombre}?`)) {
                        onDelete(pescador.id);
                      }
                    }}
                  >
                    <Trash2 className="size-4 text-red-600" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
