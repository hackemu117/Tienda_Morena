import React, { useState } from 'react';
import axios from 'axios';
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!clienteId || productosVenta.length === 0) {
      alert('⚠️ Completa los datos del cliente y productos');
      return;
    }

    const items = productosVenta.map(p => ({
      id: parseInt(p.id),
      cantidad: parseFloat(p.cantidad),
      precio: parseFloat(p.precio)
    }));

    const total_venta = items.reduce((acc, p) => acc + p.precio * p.cantidad, 0);

    try {
      const res = await axios.post('http://localhost:3001/api/ventas', {
        id_cli_venta: parseInt(clienteId),
        metodo_pago_venta: 'Efectivo',
        items,
        total_venta
      });

      alert(`✅ Venta registrada correctamente. ID: ${res.data.id_venta || 'N/A'}`);
      setProductosVenta([]);
      setClienteId('');
      setVendedor('');
    } catch (err) {
      console.error('Error al registrar venta:', err);
      alert('❌ Error al registrar la venta');
    }
  };

  const handleEditarVenta = (ventaEditar, index) => {
    setProductosVenta(ventaEditar.productos);
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
    <motion.div className="max-w-4xl mx-auto py-10 px-6 font-sans" initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <h2 className="text-3xl font-bold text-red-800 mb-8 text-center flex items-center justify-center gap-3">
        <FaShoppingCart className="text-2xl" /> Registro de Ventas
      </h2>

      <motion.form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-xl border border-gray-300 space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
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

        <Button type="submit" className="w-full mt-4 bg-red-800 hover:bg-red-900">✅ Confirmar Venta</Button>
      </motion.form>
    </motion.div>
  );
}

