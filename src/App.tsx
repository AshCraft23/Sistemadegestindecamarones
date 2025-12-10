import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase"; // ✅ IMPORTACIÓN CORREGIDA
import AdministracionPanel from "./components/AdministracionPanel";

export default function App() {
  // -------------------------
  // ESTADOS PRINCIPALES
  // -------------------------
  const [lotes, setLotes] = useState([]);
  const [cosechas, setCosechas] = useState([]);
  const [ventas, setVentas] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [pescadores, setPescadores] = useState([]);
  const [vendedores, setVendedores] = useState([]);

  // -------------------------
  // CARGA GENERAL DE DATOS
  // -------------------------
  const fetchAll = async () => {
    await Promise.all([
      fetchLotes(),
      fetchCosechas(),
      fetchVentas(),
      fetchProveedores(),
      fetchPescadores(),
      fetchVendedores(),
    ]);
  };

  // -------- FETCHERS --------

  const fetchLotes = async () => {
    const { data, error } = await supabase.from("lotes").select("*");
    if (!error) setLotes(data);
  };

  const fetchCosechas = async () => {
    const { data, error } = await supabase.from("cosechas").select("*");
    if (!error) setCosechas(data);
  };

  const fetchVentas = async () => {
    const { data, error } = await supabase.from("ventas").select("*");
    if (!error) setVentas(data);
  };

  const fetchProveedores = async () => {
    const { data, error } = await supabase.from("proveedores").select("*");
    if (!error) setProveedores(data);
  };

  const fetchPescadores = async () => {
    const { data, error } = await supabase.from("pescadores").select("*");
    if (!error) setPescadores(data);
  };

  const fetchVendedores = async () => {
    const { data, error } = await supabase.from("vendedores").select("*");
    if (!error) setVendedores(data);
  };

  // -------------------------
  // SUSCRIPCIONES REALTIME
  // -------------------------
  const setupRealtime = () => {
    const tables = [
      "lotes",
      "cosechas",
      "ventas",
      "proveedores",
      "pescadores",
      "vendedores",
    ];

    const channels = [];

    tables.forEach((tableName) => {
      const channel = supabase
        .channel(`realtime:${tableName}`)
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: tableName },
          () => {
            switch (tableName) {
              case "lotes":
                fetchLotes();
                break;
              case "cosechas":
                fetchCosechas();
                break;
              case "ventas":
                fetchVentas();
                break;
              case "proveedores":
                fetchProveedores();
                break;
              case "pescadores":
                fetchPescadores();
                break;
              case "vendedores":
                fetchVendedores();
                break;
            }
          }
        )
        .subscribe();

      channels.push(channel);
    });

    return channels;
  };

  // -------------------------
  // HANDLERS CRUD
  // -------------------------

  const createLote = async (data) => {
    await supabase.from("lotes").insert(data);
  };

  const updateLote = async (id, data) => {
    await supabase.from("lotes").update(data).eq("id", id);
  };

  const deleteLote = async (id) => {
    await supabase.from("lotes").delete().eq("id", id);
  };

  const createCosecha = async (data) => {
    await supabase.from("cosechas").insert(data);
  };

  const updateCosecha = async (id, data) => {
    await supabase.from("cosechas").update(data).eq("id", id);
  };

  const deleteCosecha = async (id) => {
    await supabase.from("cosechas").delete().eq("id", id);
  };

  const createVenta = async (data) => {
    await supabase.from("ventas").insert(data);
  };

  const updateVenta = async (id, data) => {
    await supabase.from("ventas").update(data).eq("id", id);
  };

  const deleteVenta = async (id) => {
    await supabase.from("ventas").delete().eq("id", id);
  };

  const createProveedor = async (data) => {
    await supabase.from("proveedores").insert(data);
  };

  const updateProveedor = async (id, data) => {
    await supabase.from("proveedores").update(data).eq("id", id);
  };

  const deleteProveedor = async (id) => {
    await supabase.from("proveedores").delete().eq("id", id);
  };

  const createPescador = async (data) => {
    await supabase.from("pescadores").insert(data);
  };

  const updatePescador = async (id, data) => {
    await supabase.from("pescadores").update(data).eq("id", id);
  };

  const deletePescador = async (id) => {
    await supabase.from("pescadores").delete().eq("id", id);
  };

  const createVendedor = async (data) => {
    await supabase.from("vendedores").insert(data);
  };

  const updateVendedor = async (id, data) => {
    await supabase.from("vendedores").update(data).eq("id", id);
  };

  const deleteVendedor = async (id) => {
    await supabase.from("vendedores").delete().eq("id", id);
  };

  // -------------------------
  // INITIALIZACIÓN
  // -------------------------
  useEffect(() => {
    fetchAll();
    const channels = setupRealtime();

    return () => {
      channels.forEach((ch) => supabase.removeChannel(ch));
    };
  }, []);

  return (
    <AdministracionPanel
      lotes={lotes}
      cosechas={cosechas}
      ventas={ventas}
      proveedores={proveedores}
      pescadores={pescadores}
      vendedores={vendedores}
      onCreateLote={createLote}
      onUpdateLote={updateLote}
      onDeleteLote={deleteLote}
      onCreateCosecha={createCosecha}
      onUpdateCosecha={updateCosecha}
      onDeleteCosecha={deleteCosecha}
      onCreateVenta={createVenta}
      onUpdateVenta={updateVenta}
      onDeleteVenta={deleteVenta}
      onCreateProveedor={createProveedor}
      onUpdateProveedor={updateProveedor}
      onDeleteProveedor={deleteProveedor}
      onCreatePescador={createPescador}
      onUpdatePescador={updatePescador}
      onDeletePescador={deletePescador}
      onCreateVendedor={createVendedor}
      onUpdateVendedor={updateVendedor}
      onDeleteVendedor={deleteVendedor}
      userRole="Administrador"
    />
  );
}
