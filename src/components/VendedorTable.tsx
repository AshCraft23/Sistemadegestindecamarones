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
import { Vendedor } from '../App';

interface VendedorTableProps {
  vendedores: Vendedor[];
  onEdit: (vendedor: Vendedor) => void;
  onDelete: (id: string) => void;
}

export function VendedorTable({ vendedores, onEdit, onDelete }: VendedorTableProps) {
  if (vendedores.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No hay vendedores registrados
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
            <TableHead>Email</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vendedores.map((vendedor) => (
            <TableRow key={vendedor.id}>
              <TableCell>{vendedor.id}</TableCell>
              <TableCell>{vendedor.nombre}</TableCell>
              <TableCell>{vendedor.telefono}</TableCell>
              <TableCell>{vendedor.email}</TableCell>
              <TableCell>
                <Badge className={vendedor.activo 
                  ? 'bg-green-100 text-green-800 border-green-200' 
                  : 'bg-gray-100 text-gray-800 border-gray-200'
                }>
                  {vendedor.activo ? 'Activo' : 'Inactivo'}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(vendedor)}
                  >
                    <Pencil className="size-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (confirm(`¿Está seguro de eliminar a ${vendedor.nombre}?`)) {
                        onDelete(vendedor.id);
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
