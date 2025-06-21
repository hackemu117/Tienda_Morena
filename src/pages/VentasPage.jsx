import React, { useState } from 'react';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { motion } from 'framer-motion';
import { FaShoppingCart, FaTrash } from 'react-icons/fa';

export default function VentasPage() {
  const [ventas, setVentas] = useState([]);
  const [productosVenta, setProductosVenta] = useState([]);
  const [productoTemp, setProductoTemp] = useState({ id: '', producto: '', cantidad: '', precio: '' });
  const [clienteId, setClienteId] = useState('');
  const [clienteNombre, setClienteNombre] = useState('');

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
    if (!clienteId || !clienteNombre || productosVenta.length === 0) {
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
        nombre_cliente: clienteNombre,
        metodo_pago_venta: 'Efectivo',
        items,
        total_venta
      });

      alert(`✅ Venta registrada correctamente. ID: ${res.data.id_venta || 'N/A'}`);
      setProductosVenta([]);
      setClienteId('');
      setClienteNombre('');
    } catch (err) {
      console.error('Error al registrar venta:', err);
      alert('❌ Error al registrar la venta');
    }
  };

  const totalProductos = productosVenta.reduce((acc, prod) => acc + prod.cantidad, 0);
  const totalDinero = productosVenta.reduce((acc, prod) => acc + prod.subtotal, 0);

  return (
    <motion.div
      className="max-w-4xl mx-auto py-10 px-6 font-sans"
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h2
        className="text-3xl font-bold text-red-700 mb-8 text-center flex items-center justify-center gap-3"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 80 }}
      >
        <FaShoppingCart className="text-2xl" /> Registro de Ventas
      </motion.h2>

      <motion.form
        onSubmit={handleSubmit}
        className="bg-gradient-to-br from-red-50 to-white rounded-3xl p-8 shadow-2xl border border-red-100 space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="grid md:grid-cols-2 gap-6">
          <motion.div
            className="relative"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
          >
            <label className="text-sm font-medium text-red-800 mb-1 block">ID del Cliente</label>
            <input
              type="text"
              value={clienteId}
              onChange={(e) => setClienteId(e.target.value)}
              placeholder="Ej. 101"
              className="w-full px-4 py-2 rounded-xl bg-gradient-to-r from-white to-red-50 border border-red-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-400 transition-all duration-300"
            />
          </motion.div>

          <motion.div
            className="relative"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <label className="text-sm font-medium text-red-800 mb-1 block">Nombre del Cliente</label>
            <input
              type="text"
              value={clienteNombre}
              onChange={(e) => setClienteNombre(e.target.value)}
              placeholder="Ej. Juan Pérez"
              className="w-full px-4 py-2 rounded-xl bg-gradient-to-r from-white to-red-50 border border-red-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-400 transition-all duration-300"
            />
          </motion.div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800 mt-2">Agregar Producto</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-2">
            {['id', 'producto', 'cantidad', 'precio'].map((field, i) => (
              <motion.div
                key={field}
                className="relative"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.1, duration: 0.4 }}
              >
                <input
                  name={field}
                  type={field === 'cantidad' || field === 'precio' ? 'number' : 'text'}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  value={productoTemp[field]}
                  onChange={handleProductoChange}
                  className="w-full px-4 py-2 rounded-xl bg-gradient-to-r from-white to-red-50 border border-red-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-400 transition-all duration-300"
                />
              </motion.div>
            ))}
          </div>
          <Button
            type="button"
            onClick={agregarProducto}
            className="mt-3 bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white font-semibold rounded-full px-6 py-2 shadow transition-all duration-300"
          >
            + Agregar Producto
          </Button>
        </div>

        {productosVenta.length > 0 && (
          <motion.div
            className="bg-white mt-6 border border-red-100 p-4 rounded-xl shadow-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <ul className="space-y-3 text-sm">
              {productosVenta.map((p, i) => (
                <motion.li
                  key={i}
                  className="flex justify-between items-center p-3 rounded-lg bg-gradient-to-r from-red-100 to-red-50 hover:shadow-lg transition-all duration-300"
                  whileHover={{ scale: 1.01 }}
                >
                  <span>{p.producto} x {p.cantidad} = ${p.subtotal.toFixed(2)}</span>
                  <Button type="button" size="sm" variant="destructive" onClick={() => eliminarProductoDeLista(i)}>
                    <FaTrash />
                  </Button>
                </motion.li>
              ))}
            </ul>
            <div className="text-right text-sm mt-4">
              <p><strong>Total productos:</strong> {totalProductos}</p>
              <p><strong>Total a pagar:</strong> ${totalDinero.toFixed(2)}</p>
            </div>
          </motion.div>
        )}

        <Button
          type="submit"
          className="w-full mt-6 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white font-bold py-3 rounded-full shadow-lg transition-all duration-300"
        >
          ✅ Confirmar Venta
        </Button>
      </motion.form>
    </motion.div>
  );
}