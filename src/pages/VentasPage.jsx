import React, { useState } from 'react';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/dialog';
import { motion } from 'framer-motion';

export default function VentasPage() {
  const [ventas, setVentas] = useState([]);
  const [indice, setIndice] = useState(0);
  const [venta, setVenta] = useState({
    id: Date.now(),
    producto: '',
    cantidad: '',
    precio: '',
    fecha: new Date().toLocaleDateString(),
    hora: new Date().toLocaleTimeString()
  });
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleChange = (e) => {
    setVenta({ ...venta, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const nuevaVenta = {
      ...venta,
      total: parseFloat(venta.precio) * parseFloat(venta.cantidad)
    };
    const nuevasVentas = [...ventas, nuevaVenta];
    setVentas(nuevasVentas);
    setIndice(nuevasVentas.length - 1);
    alert('✅ Venta registrada correctamente');
    setVenta({
      id: Date.now(),
      producto: '',
      cantidad: '',
      precio: '',
      fecha: new Date().toLocaleDateString(),
      hora: new Date().toLocaleTimeString()
    });
  };

  const handleEditar = () => {
    setVenta({ ...ventas[indice] });
    const nuevas = [...ventas];
    nuevas.splice(indice, 1);
    setVentas(nuevas);
    setIndice(Math.max(indice - 1, 0));
  };

  const handleEliminar = () => {
    const nuevas = ventas.filter((_, i) => i !== indice);
    setVentas(nuevas);
    setIndice(0);
    setConfirmOpen(false);
  };

  const ventaActual = ventas[indice];

  return (
    <div className="max-w-lg mx-auto py-8 px-4 font-sans">
      <h2 className="text-2xl font-bold text-center mb-6">Registros de ventas</h2>

      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <div className="space-y-1">
          <Label htmlFor="id">ID</Label>
          <Input name="id" value={venta.id} onChange={handleChange} />
        </div>
        <div className="space-y-1">
          <Label htmlFor="producto">Producto</Label>
          <Input name="producto" value={venta.producto} onChange={handleChange} required />
        </div>
        <div className="space-y-1">
          <Label htmlFor="cantidad">Cantidad</Label>
          <Input type="number" name="cantidad" value={venta.cantidad} onChange={handleChange} required />
        </div>
        <div className="space-y-1">
          <Label htmlFor="precio">Precio</Label>
          <Input type="number" name="precio" value={venta.precio} onChange={handleChange} required />
        </div>
        <div className="space-y-1">
          <Label htmlFor="fecha">Fecha</Label>
          <Input name="fecha" value={venta.fecha} onChange={handleChange} />
        </div>
        <div className="space-y-1">
          <Label htmlFor="hora">Hora</Label>
          <Input name="hora" value={venta.hora} onChange={handleChange} />
        </div>
        <Button type="submit" className="w-full">Registrar Venta</Button>
      </form>

      {ventaActual && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 border border-blue-200 p-4 rounded-md"
        >
          <div className="text-center space-y-2">
            <h3 className="font-semibold text-lg">📦 Venta #{indice + 1} de {ventas.length}</h3>
            <p><strong>ID:</strong> {ventaActual.id}</p>
            <p><strong>Producto:</strong> {ventaActual.producto}</p>
            <p><strong>Cantidad:</strong> {ventaActual.cantidad}</p>
            <p><strong>Precio:</strong> ${ventaActual.precio}</p>
            <p><strong>Total:</strong> ${ventaActual.total?.toFixed(2)}</p>
            <p><strong>Fecha:</strong> {ventaActual.fecha}</p>
            <p><strong>Hora:</strong> {ventaActual.hora}</p>

            <div className="flex justify-center gap-4 mt-4">
              <Button variant="outline" onClick={() => setIndice(Math.max(0, indice - 1))} disabled={indice === 0}>⬅ Anterior</Button>
              <Button variant="outline" onClick={() => setIndice(Math.min(ventas.length - 1, indice + 1))} disabled={indice === ventas.length - 1}>Siguiente ➡</Button>
            </div>

            <div className="flex justify-center gap-4 mt-4">
              <Button variant="secondary" onClick={handleEditar}>✏️ Editar</Button>
              <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                <DialogTrigger asChild>
                  <Button variant="destructive">🗑️ Eliminar</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>¿Estás seguro?</DialogTitle>
                  </DialogHeader>
                  <p className="text-sm text-muted-foreground">Esta acción no se puede deshacer.</p>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setConfirmOpen(false)}>Cancelar</Button>
                    <Button variant="destructive" onClick={handleEliminar}>Eliminar</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
