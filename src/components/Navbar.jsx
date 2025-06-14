import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

export default function Navbar() {
  return (
    <header className="bg-blue-950 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo y título */}
          <div className="flex items-center space-x-4">
            <img src={logo} alt="Logo Tienda La Moderna" className="h-10 w-auto" />
            <h1 className="text-2xl font-extrabold tracking-wide text-red-500">
              Tienda Moderna
            </h1>
          </div>

          {/* Navegación desktop */}
          <nav className="hidden md:flex items-center space-x-6 text-sm font-semibold">
            <Link to="/" className="hover:text-red-300 transition">Inicio</Link>
            <Link to="/productos" className="hover:text-red-300 transition">Productos</Link>
            <Link to="/ventas" className="hover:text-red-300 transition">Ventas</Link>
            <Link to="/reportes" className="hover:text-red-300 transition">Reportes</Link>
            <Link to="/proveedores" className="hover:text-red-300 transition">Proveedores</Link>
          </nav>

          {/* Botón hamburguesa (opcional para móviles) */}
          <div className="md:hidden">
            <button className="text-white focus:outline-none">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2"
                viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

