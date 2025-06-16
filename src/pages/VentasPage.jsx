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
  const [indiceVentaMostrada, setIndiceVentaMostrada] = useState(0);
  const [productosVenta, setProductosVenta] = useState([]);
  const [productoTemp, setProductoTemp] = useState({ id: '', producto: '', cantidad: '', precio: '' });
  const [vendedor, setVendedor] = useState('');
  const [clienteId, setClienteId] = useState('');
  const [venta, setVenta] = useState({
    id: Date.now(),
    productos: [],
    total: 0,
    fecha: new Date().toLocaleDateString(),
    hora: new Date().toLocaleTimeString(),
    vendedor: '',
    clienteId: ''
  });
  const [ventaEliminada, setVentaEliminada] = useState(null);

  const handleProductoChange = (e) => {
    setProductoTemp({ ...productoTemp, [e.target.name]: e.target.value });
  };

  const eliminarProductoDeLista = (index) => {
    const nuevos = productosVenta.filter((_, i) => i !== index);
    setProductosVenta(nuevos);
  };

  const agregarProducto = () => {
    const { id, producto, cantidad, precio } = productoTemp;
    const cant = parseFloat(cantidad);
    const prec = parseFloat(precio);
    if (!id || !producto || cant <= 0 || prec <= 0) {
      alert('⚠️ Todos los campos del producto deben ser válidos');
      return;
    }
    const nuevo = { id, producto, cantidad: cant, precio: prec, subtotal: cant * prec };
    setProductosVenta([...productosVenta, nuevo]);
    setProductoTemp({ id: '', producto: '', cantidad: '', precio: '' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!vendedor || !clienteId) {
      alert('⚠️ Ingresa el ID del vendedor y del cliente');
      return;
    }
    if (productosVenta.length === 0) {
      alert('⚠️ Agrega al menos un producto a la venta');
      return;
    }
    const total = productosVenta.reduce((sum, p) => sum + p.subtotal, 0);
    const nuevaVenta = {
      id: Date.now(),
      productos: productosVenta,
      total,
      fecha: new Date().toLocaleDateString(),
      hora: new Date().toLocaleTimeString(),
      vendedor,
      clienteId
    };
    setVentas([...ventas, nuevaVenta]);
    setIndiceVentaMostrada(ventas.length);
    setVenta({ id: '', productos: [], total: 0, fecha: nuevaVenta.fecha, hora: nuevaVenta.hora, vendedor: '', clienteId: '' });
    setProductosVenta([]);
    setVendedor('');
    setClienteId('');
    alert('✅ Venta registrada correctamente');
  };

  const handleEditarVenta = (ventaEditar, index) => {
    setProductosVenta(ventaEditar.productos);
    setVenta({ ...ventaEditar });
    setVendedor(ventaEditar.vendedor);
    setClienteId(ventaEditar.clienteId);
    const nuevas = [...ventas];
    nuevas.splice(index, 1);
    setVentas(nuevas);
    setIndiceVentaMostrada(Math.max(0, index - 1));
  };

  const handleEliminarVenta = (index) => {
    const ventaElim = ventas[index];
    const nuevas = [...ventas];
    nuevas.splice(index, 1);
    setVentas(nuevas);
    setVentaEliminada(ventaElim);
    setIndiceVentaMostrada(0);
    setTimeout(() => setVentaEliminada(null), 2000);
  };

  const totalProductos = productosVenta.reduce((acc, prod) => acc + prod.cantidad, 0);
  const totalDinero = productosVenta.reduce((acc, prod) => acc + prod.subtotal, 0);
  const ventaActual = ventas[indiceVentaMostrada];

  return (
    <div className="max-w-lg mx-auto py-10 px-4 font-sans">
      <motion.h2 className="text-2xl font-bold text-center text-blue-900 mb-6" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        Registros de Ventas
      </motion.h2>

      <motion.form onSubmit={handleSubmit} className="space-y-5 mb-6 bg-white p-6 rounded-xl shadow-md border" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} whileHover={{ scale: 1.01 }}>
        <div><Label>ID del Vendedor</Label><Input value={vendedor} onChange={(e) => setVendedor(e.target.value)} placeholder="Ej. 12345" /></div>
        <div><Label>ID del Cliente</Label><Input value={clienteId} onChange={(e) => setClienteId(e.target.value)} placeholder="Ej. 67890" /></div>

        <h3 className="font-semibold text-lg mb-2">Agregar Producto</h3>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div><Label>ID</Label><Input name="id" value={productoTemp.id} onChange={handleProductoChange} /></div>
          <div><Label>Producto</Label><Input name="producto" value={productoTemp.producto} onChange={handleProductoChange} /></div>
          <div><Label>Cantidad</Label><Input type="number" name="cantidad" value={productoTemp.cantidad} onChange={handleProductoChange} min="1" /></div>
          <div><Label>Precio</Label><Input type="number" name="precio" value={productoTemp.precio} onChange={handleProductoChange} min="1" /></div>
        </div>
        <Button type="button" onClick={agregarProducto} className="mt-2">+ Agregar Producto</Button>

        {productosVenta.length > 0 && (
          <div className="mt-6">
            <h4 className="font-semibold mb-2">Productos en la Venta</h4>
            <ul className="divide-y border rounded-lg">
              <AnimatePresence>
                {productosVenta.map((p, i) => (
                  <motion.li
                    key={i}
                    className="flex justify-between items-center p-2 text-sm"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 100 }}
                    transition={{ duration: 0.3 }}
                  >
                    <span><strong>{p.id}</strong> - {p.producto} x {p.cantidad} -- ${p.precio}</span>
                    <div className="flex items-center gap-2">
                      <span>${p.subtotal.toFixed(2)}</span>
                      <Button type="button" size="sm" variant="destructive" onClick={() => eliminarProductoDeLista(i)}>✖</Button>
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
            <div className="text-sm text-right mt-2">
              <p><strong>Total de Productos:</strong> {totalProductos}</p>
              <p><strong>Total a Pagar:</strong> ${totalDinero.toFixed(2)}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div><Label>Fecha</Label><Input name="fecha" value={venta.fecha} readOnly /></div>
          <div><Label>Hora</Label><Input name="hora" value={venta.hora} readOnly /></div>
        </div>
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          <Button type="submit" className="w-full mt-4">✅ Confirmar Compra</Button>
        </motion.div>
      </motion.form>

      <AnimatePresence>
        {ventas.length > 0 && ventaActual && (
          <motion.div
            key={ventaActual.id}
            className="mt-10"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-lg font-bold text-center mb-4">🧾 Venta #{indiceVentaMostrada + 1} de {ventas.length}</h3>
            <div className="bg-white rounded-xl p-4 shadow-md border">
              <p className="text-sm mb-1"><strong>ID:</strong> {ventaActual.id}</p>
              <p className="text-sm mb-1"><strong>Vendedor:</strong> {ventaActual.vendedor}</p>
              <p className="text-sm mb-1"><strong>Cliente:</strong> {ventaActual.clienteId}</p>
              <p className="text-sm mb-1"><strong>Fecha:</strong> {ventaActual.fecha} - <strong>Hora:</strong> {ventaActual.hora}</p>
              <ul className="text-sm list-disc pl-5 mt-3 space-y-1">
                {ventaActual.productos.map((p, i) => (
                  <li key={i}><strong>{p.id}</strong> - {p.producto} x {p.cantidad} --${p.precio} = ${p.subtotal.toFixed(2)}</li>
                ))}
              </ul>
              <p className="mt-3 font-semibold text-right">Total: ${ventaActual.total.toFixed(2)}</p>
              <div className="flex justify-between mt-4">
                <Button size="sm" variant="outline" disabled={indiceVentaMostrada === 0} onClick={() => setIndiceVentaMostrada(indiceVentaMostrada - 1)}>⬅ Anterior</Button>
                <div className="flex gap-2">
                  <Button size="sm" variant="secondary" onClick={() => handleEditarVenta(ventaActual, indiceVentaMostrada)}>✏️ Editar</Button>
                  <Button size="sm" variant="destructive" onClick={() => handleEliminarVenta(indiceVentaMostrada)}>🗑 Eliminar</Button>
                </div>
                <Button size="sm" variant="outline" disabled={indiceVentaMostrada === ventas.length - 1} onClick={() => setIndiceVentaMostrada(indiceVentaMostrada + 1)}>Siguiente ➡</Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {ventaEliminada && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="fixed top-5 right-5 bg-green-100 border border-green-400 text-green-800 px-4 py-2 rounded-xl shadow-lg"
          >
            ✅ Venta eliminada correctamente
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
