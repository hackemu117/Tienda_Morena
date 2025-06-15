import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import logo from '../assets/logo.png';

export default function Navbar() {
  const location = useLocation();

  const links = [
    { to: '/', label: 'Inicio' },
    { to: '/productos', label: 'Productos' },
    { to: '/ventas', label: 'Ventas' },
    { to: '/reportes', label: 'Reportes' },
    { to: '/proveedores', label: 'Proveedores' }
  ];

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-blue-950 text-white shadow-md fixed w-full z-50"
    >
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo + título */}
        <div className="flex items-center gap-3">
          <img src={logo} alt="Logo" className="h-10 w-auto" />
          <h1 className="text-xl font-bold text-red-500">MODERNA</h1>
        </div>

        {/* Links de navegación */}
        <nav className="flex gap-6 text-sm font-medium">
          {links.map((link) => (
            <motion.div
              key={link.to}
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Link
                to={link.to}
                className={`hover:text-red-300 transition ${
                  location.pathname === link.to ? 'text-red-400 font-semibold' : ''
                }`}
              >
                {link.label}
              </Link>
            </motion.div>
          ))}
        </nav>
      </div>
    </motion.header>
  );
}
