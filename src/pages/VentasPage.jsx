import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { motion } from 'framer-motion';

export default function VentasPage() {
  const [productoBusqueda, setProductoBusqueda] = useState('');
  const [productosSugeridos, setProductosSugeridos] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [carrito, setCarrito] = useState([]);

  const [clienteBusqueda, setClienteBusqueda] = useState('');
  const [clientesSugeridos, setClientesSugeridos] = useState([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);

  const [metodoPago, setMetodoPago] = useState('EFECTIVO');
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    if (clienteBusqueda.trim() === '') return setClientesSugeridos([]);
    const timer = setTimeout(() => {
      axios.get(`http://localhost:3001/api/ventas/clientes/buscar?q=${clienteBusqueda}`)
        .then(res => setClientesSugeridos(res.data))
        .catch(console.error);
    }, 300);
    return () => clearTimeout(timer);
  }, [clienteBusqueda]);

  useEffect(() => {
    if (productoBusqueda.trim() === '') {
      setProductosSugeridos([]);
      setProductoSeleccionado(null);
      return;
    }
    const timer = setTimeout(() => {
      axios.get(`http://localhost:3001/api/ventas/productos/buscar?q=${productoBusqueda}`)
        .then(res => setProductosSugeridos(res.data))
        .catch(console.error);
    }, 300);
    return () => clearTimeout(timer);
  }, [productoBusqueda]);

  const agregarAlCarrito = () => {
    if (!productoSeleccionado || cantidad <= 0) return alert('Seleccione un producto válido');
    const existe = carrito.find(item => item.id_prod === productoSeleccionado.id_prod);
    if (existe) {
      setCarrito(carrito.map(item => item.id_prod === productoSeleccionado.id_prod ? { ...item, cantidad: item.cantidad + cantidad } : item));
    } else {
      setCarrito([...carrito, { ...productoSeleccionado, precio: productoSeleccionado.precio_ven_prod, cantidad }]);
    }
    setProductoBusqueda('');
    setProductosSugeridos([]);
    setProductoSeleccionado(null);
    setCantidad(1);
  };

  const eliminarDelCarrito = (id) => setCarrito(carrito.filter(item => item.id_prod !== id));

  const generarTicketPDF = async (idVenta) => {
    try {
      const res = await axios.get(`http://localhost:3001/api/reportes/ticket/${idVenta}`);
      const venta = res.data.venta;
      const productos = res.data.productos;

      const doc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: [227, 400] });
      doc.setFontSize(12);
      doc.text('Tienda La Moderna', doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });
      doc.setFontSize(9);
      doc.text('Ticket de Venta', doc.internal.pageSize.getWidth() / 2, 35, { align: 'center' });
      doc.setFontSize(8);
      doc.text(`Folio: ${venta.id_venta}`, 10, 55);
      doc.text(`Fecha: ${new Date(venta.fecha_venta).toLocaleString('es-MX')}`, 10, 65);
      doc.text(`Cliente: ${venta.nombre_cliente || 'Público en General'}`, 10, 75);

      autoTable(doc, {
        startY: 85,
        head: [['Cant', 'Producto', 'Precio', 'Subt.']],
        body: productos.map(p => [p.cantidad_det, p.nombre_prod, `$${p.precio_ven_prod.toFixed(2)}`, `$${(p.cantidad_det * p.precio_ven_prod).toFixed(2)}`]),
        theme: 'plain', styles: { fontSize: 8, cellPadding: 2 },
        headStyles: { fontStyle: 'bold', halign: 'center' },
        columnStyles: { 0: { halign: 'center' }, 2: { halign: 'right' }, 3: { halign: 'right' } }
      });

      const finalY = doc.lastAutoTable.finalY + 15;
      doc.setFontSize(10);
      doc.setFont(undefined, 'bold');
      doc.text(`Total: $${venta.total_venta.toFixed(2)}`, doc.internal.pageSize.getWidth() - 10, finalY, { align: 'right' });
      doc.save(`ticket_venta_${venta.id_venta}.pdf`);
    } catch (err) {
      console.error(err);
      alert('Venta registrada, pero no se pudo generar el ticket PDF.');
    }
  };

  const procesarVenta = async () => {
    if (carrito.length === 0) return alert('El carrito está vacío');
    const items = carrito.map(({ id_prod, cantidad }) => ({ id_prod, cantidad }));
    const totalVenta = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
    const totalFinal = parseFloat(totalVenta.toFixed(2));

    try {
      const verificacion = await axios.post('http://localhost:3001/api/ventas/verificar-total', { items, total_frontend: totalFinal });
      if (verificacion.data.status !== 'success') return alert(`Error: ${verificacion.data.mensaje}`);
      const confirmacion = window.confirm(`Total validado: $${verificacion.data.total_real}\n¿Confirmar venta?`);
      if (!confirmacion) return;

      const crear = await axios.post('http://localhost:3001/api/ventas/crear', {
        id_cli_venta: clienteSeleccionado ? clienteSeleccionado.id_cli : null,
        metodo_pago_venta: metodoPago,
        items,
        total_venta: totalFinal
      });

      if (crear.data.status === 'success') {
        const idNuevaVenta = crear.data.id_venta;
        setMensaje(`Venta ${idNuevaVenta} registrada. Generando ticket...`);
        await generarTicketPDF(idNuevaVenta);
        setCarrito([]);
        setClienteBusqueda('');
        setClienteSeleccionado(null);
        setProductoBusqueda('');
        setProductoSeleccionado(null);
        setProductosSugeridos([]);
        setCantidad(1);
      } else {
        alert(`Error al registrar la venta: ${crear.data.mensaje}`);
      }
    } catch (err) {
      console.error('Error al procesar la venta:', err);
      alert(err.response?.data?.mensaje || 'Ocurrió un error al procesar la venta.');
    }
  };

  const subtotalTemporal = productoSeleccionado ? productoSeleccionado.precio_ven_prod * cantidad : 0;

  return (
    <motion.div
      className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-xl mt-10"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-3xl font-bold text-center mb-6 text-red-700">Nueva Venta</h2>

      {/* Cliente y Pago */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="relative">
          <label className="block text-sm font-semibold mb-1">Buscar Cliente</label>
          <input
            value={clienteBusqueda}
            onChange={e => { setClienteBusqueda(e.target.value); setClienteSeleccionado(null); }}
            className="w-full border px-4 py-2 rounded focus:outline-red-500"
            placeholder="Nombre o ID"
          />
          {clientesSugeridos.length > 0 && (
            <ul className="absolute z-20 w-full bg-white border rounded shadow mt-1 max-h-48 overflow-y-auto">
              {clientesSugeridos.map(c => (
                <li key={c.id_cli} className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setClienteSeleccionado(c);
                    setClienteBusqueda(`${c.id_cli} - ${c.nombre_cli}`);
                    setClientesSugeridos([]);
                  }}>{c.id_cli} - {c.nombre_cli}</li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Método de Pago</label>
          <select value={metodoPago} onChange={e => setMetodoPago(e.target.value)}
            className="w-full border px-4 py-2 rounded">
            <option value="EFECTIVO">EFECTIVO</option>
            <option value="TARJETA">TARJETA</option>
          </select>
        </div>
      </div>

      {/* Producto */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6 p-4 border rounded-lg bg-gray-50">
        <div className="md:col-span-3 relative">
          <label className="block text-sm font-semibold mb-1">Buscar Producto</label>
          <input
            value={productoBusqueda}
            onChange={e => { setProductoBusqueda(e.target.value); setProductoSeleccionado(null); }}
            className="w-full border px-4 py-2 rounded"
            placeholder="Nombre o ID"
          />
          {productosSugeridos.length > 0 && (
            <ul className="absolute z-10 w-full bg-white border rounded shadow mt-1 max-h-48 overflow-y-auto">
              {productosSugeridos.map(p => (
                <li key={p.id_prod} className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setProductoSeleccionado(p);
                    setProductoBusqueda(p.nombre_prod);
                    setProductosSugeridos([]);
                  }}>{p.id_prod} - {p.nombre_prod}</li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Cantidad</label>
          <input type="number" min="1" value={cantidad} disabled={!productoSeleccionado}
            onChange={e => setCantidad(Number(e.target.value) || 1)}
            className="w-full border px-4 py-2 rounded" />
        </div>
        <div className="flex flex-col justify-center items-center">
          <span className="text-sm font-medium text-gray-600">Subtotal</span>
          <span className="text-lg font-bold text-blue-600">${subtotalTemporal.toFixed(2)}</span>
        </div>
        <div className="flex items-end">
          <button
            onClick={agregarAlCarrito}
            disabled={!productoSeleccionado || cantidad <= 0}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
          >Agregar</button>
        </div>
      </div>

      {/* Carrito */}
      {carrito.length > 0 && (
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-sm border rounded shadow">
            <thead className="bg-red-100">
              <tr>
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Nombre</th>
                <th className="px-4 py-2">Precio</th>
                <th className="px-4 py-2">Cantidad</th>
                <th className="px-4 py-2">Subtotal</th>
                <th className="px-4 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {carrito.map(item => (
                <tr key={item.id_prod}>
                  <td className="px-4 py-2">{item.id_prod}</td>
                  <td className="px-4 py-2">{item.nombre}</td>
                  <td className="px-4 py-2">${item.precio.toFixed(2)}</td>
                  <td className="px-4 py-2">{item.cantidad}</td>
                  <td className="px-4 py-2">${(item.precio * item.cantidad).toFixed(2)}</td>
                  <td className="px-4 py-2">
                    <button onClick={() => eliminarDelCarrito(item.id_prod)} className="text-red-600 hover:underline">Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Total y botón */}
      <div className="flex justify-between items-center mt-8">
        <h3 className="text-xl font-semibold text-gray-700">Total: ${carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0).toFixed(2)}</h3>
        <button
          onClick={procesarVenta}
          disabled={carrito.length === 0}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
        >Registrar Venta</button>
      </div>

      {mensaje && (
        <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          {mensaje}
        </div>
      )}
    </motion.div>
  );
}
