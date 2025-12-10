export function CosechaForm({
  lotes,
  pescadores,
  pescadorNombre,
  onSubmit,
}: CosechaFormProps) {
  const [formData, setFormData] = useState({
    loteId: "",
    fecha: new Date().toISOString().split("T")[0],
    libras: 0,
    pescadorId: "",        // ✔️ Guardaremos el ID real
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.loteId) {
      alert("Debes seleccionar un lote.");
      return;
    }

    if (formData.libras <= 0) {
      alert("Las libras deben ser mayores a 0.");
      return;
    }

    if (!formData.pescadorId) {
      alert("Debes seleccionar un pescador.");
      return;
    }

    onSubmit(formData);

    setFormData({
      loteId: "",
      fecha: new Date().toISOString().split("T")[0],
      libras: 0,
      pescadorId: "",
    });
  };

  if (lotes.length === 0) {
    return (
      <Card className="border-yellow-200 bg-yellow-50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 text-yellow-800">
            <AlertCircle className="size-5" />
            <p>
              No hay lotes disponibles para cosecha.  
              Solo los lotes con estado **"Listo para Pescar"** pueden cosecharse.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Registrar Nueva Cosecha</CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* LOTE */}
          <div>
            <Label>Lote</Label>
            <Select
              value={formData.loteId}
              onValueChange={(v) => setFormData({ ...formData, loteId: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar lote" />
              </SelectTrigger>
              <SelectContent>
                {lotes.map((lote) => (
                  <SelectItem key={lote.id} value={lote.id}>
                    {lote.nombre} — {lote.tipo_camaron}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* FECHA */}
          <div>
            <Label>Fecha</Label>
            <Input
              type="date"
              value={formData.fecha}
              onChange={(e) =>
                setFormData({ ...formData, fecha: e.target.value })
              }
            />
          </div>

          {/* LIBRAS */}
          <div>
            <Label>Libras cosechadas</Label>
            <Input
              type="number"
              step="0.01"
              min="0.01"
              value={formData.libras}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  libras: parseFloat(e.target.value) || 0,
                })
              }
            />
          </div>

          {/* PESCADOR */}
          <div>
            <Label>Pescador</Label>
            <Select
              value={formData.pescadorId}
              onValueChange={(v) =>
                setFormData({ ...formData, pescadorId: v })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar pescador" />
              </SelectTrigger>
              <SelectContent>
                {pescadores.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.nombre} — {p.especialidad}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button className="w-full bg-gradient-to-r from-cyan-600 to-teal-600 text-white">
            Registrar Cosecha
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
