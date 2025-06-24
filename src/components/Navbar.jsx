import { motion } from "framer-motion";
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
  const pathname = window.location.pathname;

  return (
    <nav className="bg-gradient-to-r from-red-600 via-red-500 to-red-700 shadow-lg px-8 py-5 sticky top-0 z-50 flex justify-between items-center">
      <motion.div
        whileHover={{ scale: 1.08 }}
        className="flex items-center gap-3 text-3xl font-extrabold text-white tracking-wide drop-shadow-lg"
      >
        <img src={logo} alt="Logo" className="h-10 w-auto" />
        Tienda La Moderna
      </motion.div>

      <ul className="flex gap-3">
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
                      : "bg-red-100 text-red-700 border-red-300 hover:bg-white hover:text-red-700 hover:border-white"
                  }
                `}
              >
                {item.name}
              </a>
            </motion.li>
          );
        })}
      </ul>
    </nav>
  );
}