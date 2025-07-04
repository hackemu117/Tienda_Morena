import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { motion } from 'framer-motion';

export default function ReporteCortesPage() {
  const [cortes, setCortes] = useState([]);
  const [totalCortes, setTotalCortes] = useState(0);
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [orden, setOrden] = useState({ campo: 'fecha_corte', asc: false });

  useEffect(() => {
    const hoy = new Date();
    const hace7dias = new Date();
    hace7dias.setDate(hoy.getDate() - 7);
    const format = (d) => d.toISOString().split('T')[0];

    setFechaDesde(format(hace7dias));
    setFechaHasta(format(hoy));
    fetchCortesCompleto(hace7dias, hoy);
  }, []);

  const fetchCortesCompleto = async (desdeDateObj, hastaDateObj) => {
    setCargando(true);
    setError('');

    try {
      const desdeISO = desdeDateObj.toISOString().split('T')[0];
      const hastaFinDia = new Date(hastaDateObj);
      hastaFinDia.setHours(23, 59, 59, 999);
      const hastaISO = hastaFinDia.toISOString().split('T')[0];

      const res = await axios.post('http://localhost:3001/api/reportes/cortes', {
        fecha_desde: desdeISO,
        fecha_hasta: hastaISO,
      });

      setCortes(res.data.cortes || []);
      setTotalCortes(res.data.total_cortes || 0);
    } catch (err) {
      console.error(err);
      setError('Error al cargar los cortes.');
    } finally {
      setCargando(false);
    }
  };

  const exportarPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text('Reporte de Cortes de Caja', 14, 20);

    autoTable(doc, {
      startY: 30,
      head: [['ID Corte', 'Nombre', 'Fecha', 'Monto']],
      body: cortesFiltrados.map(c => {
        const fechaFormateada = new Date(new Date(c.fecha_corte).getTime() + 6 * 60 * 60 * 1000)
          .toLocaleString('es-MX', {
            timeZone: 'America/Mexico_City',
            hour12: false,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
          });
        return [
          c.id_corte,
          c.nombre_corte,
          fechaFormateada,
          `$${parseFloat(c.monto_corte).toFixed(2)}`
        ];
      }),
    });

    const resumenY = doc.lastAutoTable.finalY + 10;
    doc.text(`Total en Cortes: $${totalCortes.toFixed(2)}`, 14, resumenY);
    doc.save('reporte_cortes.pdf');
  };

  const cortesFiltrados = cortes
    .filter(c =>
      c.id_corte.toString().includes(busqueda) ||
      c.nombre_corte.toLowerCase().includes(busqueda.toLowerCase())
    )
    .sort((a, b) => {
      const campo = orden.campo;
      const valA = a[campo];
      const valB = b[campo];
      if (campo === 'fecha_corte') {
        return orden.asc
          ? new Date(valA) - new Date(valB)
          : new Date(valB) - new Date(valA);
      }
      return orden.asc ? valA - valB : valB - valA;
    });

  const toggleOrden = (campo) => {
    setOrden(prev => ({
      campo,
      asc: prev.campo === campo ? !prev.asc : true
    }));
  };

  const generarCorte = async () => {
    const nombre = prompt('Ingresa tu nombre para registrar el corte:');
    if (!nombre) return alert('Nombre requerido.');

    const confirmar = confirm(`¿Deseas realizar el corte con el nombre "${nombre}"?`);
    if (!confirmar) return;

    try {
      const res = await axios.post('http://localhost:3001/api/reportes/realizar-corte', {
        nombre_corte: nombre
      });

      const datos = res.data.datos;
      alert(`✅ Corte realizado por ${datos.responsable}\nMonto: $${parseFloat(datos.monto).toFixed(2)}`);
      const desdeDate = new Date(fechaDesde);
      const hastaDate = new Date(fechaHasta);
      fetchCortesCompleto(desdeDate, hastaDate);
    } catch (err) {
      console.error(err);
      alert('❌ Error al realizar el corte.');
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto px-6 py-8 font-inter"
    >
      <h2 className="text-3xl font-bold text-amber-700 mb-6">Reporte de Cortes de Caja</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 300 }}
          className="bg-white shadow rounded-xl border-l-8 border-amber-500 p-5 cursor-pointer"
        >
          <p className="text-amber-700 font-semibold">Total en Cortes</p>
          <h3 className="text-2xl font-bold text-amber-700">${totalCortes.toFixed(2)}</h3>
          <p className="text-sm text-gray-500 mt-1">{cortesFiltrados.length} registros</p>
        </motion.div>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <input type="date" value={fechaDesde} onChange={(e) => setFechaDesde(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg" />
        <input type="date" value={fechaHasta} onChange={(e) => setFechaHasta(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg" />
        <button
          onClick={() => {
            const desdeDate = new Date(fechaDesde);
            const hastaDate = new Date(fechaHasta);
            fetchCortesCompleto(desdeDate, hastaDate);
          }}
          className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
        >
          Buscar
        </button>
        <button onClick={exportarPDF} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Exportar PDF</button>
        <input type="text" placeholder="Buscar por ID o nombre" value={busqueda} onChange={e => setBusqueda(e.target.value)} className="px-4 py-2 border border-gray-400 rounded-lg w-64" />
        <button onClick={generarCorte} className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Generar Corte</button>
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}
      {cargando && <p className="text-gray-500 mb-4">Cargando cortes...</p>}

      <div className="overflow-x-auto bg-white rounded-xl shadow border border-amber-200">
        <div className="max-h-96 overflow-y-auto">
          <table className="min-w-full text-sm text-gray-700">
            <thead className="bg-amber-200 text-amber-800 text-left sticky top-0 z-20 shadow-md">
              <tr>
                <th className="px-4 py-3 cursor-pointer" onClick={() => toggleOrden('id_corte')}>ID Corte</th>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3 cursor-pointer" onClick={() => toggleOrden('fecha_corte')}>Fecha</th>
                <th className="px-4 py-3">Monto</th>
              </tr>
            </thead>
            <tbody>
              {cortesFiltrados.map((c, i) => {
                const fechaFormateada = new Date(new Date(c.fecha_corte).getTime() + 6 * 60 * 60 * 1000)
                  .toLocaleString('es-MX', {
                    timeZone: 'America/Mexico_City',
                    hour12: false,
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                  });
                return (
                  <tr key={i} className="border-t border-amber-100 hover:bg-amber-50">
                    <td className="px-4 py-2">{c.id_corte}</td>
                    <td className="px-4 py-2">{c.nombre_corte}</td>
                    <td className="px-4 py-2">{fechaFormateada}</td>
                    <td className="px-4 py-2">${parseFloat(c.monto_corte).toFixed(2)}</td>
                  </tr>
                );
              })}
              {cortesFiltrados.length === 0 && !cargando && (
                <tr>
                  <td colSpan="4" className="px-4 py-4 text-center text-gray-400">No hay datos disponibles</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.section>
  );
}
