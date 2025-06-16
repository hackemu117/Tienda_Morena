import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import logo from '../assets/Logo-1.png';

const navItems = [
  { name: "Inicio", href: "/" },
  { name: "Productos", href: "/productos" },
  { name: "Ventas", href: "/ventas" },
  { name: "Reportes", href: "/reportes" },
  { name: "Proveedores", href: "/proveedores" },
  { name: "Clientes", href: "/clientes" }
];

export default function Navbar() {
  const pathname = window.location.pathname;
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-gradient-to-r from-red-600 via-red-500 to-red-700 shadow-lg px-6 py-4 sticky top-0 z-50">
      <div className="flex justify-between items-center">
    
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-3 text-2xl font-bold text-white tracking-wide"
        >
          <img src={logo} alt="Logo" className="h-20 w-20" />
       
        </motion.div>

       
        <button
          className="text-white md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            {menuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

    
        <ul className="hidden md:flex mb-2 mt-2 gap-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <motion.li
                key={item.name}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <a
                  href={item.href}
                  className={`
                    px-5 py-2 rounded-full font-semibold text-sm uppercase transition-all duration-300 
                    shadow-md border-2 
                    ${
                      isActive
                        ? "bg-white text-red-700 border-white"
                        : " text-white border-red-300 hover:bg-white hover:text-red-700 hover:border-white"
                    }
                  `}
                >
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
                    className={`
                      block w-full px-5 py-3 rounded-lg text-center font-semibold border-2 
                      ${
                        isActive
                          ? "bg-white text-red-700 border-white"
                          : "bg-red-100 text-red-700 border-red-300 hover:bg-white hover:text-red-700 hover:border-white"
                      }
                    `}
                  >
                    {item.name}
                  </a>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </nav>
  );
}