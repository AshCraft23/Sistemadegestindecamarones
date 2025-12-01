import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Venta, Cosecha } from '../App';

interface TransactionTableProps {
  ventas: Venta[];
  cosechas: Cosecha[];
}

export function TransactionTable({ ventas, cosechas }: TransactionTableProps) {
  // Combinar ventas y cosechas en una sola lista de transacciones
  const transacciones = [
    ...ventas.map(v => ({
      id: v.id,
      tipo: 'Venta' as const,
      fecha: v.fecha,
      libras: v.libras,
      monto: v.libras * v.precioLibra,
      detalle: v.proveedor,
      responsable: v.vendedor
    })),
    ...cosechas.map(c => ({
      id: c.id,
      tipo: 'Cosecha' as const,
      fecha: c.fecha,
      libras: c.libras,
      monto: 0,
      detalle: 'Registro de cosecha',
      responsable: c.pescador
    }))
  ].sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

  if (transacciones.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No hay transacciones registradas para este lote.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tipo</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead>Libras</TableHead>
            <TableHead>Monto</TableHead>
            <TableHead>Detalle</TableHead>
            <TableHead>Responsable</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transacciones.map((trans) => (
            <TableRow key={trans.id}>
              <TableCell>
                <Badge 
                  className={
                    trans.tipo === 'Venta' 
                      ? 'bg-green-100 text-green-800 border-green-200' 
                      : 'bg-blue-100 text-blue-800 border-blue-200'
                  }
                >
                  {trans.tipo === 'Venta' ? (
                    <ArrowUpRight className="size-3 mr-1 inline" />
                  ) : (
                    <ArrowDownRight className="size-3 mr-1 inline" />
                  )}
                  {trans.tipo}
                </Badge>
              </TableCell>
              <TableCell>
                {new Date(trans.fecha).toLocaleDateString('es-ES')}
              </TableCell>
              <TableCell>{trans.libras.toFixed(2)} lb</TableCell>
              <TableCell>
                {trans.tipo === 'Venta' 
                  ? <span className="text-green-600">${trans.monto.toLocaleString('es-ES', { minimumFractionDigits: 2 })}</span>
                  : <span className="text-gray-400">-</span>
                }
              </TableCell>
              <TableCell className="text-gray-600">{trans.detalle}</TableCell>
              <TableCell className="text-gray-600">{trans.responsable}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
