import { useState } from "react";
import { UsuariosPanel } from "./components/UsuariosPanel";
import { ProveedoresPanel } from "./components/ProveedoresPanel";
import { PescadoresPanel } from "./components/PescadoresPanel";
import { CosechasPanel } from "./components/CosechasPanel";

// =======================
// TIPOS GLOBALES
// =======================

export type UserRole = "Administrador" | "Propietario" | "Vendedor" | "Pescador";

export interface Usuario {
  id: string;
  nombre: string;
  username: string;
  password: string;
  rol: UserRole;
  activo: boolean;
}

// =======================
// COMPONENTE PRINCIPAL
// =======================

export default function App() {
  // ---------------------------
  // ESTADO: USUARIOS
  // ---------------------------

  const [usuarios, setUsuarios] = useState<Usuario[]>([
    {
      id: "1",
      nombre: "Admin",
      username: "admin",
      password: "1234",
      rol: "Administrador",
      activo: true,
    },
    {
      id: "2",
      nombre: "Pedro",
      username: "vendedor1",
      password: "abcd",
      rol: "Vendedor",
      activo: true,
    },
  ]);

  // ==== CRUD USUARIOS ====

  const handleCreateUsuario = (data: Omit<Usuario, "id">) => {
    const newUser: Usuario = {
      id: String(Date.now()),
      ...data,
    };

    setUsuarios((prev) => [...prev, newUser]);
  };

  const handleUpdateUsuario = (id: string, data: Omit<Usuario, "id">) => {
    setUsuarios((prev) =>
      prev.map((u) => (u.id === id ? { ...u, ...data } : u))
    );
  };

  const handleDeleteUsuario = (id: string) => {
    setUsuarios((prev) => prev.filter((u) => u.id !== id));
  };

  // ---------------------------
  // PANELES / NAVEGACIÓN
  // ---------------------------

  const [panel, setPanel] = useState<
    "usuarios" | "proveedores" | "pescadores" | "cosechas"
  >("usuarios");

  return (
    <div className="p-6 space-y-6">

      {/* NAV */}
      <div className="flex gap-3">
        <button
          className={`px-4 py-2 rounded ${
            panel === "usuarios" ? "bg-purple-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setPanel("usuarios")}
        >
          Usuarios
        </button>

        <button
          className={`px-4 py-2 rounded ${
            panel === "proveedores" ? "bg-purple-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setPanel("proveedores")}
        >
          Proveedores
        </button>

        <button
          className={`px-4 py-2 rounded ${
            panel === "pescadores" ? "bg-purple-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setPanel("pescadores")}
        >
          Pescadores
        </button>

        <button
          className={`px-4 py-2 rounded ${
            panel === "cosechas" ? "bg-purple-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setPanel("cosechas")}
        >
          Cosechas
        </button>
      </div>

      {/* CONTENIDO */}
      {panel === "usuarios" && (
        <UsuariosPanel
          usuarios={usuarios}
          onCreateUsuario={handleCreateUsuario}
          onUpdateUsuario={handleUpdateUsuario}
          onDeleteUsuario={handleDeleteUsuario}
        />
      )}

      {panel === "proveedores" && <ProveedoresPanel />}

      {panel === "pescadores" && <PescadoresPanel />}

      {panel === "cosechas" && <CosechasPanel />}
    </div>
  );
}
