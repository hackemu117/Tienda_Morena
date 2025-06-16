import React, { useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Card, CardContent, CardHeader } from '../components/ui/card';
import logo from '../assets/logo.png';
import { motion, AnimatePresence } from 'framer-motion';

export default function ReportesPage() {
  const [fechaSeleccionada, setFechaSeleccionada] = useState('2025-06-14');
  const [mensaje, setMensaje] = useState('');

  const ventasDelDia = [
    {
      id: 'V-101', vendedor: 'USR-001',
      productos: [
        { id: 'P-001', producto: 'Arroz', cantidad: 2, precio: 30.0 },
        { id: 'P-002', producto: 'Frijol', cantidad: 1, precio: 34.0 }
      ], total: 94.0, hora: '09:30', fecha: '2025-06-14'
    },
    {
      id: 'V-102', vendedor: 'USR-002',
      productos: [
        { id: 'P-003', producto: 'Aceite', cantidad: 1, precio: 50.0 }
      ], total: 50.0, hora: '10:15', fecha: '2025-06-14'
    },
    {
      id: 'V-103', vendedor: 'USR-003',
      productos: [
        { id: 'P-004', producto: 'Azúcar', cantidad: 5, precio: 18.0 },
        { id: 'P-005', producto: 'Sal', cantidad: 2, precio: 10.0 },
        { id: 'P-006', producto: 'Pasta', cantidad: 3, precio: 12.0 }
      ], total: 90.0, hora: '12:00', fecha: '2025-06-14'
    },
    {
      id: 'V-104', vendedor: 'USR-004',
      productos: [
        { id: 'P-007', producto: 'Harina', cantidad: 4, precio: 20.0 },
        { id: 'P-008', producto: 'Leche', cantidad: 2, precio: 22.5 }
      ], total: 125.0, hora: '13:45', fecha: '2025-06-14'
    },
    {
      id: 'V-105', vendedor: 'USR-005',
      productos: [
        { id: 'P-009', producto: 'Café', cantidad: 2, precio: 45.0 },
        { id: 'P-010', producto: 'Pan', cantidad: 6, precio: 7.0 }
      ], total: 132.0, hora: '14:30', fecha: '2025-06-14'
    },
    {
      id: 'V-106', vendedor: 'USR-006',
      productos: [
        { id: 'P-011', producto: 'Huevos', cantidad: 1, precio: 40.0 },
        { id: 'P-012', producto: 'Jamón', cantidad: 1, precio: 60.0 }
      ], total: 100.0, hora: '15:00', fecha: '2025-06-14'
    },
    {
      id: 'V-107', vendedor: 'USR-007',
      productos: [
        { id: 'P-013', producto: 'Queso', cantidad: 2, precio: 55.0 }
      ], total: 110.0, hora: '15:45', fecha: '2025-06-14'
    },
    {
      id: 'V-108', vendedor: 'USR-008',
      productos: [
        { id: 'P-014', producto: 'Refresco', cantidad: 3, precio: 15.0 }
      ], total: 45.0, hora: '16:20', fecha: '2025-06-14'
    },
    {
      id: 'V-109', vendedor: 'USR-009',
      productos: [
        { id: 'P-015', producto: 'Yogur', cantidad: 4, precio: 18.0 }
      ], total: 72.0, hora: '17:00', fecha: '2025-06-14'
    },
    {
      id: 'V-110', vendedor: 'USR-010',
      productos: [
        { id: 'P-016', producto: 'Tortillas', cantidad: 2, precio: 20.0 },
        { id: 'P-017', producto: 'Sopa', cantidad: 1, precio: 10.0 }
      ], total: 50.0, hora: '17:45', fecha: '2025-06-14'
    }
  ];

  const ventasFiltradas = ventasDelDia.filter(v => v.fecha === fechaSeleccionada);

  const mostrarMensaje = (texto) => {
    setMensaje(texto);
    setTimeout(() => setMensaje(''), 3000);
  };

  const exportarPDF = () => {
    const doc = new jsPDF();
    const img = new Image();
    img.src = logo;
    doc.addImage(img, 'PNG', 14, 10, 20, 20);
    doc.setFontSize(18);
    doc.text('Reporte de Ventas del Día', 40, 22);
    doc.setFontSize(10);
    doc.text(`Fecha de generación: ${new Date().toLocaleString()}`, 14, 32);

    let currentY = 40;

    ventasFiltradas.forEach((venta, index) => {
      doc.text(`Venta ID: ${venta.id}`, 14, currentY);
      doc.text(`Vendedor: ${venta.vendedor}`, 14, currentY + 5);
      doc.text(`Hora: ${venta.hora} - Fecha: ${venta.fecha}`, 14, currentY + 10);
      autoTable(doc, {
        startY: currentY + 15,
        head: [['ID Producto', 'Producto', 'Cantidad', 'Precio', 'Subtotal']],
        body: venta.productos.map(p => [p.id, p.producto, p.cantidad, `$${p.precio}`, `$${(p.precio * p.cantidad).toFixed(2)}`]),
        styles: { fontSize: 10 },
        theme: 'striped',
        didDrawPage: (data) => {
          currentY = data.cursor.y + 10;
        }
      });
      doc.text(`Total: $${venta.total.toFixed(2)}`, 150, currentY);
      currentY += 20;
    });

    doc.save(`ReporteVentas_${fechaSeleccionada}.pdf`);
    mostrarMensaje('📄 PDF exportado exitosamente');
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
    mostrarMensaje('🧾 PDF exportado con éxito');
  };

  return (
    <motion.div className="px-6 py-6 font-sans w-full max-w-full overflow-visible" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <motion.section className="mb-10" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <h3 className="text-2xl font-bold text-blue-800 mb-3">Corte de Caja</h3>
        <Card className="bg-blue-50">
          <CardHeader className="font-semibold">Resumen Diario</CardHeader>
          <CardContent className="space-y-1">
            <p><strong>ID del Corte:</strong> C-001</p>
            <p><strong>Total ventas:</strong> $3,200.00</p>
            <p><strong>Número de ventas:</strong> 17</p>
            <p><strong>Fecha:</strong> 14/06/2025</p>
            <div className="flex justify-end mt-4">
              <button onClick={exportarCorteCaja} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded shadow-md hover:shadow-lg transition">Exportar Corte PDF</button>
            </div>
          </CardContent>
        </Card>
      </motion.section>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-blue-900">Ventas del Día</h2>
        <div className="flex items-center gap-4">
          <label htmlFor="fecha" className="font-medium">Selecciona una fecha:</label>
          <input type="date" id="fecha" value={fechaSeleccionada} onChange={(e) => setFechaSeleccionada(e.target.value)} className="border border-gray-300 rounded px-3 py-1" />
          <button onClick={exportarPDF} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded shadow-md hover:shadow-lg transition">Exportar Ventas PDF</button>
        </div>
      </div>

      <div className="max-h-[700px] overflow-y-auto space-y-6 px-4">
        {ventasFiltradas.map((venta) => (
          <motion.div key={venta.id} className="bg-white border rounded-xl shadow-md p-4 transform transition-transform duration-300 hover:scale-[1.02]" whileHover={{ scale: 1.02 }}>
            <h3 className="text-lg font-semibold mb-2">Venta {venta.id}</h3>
            <p><strong>Vendedor:</strong> {venta.vendedor}</p>
            <p><strong>Hora:</strong> {venta.hora}</p>
            <p><strong>Fecha:</strong> {venta.fecha}</p>
            <ul className="mt-2 space-y-1">
              {venta.productos.map((p) => (
                <li key={p.id} className="text-sm">
                  <strong>{p.id}</strong> - {p.producto} ({p.cantidad}) - ${p.precio} c/u
                </li>
              ))}
            </ul>
            <p className="mt-2 font-bold">Total: ${venta.total.toFixed(2)}</p>
          </motion.div>
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
