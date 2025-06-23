import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChartLine, FaCashRegister, FaBell } from 'react-icons/fa';
import logo from '../assets/Logo-1.png';

// --- Imports adicionales para la funcionalidad de alertas ---
import axios from 'axios';
import * as HoverCard from '@radix-ui/react-hover-card';

const navItems = [
  { name: "Inicio", href: "/" },
  { name: "Productos", href: "/productos" },
  { name: "Ventas", href: "/ventas" },
  { name: "Proveedores", href: "/proveedores" },
  { name: "Clientes", href: "/clientes" },
  { name: "Marcas", href: "/marcas" },
];

export default function Navbar() {
  const pathname = window.location.pathname;
  const [menuOpen, setMenuOpen] = useState(false);
  const [reportesOpen, setReportesOpen] = useState(false);

  // --- Estados para guardar los conteos de las alertas ---
  const [conteoBajoStock, setConteoBajoStock] = useState(0);
  const [conteoPorCaducar, setConteoPorCaducar] = useState(0);

  // --- useEffect para obtener datos de alertas al cargar la página ---
  useEffect(() => {
    const fetchAlertas = async () => {
      try {
        const [resBajoStock, resPorCaducar] = await Promise.all([
          axios.get('http://localhost:3001/api/alertas/conteo/bajo-stock'),
          axios.get('http://localhost:3001/api/alertas/conteo/por-caducar')
        ]);
        setConteoBajoStock(resBajoStock.data?.total_productos_bajo_stock || 0);
        setConteoPorCaducar(resPorCaducar.data?.total_productos_por_caducar || 0);
      } catch (error) {
        console.error("Error al obtener las alertas para el Navbar:", error);
      }
    };
    fetchAlertas();
  }, []);

  const totalAlertas = conteoBajoStock + conteoPorCaducar;

  return (
    <nav className="bg-gradient-to-r from-red-600 via-red-500 to-red-700 shadow-lg px-6 py-4 sticky top-0 z-50">
      <div className="flex justify-between items-center">
        {/* --- Logo --- */}
        <div className="flex items-center gap-6 text-2xl font-bold text-white tracking-wide">
          <motion.div whileHover={{ scale: 1.05 }}>
            <img src={logo} alt="Logo" className="h-20 w-20" />
          </motion.div>
        </div>

        {/* --- Botón de Menú Móvil --- */}
        <button className="text-white md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            {menuOpen ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>

        {/* --- Menú de Navegación para Escritorio --- */}
        <div className="hidden md:flex items-center gap-4">
          <ul className="flex gap-4 relative">
            {[...navItems, { name: 'Reportes', dropdown: true }].map((item) => {
              const isActive = pathname === item.href;
              if (item.dropdown) {
                return (
                  <motion.li key={item.name} className="relative" onMouseEnter={() => setReportesOpen(true)} onMouseLeave={() => setReportesOpen(false)}>
                    <span className="cursor-pointer px-5 py-2 rounded-full font-semibold text-sm uppercase transition-all duration-300 text-white border-2 border-red-300 hover:bg-white hover:text-red-700 hover:border-white">
                      {item.name}
                    </span>
                    <AnimatePresence>
                      {reportesOpen && (
                        <motion.ul initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute top-10 right-0 w-60 bg-white shadow-lg rounded-xl overflow-hidden z-50">
                          <li><a href="/reportes/ventas" className="flex items-center gap-2 px-4 py-3 text-sm text-red-700 hover:bg-red-100"><FaChartLine /> Reporte de Ventas</a></li>
                          <li><a href="/reportes/cortes" className="flex items-center gap-2 px-4 py-3 text-sm text-red-700 hover:bg-red-100"><FaCashRegister /> Corte de Caja</a></li>
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </motion.li>
                );
              }
              return (
                <motion.li key={item.name} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                  <a href={item.href} className={`px-5 py-2 rounded-full font-semibold text-sm uppercase transition-all duration-300 shadow-md border-2 ${isActive ? 'bg-white text-red-700 border-white' : 'text-white border-red-300 hover:bg-white hover:text-red-700 hover:border-white'}`}>
                    {item.name}
                  </a>
                </motion.li>
              );
            })}
          </ul>

          {/* --- Ícono de Notificaciones con Panel Flotante (HoverCard) --- */}
          <HoverCard.Root>
            <HoverCard.Trigger asChild>
              <a href="/alertas" className="relative text-white p-3 rounded-full hover:bg-red-700 transition-colors">
                <FaBell size={20} />
                {totalAlertas > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-300 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-yellow-400 justify-center items-center text-red-700 text-xs font-bold">{totalAlertas}</span>
                  </span>
                )}
              </a>
            </HoverCard.Trigger>
            <HoverCard.Portal>
              <HoverCard.Content className="bg-white rounded-lg shadow-2xl p-4 w-72 border border-gray-200 z-50" sideOffset={10} asChild>
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
                  <div className="flex flex-col gap-2">
                    <h3 className="font-bold text-md text-gray-800 border-b pb-2 mb-2">Notificaciones</h3>
                    {totalAlertas > 0 ? (
                      <>
                        {conteoBajoStock > 0 && <div className="text-sm text-gray-700">⚠️ Tienes <span className="font-semibold text-orange-600">{conteoBajoStock}</span> producto(s) con bajo stock.</div>}
                        {conteoPorCaducar > 0 && <div className="text-sm text-gray-700">🗓️ Tienes <span className="font-semibold text-yellow-600">{conteoPorCaducar}</span> producto(s) cerca de caducar.</div>}
                      </>
                    ) : <div className="text-sm text-gray-500">No hay alertas nuevas. ¡Todo en orden!</div>}
                  </div>
                  <HoverCard.Arrow className="fill-white" />
                </motion.div>
              </HoverCard.Content>
            </HoverCard.Portal>
          </HoverCard.Root>
        </div>
      </div>

      {/* --- Menú Desplegable para Móvil --- */}
      <AnimatePresence>
        {menuOpen && (
          <motion.ul className="flex flex-col gap-3 mt-4 md:hidden" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return <li key={item.name}><a href={item.href} onClick={() => setMenuOpen(false)} className={`block w-full px-5 py-3 rounded-lg text-center font-semibold border-2 ${isActive ? 'bg-white text-red-700 border-white' : 'bg-red-100 text-red-700 border-red-300 hover:bg-white'}`}>{item.name}</a></li>;
            })}
            
            {/* --- Links especiales para móvil --- */}
            <li><div className="border-t border-red-300 my-2"></div></li>
            {/* Link a Alertas agregado para el menú móvil */}
            <li><a href="/alertas" onClick={() => setMenuOpen(false)} className="block w-full px-5 py-3 rounded-lg text-center font-semibold border-2 bg-red-100 text-red-700 border-red-300 hover:bg-white"><FaBell className="inline mr-2" /> Alertas ({totalAlertas})</a></li>
            <li className="text-sm text-red-100 font-semibold px-5 mt-2">Reportes</li>
            <li><a href="/reportes/ventas" onClick={() => setMenuOpen(false)} className="block w-full px-5 py-2 text-left text-sm text-red-700 bg-red-100 hover:bg-white border-2 border-red-300 rounded-lg mt-1"><FaChartLine className="inline mr-2" /> Ventas</a></li>
            <li><a href="/reportes/cortes" onClick={() => setMenuOpen(false)} className="block w-full px-5 py-2 text-left text-sm text-red-700 bg-red-100 hover:bg-white border-2 border-red-300 rounded-lg mt-1"><FaCashRegister className="inline mr-2" /> Corte de Caja</a></li>
          </motion.ul>
        )}
      </AnimatePresence>
    </nav>
  );
}