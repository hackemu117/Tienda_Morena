import { motion } from "framer-motion";
import { useState } from "react";
import logo from '../assets/logo.png';

const navItems = [
  { name: "Inicio", href: "/" },
  { name: "Productos", href: "/productos" },
  { name: "Ventas", href: "/ventas" },
  { name: "Reportes", href: "/reportes" },
  { name: "Proveedores", href: "/proveedores" },
  { name: "Clientes", href: "/clientes" }
];

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md px-6 py-4 sticky top-0 z-50 flex justify-between items-center">
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="flex items-center gap-3 text-2xl font-bold text-blue-700"
      >
        <img src={logo} alt="Logo" className="h-8 w-auto" />
        Tienda La Morena
      </motion.div>

      <ul className="flex gap-4">
        {navItems.map((item) => (
          <motion.li
            key={item.name}
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 0.97 }}
          >
            <a
              href={item.href}
              className="px-4 py-2 rounded-xl font-medium border border-transparent 
                         text-gray-700 hover:text-blue-700 hover:border-blue-500 hover:bg-blue-50 
                         transition-all duration-300 shadow-sm hover:shadow-md"
            >
              {item.name}
            </a>
          </motion.li>
        ))}
      </ul>
    </nav>
  );
}
