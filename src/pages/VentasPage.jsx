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
        className="space-y-5 mb-6 bg-white p-6 rounded-xl shadow-md border"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        whileHover={{ scale: 1.01 }}
      >
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Label htmlFor="id">ID</Label>
          <Input name="id" value={venta.id} onChange={handleChange} readOnly />
        </motion.div>

        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
          <Label htmlFor="producto">Producto</Label>
          <Input name="producto" value={venta.producto} onChange={handleChange} required />
        </motion.div>

        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
          <Label htmlFor="cantidad">Cantidad</Label>
          <Input type="number" name="cantidad" value={venta.cantidad} onChange={handleChange} min="1" required />
        </motion.div>

        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
          <Label htmlFor="precio">Precio (MXN)</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <Input type="number" name="precio" value={venta.precio} onChange={handleChange} className="pl-6" min="1" required />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
          <Label htmlFor="fecha">Fecha</Label>
          <Input name="fecha" value={venta.fecha} onChange={handleChange} />
        </motion.div>

        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
          <Label htmlFor="hora">Hora</Label>
          <Input name="hora" value={venta.hora} onChange={handleChange} />
        </motion.div>

        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          <Button type="submit" className="w-full">Registrar Venta</Button>
        </motion.div>
      </motion.form>

      <AnimatePresence mode="wait">
        {ventaActual && (
          <motion.div
            key={ventaActual.id}
            className="bg-blue-50 border border-blue-200 p-4 rounded-xl shadow-md"
            initial={{ x: direccion > 0 ? 150 : -150, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: direccion > 0 ? -150 : 150, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div className="text-center space-y-2" initial={{ scale: 0.95 }} animate={{ scale: 1 }} transition={{ duration: 0.3 }}>
              <h3 className="font-semibold text-lg">📦 Venta #{indice + 1} de {ventas.length}</h3>
              <p><strong>ID:</strong> {ventaActual.id}</p>
              <p><strong>Producto:</strong> {ventaActual.producto}</p>
              <p><strong>Cantidad:</strong> {ventaActual.cantidad}</p>
              <p><strong>Precio:</strong> ${ventaActual.precio}</p>
              <p><strong>Total:</strong> ${ventaActual.total?.toFixed(2)}</p>
              <p><strong>Fecha:</strong> {ventaActual.fecha}</p>
              <p><strong>Hora:</strong> {ventaActual.hora}</p>

              <motion.div className="flex justify-center gap-4 mt-4" layout>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="outline" onClick={() => {
                    setDireccion(-1);
                    setIndice(Math.max(0, indice - 1));
                  }} disabled={indice === 0}>
                    ⬅ Anterior
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="outline" onClick={() => {
                    setDireccion(1);
                    setIndice(Math.min(ventas.length - 1, indice + 1));
                  }} disabled={indice === ventas.length - 1}>
                    Siguiente ➡
                  </Button>
                </motion.div>
              </motion.div>

              <motion.div className="flex justify-center gap-4 mt-4">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="secondary" onClick={handleEditar}>✏️ Editar</Button>
                </motion.div>

                <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                  <DialogTrigger asChild>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button variant="destructive">🗑️ Eliminar</Button>
                    </motion.div>
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
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
