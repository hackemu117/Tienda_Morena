import React, { useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Card, CardContent, CardHeader } from '../components/ui/card';
import logo from '../assets/logo.png';
import { motion } from 'framer-motion';

export default function ReportesPage() {
  const [fechaSeleccionada, setFechaSeleccionada] = useState('2025-06-14');

  const ventasDelDia = [
    { id: 'V-101', producto: 'Arroz', cantidad: 3, total: 90.0, hora: '09:30', fecha: '2025-06-14' },
    { id: 'V-102', producto: 'Aceite', cantidad: 1, total: 50.0, hora: '10:15', fecha: '2025-06-14' },
    { id: 'V-103', producto: 'Frijol', cantidad: 2, total: 68.0, hora: '11:00', fecha: '2025-06-14' }
  ];

  const ventasFiltradas = ventasDelDia.filter(v => v.fecha === fechaSeleccionada);

  const exportarPDF = () => {
    const doc = new jsPDF();
    const img = new Image();
    img.src = logo;
    doc.addImage(img, 'PNG', 14, 10, 20, 20);
    doc.setFontSize(18);
    doc.text('Reporte de Ventas del Día', 40, 22);
    doc.setFontSize(10);
    doc.text(`Fecha de generación: ${new Date().toLocaleString()}`, 14, 32);

    autoTable(doc, {
      startY: 38,
      head: [['ID Venta', 'Producto', 'Cantidad', 'Total', 'Hora', 'Fecha']],
      body: ventasFiltradas.map((v) => [v.id, v.producto, v.cantidad, `$${v.total.toFixed(2)}`, v.hora, v.fecha]),
      styles: { fontSize: 10 },
      headStyles: { fillColor: [0, 64, 128], textColor: 255 },
    });

    doc.save(`ReporteVentas_${fechaSeleccionada}.pdf`);
  };

  const exportarCorteCaja = () => {
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
        ['ID del Corte', 'C-001'],
        ['Total ventas', '$3,200.00'],
        ['Número de ventas', '17'],
        ['Fecha del corte', '14/06/2025']
      ],
      headStyles: { fillColor: [0, 64, 128], textColor: 255, halign: 'center' },
      bodyStyles: { halign: 'left', textColor: [50, 50, 50] },
      theme: 'striped'
    });

    doc.save('CorteCaja_2025-06-14.pdf');
  };

  return (
    <motion.div
      className="p-6 font-sans max-w-5xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h2 className="text-2xl font-bold text-blue-900 mb-6" initial={{ y: -20 }} animate={{ y: 0 }} transition={{ duration: 0.4 }}>Reportes de Ventas</motion.h2>

      <motion.section className="mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <h3 className="text-lg font-semibold text-blue-800 mb-3">📅 Corte de Caja</h3>
        <Card className="bg-blue-50">
          <CardHeader className="font-semibold">Resumen Diario</CardHeader>
          <CardContent className="space-y-1">
            <p><strong>ID del Corte:</strong> C-001</p>
            <p><strong>Total ventas:</strong> $3,200.00</p>
            <p><strong>Número de ventas:</strong> 17</p>
            <p><strong>Fecha:</strong> 14/06/2025</p>
            <div className="flex justify-end mt-4">
              <button
                onClick={exportarCorteCaja}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
              >
                Exportar Corte PDF
              </button>
            </div>
          </CardContent>
        </Card>
      </motion.section>

      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <h3 className="text-lg font-semibold text-blue-800 mb-3">🧾 Ventas del Día</h3>

        <div className="mb-4 flex items-center gap-4">
          <label htmlFor="fecha" className="font-medium">Selecciona una fecha:</label>
          <input
            type="date"
            id="fecha"
            value={fechaSeleccionada}
            onChange={(e) => setFechaSeleccionada(e.target.value)}
            className="border border-gray-300 rounded px-3 py-1"
          />
        </div>

        <button
          onClick={exportarPDF}
          className="mb-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
        >
          Exportar Ventas PDF
        </button>

        {ventasFiltradas.length > 0 ? (
          <motion.table
            className="w-full bg-white shadow-sm border rounded"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <thead className="bg-blue-900 text-white">
              <tr>
                <th className="px-4 py-2">ID Venta</th>
                <th className="px-4 py-2">Producto</th>
                <th className="px-4 py-2">Cantidad</th>
                <th className="px-4 py-2">Total</th>
                <th className="px-4 py-2">Hora</th>
                <th className="px-4 py-2">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {ventasFiltradas.map((venta) => (
                <tr key={venta.id} className="text-center border-t">
                  <td className="px-4 py-2">{venta.id}</td>
                  <td className="px-4 py-2">{venta.producto}</td>
                  <td className="px-4 py-2">{venta.cantidad}</td>
                  <td className="px-4 py-2">${venta.total.toFixed(2)}</td>
                  <td className="px-4 py-2">{venta.hora}</td>
                  <td className="px-4 py-2">{venta.fecha}</td>
                </tr>
              ))}
            </tbody>
          </motion.table>
        ) : (
          <motion.p className="mt-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>No hay ventas registradas en esta fecha.</motion.p>
        )}
      </motion.section>
    </motion.div>
  );
}

