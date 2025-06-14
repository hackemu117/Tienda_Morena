import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Componentes
import Navbar from './components/Navbar';

// Páginas
import DashboardPage from './pages/DashboardPage';
import ProductosPage from './pages/ProductosPage';
import AgregarProductosPage from './pages/AgregarProductoPage';
import ClientesPage from './pages/ClientesPage';
import ProveedoresPage from './pages/ProveedoresPage';
import AgregarProveedoresPage from './pages/AgregarProveedoresPage';
import ReportesPage from './pages/ReportesPage';
import VentasPage from './pages/VentasPage';

function App() {
  return (
    <Router>
      {/* Navbar fija en la parte superior */}
      <Navbar />

      {/* Contenido principal con espacio para no quedar oculto */}
      <main className="pt-15 px-4 max-w-7xl mx-auto">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/productos" element={<ProductosPage />} />
          <Route path="/agregar-producto" element={<AgregarProductosPage />} />
          <Route path="/agregar-producto/:id" element={<AgregarProductosPage />} />
          <Route path="/clientes" element={<ClientesPage />} />
          <Route path="/proveedores" element={<ProveedoresPage />} />
          <Route path="/agregar-proveedor" element={<AgregarProveedoresPage />} />
          <Route path="/reportes" element={<ReportesPage />} />
          <Route path="/ventas" element={<VentasPage />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
