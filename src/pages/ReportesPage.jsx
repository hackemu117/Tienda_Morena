import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import logo from '../assets/logo.png';
import { motion, AnimatePresence } from 'framer-motion';

export default function ReportesPage() {
  const [ventas, setVentas] = useState([]);
  const [fecha, setFecha] = useState(new Date().toISOString().substring(0, 10));
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    fetchVentas();
  }, [fecha]);

  const fetchVentas = async () => {
    try {
      const res = await axios.post('http://localhost:3001/api/reportes/ventas', {
        fecha_desde: fecha,
        fecha_hasta: fecha
      });
      setVentas(res.data.detalles);
    } catch (error) {
      console.error('Error al cargar ventas:', error);
      setVentas([]);
    }
  };

  const mostrarMensaje = (texto) => {
    setMensaje(texto);
    setTimeout(() => setMensaje(''), 3000);
  };

  const exportarPDFVentas = () => {
    const doc = new jsPDF();
    const img = new Image();
    img.src = logo;
    doc.addImage(img, 'PNG', 14, 10, 20, 20);
    doc.setFontSize(18);
    doc.text('Reporte de Ventas del Día', 40, 22);
    doc.setFontSize(10);
    doc.text(`Fecha de generación: ${new Date().toLocaleString()}`, 14, 32);

    let currentY = 40;
    const agrupadas = ventas.reduce((acc, venta) => {
      if (!acc[venta.id_venta]) acc[venta.id_venta] = [];
      acc[venta.id_venta].push(venta);
      return acc;
    }, {});

    Object.entries(agrupadas).forEach(([idVenta, productos]) => {
      const primera = productos[0];
      doc.text(`Venta ID: ${idVenta}`, 14, currentY);
      doc.text(`Cliente: ${primera.nombre_cli || 'N/A'} - Hora: ${new Date(primera.fecha_venta).toLocaleTimeString()}`, 14, currentY + 5);
      autoTable(doc, {
        startY: currentY + 10,
        head: [['Producto', 'Cantidad', 'Precio', 'Subtotal']],
        body: productos.map(p => [
          p.nombre_prod,
          p.cantidad_det,
          `$${p.precio_ven_prod}`,
          `$${(p.cantidad_det * p.precio_ven_prod).toFixed(2)}`
        ]),
        styles: { fontSize: 10 },
        theme: 'striped',
        didDrawPage: (data) => { currentY = data.cursor.y + 10; }
      });
    });

    doc.save(`ReporteVentas_${fecha}.pdf`);
    mostrarMensaje('📄 PDF exportado exitosamente');
  };

  const exportarCorteCaja = () => {
    const totalVentas = ventas.reduce((acc, v) => acc + (v.precio_ven_prod * v.cantidad_det), 0);
    const doc = new jsPDF();
    const img = new Image();
    img.src = logo;
    doc.addImage(img, 'PNG', 14, 10, 20, 20);
    doc.setFontSize(16);
    doc.text('Corte de Caja - Tienda La Moderna', 40, 22);
    doc.setFontSize(10);
    doc.text(`Fecha de generación: ${new Date().toLocaleString()}`, 14, 32);

    autoTable(doc, {
      startY: 40,
      head: [['Campo', 'Valor']],
      body: [
        ['Fecha del corte', fecha],
        ['Total ventas', `$${totalVentas.toFixed(2)}`],
        ['Número de ventas', new Set(ventas.map(v => v.id_venta)).size]
      ],
      headStyles: { fillColor: [0, 64, 128], textColor: 255, halign: 'center' },
      bodyStyles: { halign: 'left', textColor: [50, 50, 50] },
      theme: 'striped'
    });

    doc.save(`CorteCaja_${fecha}.pdf`);
    mostrarMensaje('🧾 PDF exportado con éxito');
  };

  return (
    <motion.div className="px-6 py-6 font-sans w-full max-w-full overflow-visible" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <motion.section className="mb-10" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <h3 className="text-2xl font-bold text-blue-800 mb-3">Corte de Caja</h3>
        <div className="bg-blue-50 border p-4 rounded-xl">
          <p><strong>Fecha del corte:</strong> {fecha}</p>
          <p><strong>Total ventas:</strong> ${ventas.reduce((acc, v) => acc + (v.precio_ven_prod * v.cantidad_det), 0).toFixed(2)}</p>
          <p><strong>Número de ventas:</strong> {new Set(ventas.map(v => v.id_venta)).size}</p>
          <div className="flex justify-end mt-4">
            <button onClick={exportarCorteCaja} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded shadow-md hover:shadow-lg transition">Exportar Corte PDF</button>
          </div>
        </div>
      </motion.section>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-blue-900">Ventas</h2>
        <div className="flex items-center gap-4">
          <label htmlFor="fecha" className="font-medium">Selecciona una fecha:</label>
          <input type="date" id="fecha" value={fecha} onChange={(e) => setFecha(e.target.value)} className="border border-gray-300 rounded px-3 py-1" />
          <button onClick={exportarPDFVentas} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded shadow-md hover:shadow-lg transition">Exportar Ventas PDF</button>
        </div>
      </div>

      <div className="max-h-[700px] overflow-y-auto space-y-6 px-4">
        {ventas.map((venta, idx) => (
          <div key={idx} className="bg-white border rounded-xl shadow-md p-4">
            <p><strong>ID Venta:</strong> {venta.id_venta}</p>
            <p><strong>Producto:</strong> {venta.nombre_prod} - <strong>Cantidad:</strong> {venta.cantidad_det}</p>
            <p><strong>Precio:</strong> ${venta.precio_ven_prod} - <strong>Subtotal:</strong> ${(venta.precio_ven_prod * venta.cantidad_det).toFixed(2)}</p>
            <p><strong>Fecha:</strong> {new Date(venta.fecha_venta).toLocaleString()}</p>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {mensaje && (
          <motion.div className="absolute top-4 right-4 bg-green-100 border border-green-400 text-green-800 px-4 py-2 rounded-xl shadow-md" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
            {mensaje}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
