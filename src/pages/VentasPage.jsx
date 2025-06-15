import React, { useState } from 'react';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '../components/ui/dialog';
import { motion, AnimatePresence } from 'framer-motion';

export default function VentasPage() {
  const [ventas, setVentas] = useState([]);
  const [indice, setIndice] = useState(0);
  const [direccion, setDireccion] = useState(1);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [venta, setVenta] = useState({
    id: Date.now(),
    producto: '',
    cantidad: '',
    precio: '',
    fecha: new Date().toLocaleDateString(),
    hora: new Date().toLocaleTimeString()
  });

  const handleChange = (e) => {
    setVenta({ ...venta, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const cantidad = parseFloat(venta.cantidad);
    const precio = parseFloat(venta.precio);

    if (isNaN(cantidad) || isNaN(precio) || cantidad <= 0 || precio <= 0) {
      alert('⚠️ Cantidad y precio deben ser mayores a cero');
      return;
    }

    const nuevaVenta = {
      ...venta,
      total: precio * cantidad
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
    <div className="max-w-lg mx-auto py-10 px-4 font-sans">
      <motion.h2
        className="text-2xl font-bold text-center text-blue-900 mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        Registros de Ventas
      </motion.h2>

      <motion.form
        onSubmit={handleSubmit}
        className="space-y-5 mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div>
          <Label htmlFor="id">ID</Label>
          <Input name="id" value={venta.id} onChange={handleChange} readOnly />
        </div>

        <div>
          <Label htmlFor="producto">Producto</Label>
          <Input name="producto" value={venta.producto} onChange={handleChange} required />
        </div>

        <div>
          <Label htmlFor="cantidad">Cantidad</Label>
          <Input
            type="number"
            name="cantidad"
            value={venta.cantidad}
            onChange={handleChange}
            min="1"
            placeholder="Ej. 2"
            required
          />
        </div>

        <div>
          <Label htmlFor="precio">Precio (MXN)</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <Input
              type="number"
              name="precio"
              value={venta.precio}
              onChange={handleChange}
              className="pl-6"
              min="1"
              placeholder="Ej. 49.99"
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="fecha">Fecha</Label>
          <Input name="fecha" value={venta.fecha} onChange={handleChange} />
        </div>

        <div>
          <Label htmlFor="hora">Hora</Label>
          <Input name="hora" value={venta.hora} onChange={handleChange} />
        </div>

        <Button type="submit" className="w-full">Registrar Venta</Button>
      </motion.form>

      <AnimatePresence mode="wait">
        {ventaActual && (
          <motion.div
            key={ventaActual.id}
            className="bg-blue-50 border border-blue-200 p-4 rounded-md"
            initial={{ x: direccion > 0 ? 150 : -150, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: direccion > 0 ? -150 : 150, opacity: 0 }}
            transition={{ duration: 0.2 }}
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
                <Button
                  variant="outline"
                  onClick={() => {
                    setDireccion(-1);
                    setIndice(Math.max(0, indice - 1));
                  }}
                  disabled={indice === 0}
                >
                  ⬅ Anterior
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setDireccion(1);
                    setIndice(Math.min(ventas.length - 1, indice + 1));
                  }}
                  disabled={indice === ventas.length - 1}
                >
                  Siguiente ➡
                </Button>
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
                    <p className="text-sm text-muted-foreground">
                      Esta acción no se puede deshacer.
                    </p>
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
      </AnimatePresence>
    </div>
  );
}
