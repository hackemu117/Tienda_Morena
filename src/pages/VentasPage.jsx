import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import {
  UserIcon,
  ShoppingCartIcon,
  TrashIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';

import {
  CreditCardIcon,
  BanknotesIcon as CashIcon
} from '@heroicons/react/24/solid';

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

  const btnClass = "transition duration-200 ease-in-out transform hover:scale-105";

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
      setCarrito(carrito.map(item =>
        item.id_prod === productoSeleccionado.id_prod
          ? { ...item, cantidad: item.cantidad + cantidad }
          : item
      ));
    } else {
      setCarrito([...carrito, {
        ...productoSeleccionado,
        precio: productoSeleccionado.precio_ven_prod,
        cantidad
      }]);
    }
    setProductoBusqueda('');
    setProductosSugeridos([]);
    setProductoSeleccionado(null);
    setCantidad(1);
  };

  const eliminarDelCarrito = (id) => {
    setCarrito(carrito.filter(item => item.id_prod !== id));
  };

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
      doc.text(`Método de Pago: ${venta.metodo_pago_venta}`, 10, 85);

      autoTable(doc, {
        startY: 100,
        head: [['Cant', 'Producto', 'Precio', 'Subt.']],
        body: productos.map(p => [
          p.cantidad_det,
          p.nombre_prod,
          `$${p.precio_ven_prod.toFixed(2)}`,
          `$${(p.cantidad_det * p.precio_ven_prod).toFixed(2)}`
        ]),
        theme: 'plain',
        styles: { fontSize: 8, cellPadding: 2 },
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
      const verificacion = await axios.post('http://localhost:3001/api/ventas/verificar-total', {
        items,
        total_frontend: totalFinal
      });
      if (verificacion.data.status !== 'success')
        return alert(`Error: ${verificacion.data.mensaje}`);

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

  const calcularTotal = () => carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0).toFixed(2);

  return (
    <div className="max-w-5xl mx-auto p-8 bg-gradient-to-br from-rose-100 to-white shadow-xl rounded-lg mt-8 border border-rose-200">
      <h2 className="text-3xl font-extrabold text-red-600 mb-6 text-center">
        Nueva Venta <ShoppingCartIcon className="inline-block h-8 w-8 text-red-400 animate-pulse" />
      </h2>

      {/* Cliente y Método de Pago */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-sm font-semibold mb-1 text-red-800">Cliente</label>
          <div className="flex items-center space-x-2">
            <UserIcon className="h-5 w-5 text-red-400" />
            <input
              type="text"
              className="flex-1 border rounded px-3 py-2 shadow-sm focus:ring-2 focus:ring-rose-400 focus:border-transparent transition"
              placeholder="Buscar cliente..."
              value={clienteBusqueda}
              onChange={e => {
                setClienteBusqueda(e.target.value);
                setClienteSeleccionado(null);
              }}
            />
          </div>
          {clientesSugeridos.length > 0 && (
            <ul className="bg-white border mt-2 rounded shadow max-h-40 overflow-y-auto">
              {clientesSugeridos.map(c => (
                <li key={c.id_cli} className="px-4 py-2 hover:bg-rose-100 cursor-pointer"
                  onClick={() => {
                    setClienteSeleccionado(c);
                    setClienteBusqueda(`${c.id_cli} - ${c.nombre_cli}`);
                    setClientesSugeridos([]);
                  }}>
                  {c.id_cli} - {c.nombre_cli}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1 text-red-800">Método de Pago</label>
          <div className="flex space-x-4 mt-1">
            <button
              className={`${btnClass} flex items-center space-x-1 px-4 py-2 rounded shadow border 
              ${metodoPago === 'EFECTIVO'
                  ? 'bg-red-200 text-red-800 border-red-400'
                  : 'bg-gray-100 text-gray-600 border-gray-300'}`}
              onClick={() => setMetodoPago('EFECTIVO')}
            >
              <CashIcon className="h-5 w-5" /><span>Efectivo</span>
            </button>

            <button
              className={`${btnClass} flex items-center space-x-1 px-4 py-2 rounded shadow border 
              ${metodoPago === 'TARJETA'
                  ? 'bg-red-200 text-red-800 border-red-400'
                  : 'bg-gray-100 text-gray-600 border-gray-300'}`}
              onClick={() => setMetodoPago('TARJETA')}
            >
              <CreditCardIcon className="h-5 w-5" /><span>Tarjeta</span>
            </button>
          </div>
        </div>
      </div>

      {/* Producto */}
      <div className="mb-8">
        <label className="block text-sm font-semibold mb-1 text-red-800">Producto</label>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            className="flex-1 border rounded px-3 py-2 shadow-sm focus:ring-2 focus:ring-rose-400 transition"
            placeholder="Buscar producto..."
            value={productoBusqueda}
            onChange={e => {
              setProductoBusqueda(e.target.value);
              setProductoSeleccionado(null);
            }}
          />
          <input
            type="number"
            min={1}
            className="w-24 border rounded px-2 py-2 text-center"
            value={cantidad}
            onChange={e => setCantidad(Number(e.target.value) || 1)}
          />
          {productoSeleccionado && (
            <div className="text-sm font-semibold text-red-700">
              Subtotal: ${(productoSeleccionado.precio_ven_prod * cantidad).toFixed(2)}
            </div>
          )}
          <button
            className={`${btnClass} bg-red-500 text-white px-4 py-2 rounded flex items-center shadow`}
            onClick={agregarAlCarrito}
          >
            <PlusIcon className="h-5 w-5 mr-1" />
            Agregar
          </button>
        </div>
        {productosSugeridos.length > 0 && (
          <ul className="bg-white border mt-2 rounded shadow max-h-40 overflow-y-auto">
            {productosSugeridos.map(p => (
              <li key={p.id_prod}
                className="px-4 py-2 hover:bg-rose-100 cursor-pointer"
                onClick={() => {
                  setProductoSeleccionado(p);
                  setProductoBusqueda(p.nombre_prod);
                  setProductosSugeridos([]);
                }}>
                {p.id_prod} - {p.nombre_prod}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Carrito y total */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-red-700 mb-2">Carrito</h3>
        <table className="min-w-full bg-white border rounded shadow-sm">
          <thead className="bg-rose-100">
            <tr>
              <th className="px-4 py-2">Producto</th>
              <th className="px-4 py-2">Cantidad</th>
              <th className="px-4 py-2">Precio</th>
              <th className="px-4 py-2">Subtotal</th>
              <th className="px-4 py-2">Eliminar</th>
            </tr>
          </thead>
          <tbody>
            {carrito.map((item, i) => (
              <tr key={i} className="text-center">
                <td className="px-4 py-2">{item.nombre_prod}</td>
                <td className="px-4 py-2">{item.cantidad}</td>
                <td className="px-4 py-2">${item.precio}</td>
                <td className="px-4 py-2">${(item.precio * item.cantidad).toFixed(2)}</td>
                <td className="px-4 py-2">
                  <button
                    className="text-red-500 hover:text-red-700 transition"
                    onClick={() => eliminarDelCarrito(item.id_prod)}
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
            {carrito.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center text-gray-400 py-4">No hay productos agregados.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-6">
        <h3 className="text-xl font-semibold text-red-700">Total: ${calcularTotal()}</h3>
        <button
          className={`${btnClass} bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded font-bold shadow`}
          onClick={procesarVenta}
        >
          Confirmar Venta
        </button>
      </div>

      {mensaje && (
        <div className="mt-4 p-4 bg-rose-100 border border-rose-300 text-red-800 rounded">
          {mensaje}
        </div>
      )}
    </div>
  );
}