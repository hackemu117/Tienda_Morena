import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { FaChartLine, FaCashRegister, FaBell } from 'react-icons/fa';
import logo from '../assets/Logo-1.png';

export default function NavbarConReportesDropdown() {
  const pathname = window.location.pathname;
  const [menuOpen, setMenuOpen] = useState(false);
  const [reportesOpen, setReportesOpen] = useState(false);

  const navItems = [
    { name: "Inicio", href: "/" },
    { name: "Productos", href: "/productos" },
    { name: "Ventas", href: "/ventas" },
    { name: "Proveedores", href: "/proveedores" },
    { name: "Clientes", href: "/clientes" },
    { name: "Marcas", href: "/clientes" },

  ];

  return (
    <nav className="bg-gradient-to-r from-red-600 via-red-500 to-red-700 shadow-lg px-6 py-4 sticky top-0 z-50">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-6 text-2xl font-bold text-white tracking-wide">
          <motion.div whileHover={{ scale: 1.05 }}>
            <img src={logo} alt="Logo" className="h-20 w-20" />
          </motion.div>
          <a href="/alertas" className="text-white text-base font-semibold flex items-center gap-2 hover:text-red-200 hover:bg-white-200 transition-all">
            <FaBell /> Alertas
          </a>
        </div>

        <button
          className="text-white md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        <ul className="hidden md:flex mb-2 mt-2 gap-4 relative">
          {[...navItems, { name: 'Reportes', dropdown: true }].map((item) => {
            const isActive = pathname === item.href;
            if (item.dropdown) {
              return (
                <motion.li
                  key={item.name}
                  className="relative"
                  onMouseEnter={() => setReportesOpen(true)}
                  onMouseLeave={() => setReportesOpen(false)}
                >
                  <span
                    className="cursor-pointer px-5 py-2 rounded-full font-semibold text-sm uppercase transition-all duration-300 text-white border-2 border-red-300 hover:bg-white hover:text-red-700 hover:border-white"
                  >
                    {item.name}
                  </span>
                  <AnimatePresence>
                    {reportesOpen && (
                      <motion.ul
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-10 left-0 w-60 bg-white shadow-lg rounded-xl overflow-hidden z-50"
                      >
                        <li>
                          <a
                            href="/reportes/ventas"
                            className="flex items-center gap-2 px-4 py-2 text-sm text-red-700 hover:bg-red-100"
                          >
                            <FaChartLine /> Ventas
                          </a>
                        </li>
                        <li>
                          <a
                            href="/reportes/corte-caja"
                            className="flex items-center gap-2 px-4 py-2 text-sm text-red-700 hover:bg-red-100"
                          >
                            <FaCashRegister /> Corte de Caja
                          </a>
                        </li>
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </motion.li>
              );
            }

            return (
              <motion.li key={item.name} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <a
                  href={item.href}
                  className={`px-5 py-2 rounded-full font-semibold text-sm uppercase transition-all duration-300 shadow-md border-2 ${
                    isActive
                      ? 'bg-white text-red-700 border-white'
                      : 'text-white border-red-300 hover:bg-white hover:text-red-700 hover:border-white'
                  }`}
                >
                  {item.icon && <span className="inline-block mr-1 align-middle">{item.icon}</span>}
                  {item.name}
                </a>
              </motion.li>
            );
          })}
        </ul>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.ul
            className="flex flex-col gap-3 mt-4 md:hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.name}>
                  <a
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={`block w-full px-5 py-3 rounded-lg text-center font-semibold border-2 ${
                      isActive
                        ? 'bg-white text-red-700 border-white'
                        : 'bg-red-100 text-red-700 border-red-300 hover:bg-white hover:text-red-700 hover:border-white'
                    }`}
                  >
                    {item.icon && <span className="inline-block mr-2 align-middle">{item.icon}</span>}
                    {item.name}
                  </a>
                </li>
              );
            })}
            <li>
              <div className="border-t border-red-300 my-2"></div>
              <div className="text-sm text-red-100 font-semibold px-5">Reportes</div>
              <a
                href="/reportes/ventas"
                className="block w-full px-5 py-2 text-left text-sm text-red-700 bg-red-100 hover:bg-white hover:text-red-700 hover:border-white border-2 border-red-300 rounded-lg mt-1"
                onClick={() => setMenuOpen(false)}
              >
                <FaChartLine className="inline mr-2" /> Ventas
              </a>
              <a
                href="/reportes/corte-caja"
                className="block w-full px-5 py-2 text-left text-sm text-red-700 bg-red-100 hover:bg-white hover:text-red-700 hover:border-white border-2 border-red-300 rounded-lg mt-1"
                onClick={() => setMenuOpen(false)}
              >
                <FaCashRegister className="inline mr-2" /> Corte de Caja
              </a>
            </li>
          </motion.ul>
        )}
      </AnimatePresence>
    </nav>
  );
}