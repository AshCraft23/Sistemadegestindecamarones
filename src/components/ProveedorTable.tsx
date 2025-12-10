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
import { supabase } from '@/lib/supabase';

export interface Proveedor {
  id: string;           // UUID real de Supabase
  nombre: string;
  contacto: string;
  telefono: string;
  email: string;
  activo: boolean;
}

interface ProveedorTableProps {
  proveedores: Proveedor[];
  onEdit: (proveedor: Proveedor) => void;
  onRefresh: () => void;   // Para recargar datos luego de eliminar
}

export function ProveedorTable({
  proveedores,
  onEdit,
  onRefresh,
}: ProveedorTableProps) {

  const handleDelete = async (id: string, nombre: string) => {
    const ok = confirm(`¿Está seguro de eliminar a ${nombre}?`);
    if (!ok) return;

    // ⚠️ TABLA CORRECTA: "contacts"
    const { error } = await supabase
      .from('contacts')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error al eliminar proveedor:', error);
      alert('Error: ' + error.message);
      return;
    }

    alert('Proveedor eliminado correctamente.');
    onRefresh(); // recargar lista en el front
  };

  if (proveedores.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No hay proveedores registrados
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Empresa</TableHead>
            <TableHead>Contacto</TableHead>
            <TableHead>Teléfono</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {proveedores.map((p) => (
            <TableRow key={p.id}>
              <TableCell>{p.id}</TableCell>
              <TableCell>{p.nombre}</TableCell>
              <TableCell>{p.contacto}</TableCell>
              <TableCell>{p.telefono}</TableCell>
              <TableCell>{p.email}</TableCell>

              <TableCell>
                <Badge
                  className={
                    p.activo
                      ? 'bg-green-100 text-green-800 border-green-200'
                      : 'bg-gray-100 text-gray-800 border-gray-200'
                  }
                >
                  {p.activo ? 'Activo' : 'Inactivo'}
                </Badge>
              </TableCell>

              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(p)}
                  >
                    <Pencil className="size-4" />
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(p.id, p.nombre)}
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
