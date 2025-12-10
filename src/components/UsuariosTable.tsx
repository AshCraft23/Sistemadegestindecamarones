import { Button } from "./ui/button";
import { Pencil, Trash2 } from "lucide-react";

interface Usuario {
  id: string;
  name: string;
  username: string;
  email: string;
  role: string;
  active: boolean;
}

interface UsuariosTableProps {
  usuarios: Usuario[];
  onEdit: (user: Usuario) => void;
  onDelete: (id: string) => void;
}

export function UsuariosTable({ usuarios, onEdit, onDelete }: UsuariosTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full bg-white text-sm">
        <thead className="bg-gray-100 border-b">
          <tr>
            <th className="p-3 text-left">Nombre</th>
            <th className="p-3 text-left">Usuario</th>
            <th className="p-3 text-left">Email</th>
            <th className="p-3 text-left">Rol</th>
            <th className="p-3 text-left">Activo</th>
            <th className="p-3 text-right">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {usuarios.map((u) => (
            <tr key={u.id} className="border-b hover:bg-gray-50 transition">
              <td className="p-3">{u.name}</td>
              <td className="p-3">{u.username}</td>
              <td className="p-3">{u.email}</td>
              <td className="p-3">{u.role}</td>
              <td className="p-3">
                <span
                  className={
                    u.active
                      ? "px-2 py-1 rounded bg-green-100 text-green-700"
                      : "px-2 py-1 rounded bg-red-100 text-red-700"
                  }
                >
                  {u.active ? "Activo" : "Inactivo"}
                </span>
              </td>

              <td className="p-3 text-right flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(u)}
                >
                  <Pencil className="size-4" />
                </Button>

                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDelete(u.id)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </td>
            </tr>
          ))}

          {/* Si no hay usuarios */}
          {usuarios.length === 0 && (
            <tr>
              <td
                className="p-4 text-center text-gray-500"
                colSpan={6}
              >
                No hay usuarios registrados.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
