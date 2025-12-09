import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { ProveedorForm } from './ProveedorForm';
import { ProveedorTable, Proveedor } from './ProveedorTable';
import { Card } from './ui/card'; // si no tienes Card, puedes quitarlo o usar un div

export default function ProovedorList() {
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [editing, setEditing] = useState<Proveedor | null>(null);
  const [loading, setLoading] = useState(true);

  const cargarProveedores = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from('proveedores')
      .select('*')
      .order('nombre', { ascending: true });

    if (error) {
      console.error('Error cargando proveedores:', error);
      alert('Error al cargar proveedores: ' + error.message);
      setLoading(false);
      return;
    }

    // Mapear datos de Supabase → interfaz del front
    const list: Proveedor[] =
      data?.map((p: any) => ({
        id: p.id,
        nombre: p.nombre,
        contacto: p.contacts ?? '',
        telefono: p.telefono ?? '',
        email: p.email ?? '',
        activo: p.activo ?? true,
      })) ?? [];

    setProveedores(list);
    setLoading(false);
  };

  useEffect(() => {
    cargarProveedores();
  }, []);

  const handleSubmit = () => {
    setEditing(null);
    cargarProveedores();
  };

  return (
    <div className="space-y-6">
      <Card className="p-4">
        <h2 className="text-lg font-semibold mb-4">
          {editing ? 'Editar Proveedor' : 'Nuevo Proveedor'}
        </h2>
        <ProveedorForm initialData={editing || undefined} onSubmit={handleSubmit} />
      </Card>

      <Card className="p-4">
        <h2 className="text-lg font-semibold mb-4">Listado de Proveedores</h2>
        {loading ? (
          <p className="text-gray-500">Cargando proveedores...</p>
        ) : (
          <ProveedorTable
            proveedores={proveedores}
            onEdit={(p) => setEditing(p)}
            onRefresh={cargarProveedores}
          />
        )}
      </Card>
    </div>
  );
}
