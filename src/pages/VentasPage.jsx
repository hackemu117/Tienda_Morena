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
import { FaShoppingCart, FaTrash, FaEdit, FaArrowLeft, FaArrowRight } from 'react-icons/fa';

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
    <motion.div
      className="max-w-4xl mx-auto py-10 px-6 font-sans"
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl font-bold text-red-800 mb-8 text-center flex items-center justify-center gap-3">
        <FaShoppingCart className="text-2xl" /> Registro de Ventas
      </h2>

      <motion.form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl p-6 shadow-xl border border-gray-300 space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="grid md:grid-cols-2 gap-4">
          <div><Label>ID del Vendedor</Label><Input value={vendedor} onChange={(e) => setVendedor(e.target.value)} /></div>
          <div><Label>ID del Cliente</Label><Input value={clienteId} onChange={(e) => setClienteId(e.target.value)} /></div>
        </div>

        <h3 className="text-lg font-semibold text-gray-800 mt-4">Agregar Producto</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Input name="id" placeholder="ID" value={productoTemp.id} onChange={handleProductoChange} />
          <Input name="producto" placeholder="Nombre" value={productoTemp.producto} onChange={handleProductoChange} />
          <Input name="cantidad" type="number" placeholder="Cantidad" value={productoTemp.cantidad} onChange={handleProductoChange} />
          <Input name="precio" type="number" placeholder="Precio" value={productoTemp.precio} onChange={handleProductoChange} />
        </div>
        <Button type="button" onClick={agregarProducto}>+ Agregar Producto</Button>

        {productosVenta.length > 0 && (
          <div className="bg-gray-50 border mt-4 p-4 rounded-lg">
            <ul className="space-y-2 text-sm">
              {productosVenta.map((p, i) => (
                <li key={i} className="flex justify-between items-center">
                  <span>{p.producto} x {p.cantidad} = ${p.subtotal.toFixed(2)}</span>
                  <Button type="button" size="sm" variant="destructive" onClick={() => eliminarProductoDeLista(i)}><FaTrash /></Button>
                </li>
              ))}
            </ul>
            <div className="text-right text-sm mt-2">
              <p><strong>Total productos:</strong> {totalProductos}</p>
              <p><strong>Total a pagar:</strong> ${totalDinero.toFixed(2)}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div><Label>Fecha</Label><Input name="fecha" value={venta.fecha} readOnly /></div>
          <div><Label>Hora</Label><Input name="hora" value={venta.hora} readOnly /></div>
        </div>

        <Button type="submit" className="w-full mt-4 bg-red-800 hover:bg-red-900">✅ Confirmar Venta</Button>
      </motion.form>

      {ventaActual && (
        <motion.div className="mt-10 bg-white rounded-xl shadow-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-center mb-4">🧾 Detalle de Venta</h3>
          <p className="text-sm mb-1"><strong>ID:</strong> {ventaActual.id}</p>
          <p className="text-sm mb-1"><strong>Vendedor:</strong> {ventaActual.vendedor}</p>
          <p className="text-sm mb-1"><strong>Cliente:</strong> {ventaActual.clienteId}</p>
          <p className="text-sm mb-3"><strong>Fecha:</strong> {ventaActual.fecha} <strong>Hora:</strong> {ventaActual.hora}</p>
          <ul className="text-sm list-disc pl-6 space-y-1">
            {ventaActual.productos.map((p, i) => (
              <li key={i}>{p.producto} x {p.cantidad} = ${p.subtotal.toFixed(2)}</li>
            ))}
          </ul>
          <p className="mt-3 font-semibold text-right text-lg">Total: ${ventaActual.total.toFixed(2)}</p>

          <div className="flex justify-between mt-6">
            <Button size="sm" variant="outline" onClick={() => setIndiceVentaMostrada(Math.max(0, indiceVentaMostrada - 1))}><FaArrowLeft /> Anterior</Button>
            <div className="flex gap-2">
              <Button size="sm" variant="secondary" onClick={() => handleEditarVenta(ventaActual, indiceVentaMostrada)}><FaEdit /> Editar</Button>
              <Button size="sm" variant="destructive" onClick={() => handleEliminarVenta(indiceVentaMostrada)}><FaTrash /> Eliminar</Button>
            </div>
            <Button size="sm" variant="outline" onClick={() => setIndiceVentaMostrada(Math.min(ventas.length - 1, indiceVentaMostrada + 1))}>Siguiente <FaArrowRight /></Button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}