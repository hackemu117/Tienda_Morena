import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function ReportesVentasPage() {
  const [ventas, setVentas] = useState([]);
  const [totalVentas, setTotalVentas] = useState(0);
  const [totalProductos, setTotalProductos] = useState(0);
  const [gananciaTotal, setGananciaTotal] = useState(0);
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    const hoy = new Date();
    const hace7dias = new Date();
    hace7dias.setDate(hoy.getDate() - 7);
    const format = (date) => date.toISOString().split('T')[0];
    setFechaDesde(format(hace7dias));
    setFechaHasta(format(hoy));
    fetchVentas(format(hace7dias), format(hoy));
  }, []);

  const fetchVentas = async (desde, hasta) => {
    setCargando(true);
    setError('');
    try {
      const res = await axios.post('http://localhost:3001/api/reportes/ventas', {
        fecha_desde: desde,
        fecha_hasta: hasta,
      });

      const ventasData = res.data.ventas || [];
      setVentas(ventasData);
      setTotalVentas(res.data.total_ventas || 0);
      setTotalProductos(res.data.total_productos || 0);
      setGananciaTotal(res.data.ganancia_total || 0);
    } catch (err) {
      console.error('Error al obtener ventas:', err);
      setError('Error al cargar los datos de ventas.');
    } finally {
      setCargando(false);
    }
  };

  const ventasFiltradas = ventas.filter(v =>
    v.id_venta.toString().includes(busqueda.trim()) ||
    (v.nombre_cliente || '').toLowerCase().includes(busqueda.trim().toLowerCase())
  );

  const exportarPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('REPORTE DE VENTAS', 105, 20, null, null, 'center');

    autoTable(doc, {
      startY: 30,
      head: [['ID', 'Fecha', 'Cliente', 'Pago', 'Total', 'Productos', 'Ganancia']],
      body: ventasFiltradas.map(v => [
        v.id_venta,
        new Date(v.fecha_venta).toLocaleDateString(),
        v.nombre_cliente || 'Público en general',
        v.metodo_pago_venta,
        `$${parseFloat(v.total_venta).toFixed(2)}`,
        v.total_productos,
        `$${parseFloat(v.ganancia_venta).toFixed(2)}`
      ]),
      styles: { halign: 'center' },
      headStyles: { fillColor: [220, 53, 69] },
      theme: 'striped'
    });

    const resumenY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(12);
    doc.text(`Total en Ventas: $${totalVentas.toFixed(2)}`, 14, resumenY);
    doc.text(`Ganancia Total: $${gananciaTotal.toFixed(2)}`, 14, resumenY + 7);

    doc.save('reporte_ventas.pdf');
  };

  const imprimirTicket = async () => {
    const idVenta = busqueda.trim();
    if (!idVenta) return alert('Ingresa un ID de venta válido');

    try {
      const res = await axios.get(`http://localhost:3001/api/reportes/ticket/${idVenta}`);
      const venta = res.data.venta;
      const productos = res.data.productos;

      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text('Tienda La Moderna', 105, 15, null, null, 'center');
      doc.setFontSize(12);
      doc.text('Ticket de Venta', 105, 23, null, null, 'center');

      doc.setFontSize(10);
      doc.text(`Folio: ${venta.id_venta}`, 14, 35);
      doc.text(`Fecha: ${new Date(venta.fecha_venta).toLocaleString()}`, 14, 42);
      doc.text(`Cliente: ${venta.nombre_cliente || 'Público en general'}`, 14, 49);
      doc.text(`Método de Pago: ${venta.metodo_pago_venta}`, 14, 56);

      autoTable(doc, {
        startY: 65,
        head: [['Producto', 'Cantidad', 'Precio', 'Subtotal']],
        body: productos.map(p => [
          p.nombre_prod,
          p.cantidad_det,
          `$${parseFloat(p.precio_ven_prod).toFixed(2)}`,
          `$${(p.cantidad_det * p.precio_ven_prod).toFixed(2)}`
        ]),
        styles: { fontSize: 10, halign: 'center' },
        headStyles: { fillColor: [40, 167, 69] },
        theme: 'striped'
      });

      const totalY = doc.lastAutoTable.finalY + 10;
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.text(`Total: $${parseFloat(venta.total_venta).toFixed(2)}`, 14, totalY);

      doc.save(`ticket_venta_${venta.id_venta}.pdf`);
    } catch (err) {
      console.error(err);
      alert('No se pudo generar el ticket.');
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto px-6 py-8 font-inter"
    >
      <h2 className="text-3xl font-bold text-red-700 mb-6">Reporte de Ventas</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 300 }}
          className="bg-white shadow rounded-xl border-l-8 border-red-500 p-5 cursor-pointer"
        >
          <p className="text-red-700 font-semibold">Total en Ventas</p>
          <h3 className="text-2xl font-bold text-red-700">${totalVentas.toFixed(2)}</h3>
          <p className="text-sm text-gray-500 mt-1">{ventas.length} transacciones</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 300 }}
          className="bg-white shadow rounded-xl border-l-8 border-green-500 p-5 cursor-pointer"
        >
          <p className="text-green-700 font-semibold">Productos Vendidos</p>
          <h3 className="text-2xl font-bold text-green-700">{totalProductos}</h3>
          <p className="text-sm text-gray-500 mt-1">Del {fechaDesde} al {fechaHasta}</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 300 }}
          className="bg-white shadow rounded-xl border-l-8 border-blue-500 p-5 cursor-pointer"
        >
          <p className="text-blue-700 font-semibold">Ganancia Total</p>
          <h3 className="text-2xl font-bold text-blue-700">${gananciaTotal.toFixed(2)}</h3>
          <p className="text-sm text-gray-500 mt-1">Según la vista SQL</p>
        </motion.div>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <input type="date" value={fechaDesde} onChange={e => setFechaDesde(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg" />
        <input type="date" value={fechaHasta} onChange={e => setFechaHasta(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg" />
        <button onClick={() => fetchVentas(fechaDesde, fechaHasta)} className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Buscar</button>
        <button onClick={exportarPDF} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Exportar PDF</button>
        <input type="text" value={busqueda} onChange={e => setBusqueda(e.target.value)} placeholder="Buscar ID o cliente" className="px-4 py-2 border border-gray-400 rounded-lg w-64" />
        <button onClick={imprimirTicket} className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Imprimir Ticket</button>
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}
      {cargando && <p className="text-gray-500 mb-4">Cargando ventas...</p>}

      <div className="overflow-x-auto bg-white rounded-xl shadow border border-red-200 max-h-80 overflow-y-auto">
        <table className="min-w-full text-sm text-gray-700">
          <thead className="bg-red-200 text-red-800 text-left sticky top-0 z-10">
            <tr>
              <th className="px-4 py-3">ID Venta</th>
              <th className="px-4 py-3">Fecha</th>
              <th className="px-4 py-3">Cliente</th>
              <th className="px-4 py-3">Pago</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Productos</th>
              <th className="px-4 py-3">Ganancia</th>
            </tr>
          </thead>
          <tbody>
            {ventasFiltradas.map((v, i) => (
              <tr key={i} className="border-t border-red-100 hover:bg-red-50">
                <td className="px-4 py-2">{v.id_venta}</td>
                <td className="px-4 py-2">{new Date(v.fecha_venta).toLocaleDateString()}</td>
                <td className="px-4 py-2">{v.nombre_cliente || 'Público en general'}</td>
                <td className="px-4 py-2">{v.metodo_pago_venta}</td>
                <td className="px-4 py-2">${parseFloat(v.total_venta).toFixed(2)}</td>
                <td className="px-4 py-2">{v.total_productos}</td>
                <td className="px-4 py-2">${parseFloat(v.ganancia_venta).toFixed(2)}</td>
              </tr>
            ))}
            {ventasFiltradas.length === 0 && !cargando && (
              <tr>
                <td colSpan="7" className="px-4 py-4 text-center text-gray-400">No hay resultados</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.section>
  );
}
