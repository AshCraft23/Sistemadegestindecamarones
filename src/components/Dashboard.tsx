import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select";
import { Input } from "./components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { LoteForm } from "./components/LoteForm";

export default function Dashboard() {
  const [lotes, setLotes] = useState([]);
  const [selectedLote, setSelectedLote] = useState<string | null>(null);
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    if (selectedLote) {
      const lote = lotes.find((l) => l.nombre === selectedLote);
      setFilteredData(lote ? lote.historial || [] : []);
    }
  }, [selectedLote, lotes]);

  const handleCreateLote = (nuevoLote) => {
    setLotes([...lotes, { ...nuevoLote, historial: [] }]);
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-cyan-500">Dashboard General</h1>

      {/* TARJETAS RESUMEN */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Lotes</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">{lotes.length}</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Lotes Activos</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">
            {lotes.filter((l) => l.estado === "Crianza").length}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Listos para Pescar</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">
            {lotes.filter((l) => l.estado === "Listo para Pescar").length}
          </CardContent>
        </Card>
      </div>

      {/* FORMULARIO CREAR LOTE */}
      <Card className="p-4">
        <CardHeader>
          <CardTitle>Crear Nuevo Lote</CardTitle>
        </CardHeader>
        <CardContent>
          <LoteForm onSubmit={handleCreateLote} />
        </CardContent>
      </Card>

      {/* SELECCIÓN DE LOTE */}
      <Card className="p-4">
        <CardHeader>
          <CardTitle>Seleccionar Lote</CardTitle>
        </CardHeader>
        <CardContent>
          <Select onValueChange={setSelectedLote}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccione un lote" />
            </SelectTrigger>
            <SelectContent>
              {lotes.map((l) => (
                <SelectItem key={l.nombre} value={l.nombre}>
                  {l.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* GRÁFICOS */}
      <Tabs defaultValue="lineal" className="w-full">
        <TabsList>
          <TabsTrigger value="lineal">Crecimiento</TabsTrigger>
          <TabsTrigger value="barras">Costos</TabsTrigger>
        </TabsList>

        {/* GRÁFICO LINEAL */}
        <TabsContent value="lineal">
          <Card className="p-4 h-[400px]">
            <CardHeader>
              <CardTitle>Historial de Crecimiento</CardTitle>
            </CardHeader>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={filteredData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="fecha" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="peso_promedio" stroke="#0ea5e9" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>

        {/* GRÁFICO DE BARRAS */}
        <TabsContent value="barras">
          <Card className="p-4 h-[400px]">
            <CardHeader>
              <CardTitle>Costos de Producción</CardTitle>
            </CardHeader>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={lotes}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="nombre" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="costo_produccion" fill="#06b6d4" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
