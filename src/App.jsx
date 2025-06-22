import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Componentes
import Navbar from './components/Navbar';

// Páginas
import DashboardPage from './pages/DashboardPage';
import ProductosPage from './pages/ProductosPage';
import AgregarProductosPage from './pages/AgregarProductoPage';
import ClientesPage from './pages/ClientesPage';
import AgregarClientesPage from './pages/AgregarClientesPage';
import ProveedoresPage from './pages/ProveedoresPage';
import AgregarProveedoresPage from './pages/AgregarProveedoresPage';
import ReportesCortesPage from './pages/ReportesCortesPage';
import ReportesPage from './pages/ReportesPage'; // ← Corte de Caja
import VentasPage from './pages/VentasPage';
import MarcasPage from './pages/marcas';
import AgregarMarcasPage from './pages/AgregarMarcasPage';

function App() {
  return (
    <div className="min-h-screen bg-secondary text-gray-800 font-inter">
      <Router>
        <Navbar />

        <main className="px-6 py-8 max-w-7xl mx-auto">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/productos" element={<ProductosPage />} />
            <Route path="/agregar-producto" element={<AgregarProductosPage />} />
            <Route path="/agregar-producto/:id" element={<AgregarProductosPage />} />
            <Route path="/clientes" element={<ClientesPage />} />
            <Route path="/agregar-cliente" element={<AgregarClientesPage />} />
            <Route path="/proveedores" element={<ProveedoresPage />} />
            <Route path="/agregar-proveedor" element={<AgregarProveedoresPage />} />
            <Route path="/ventas" element={<VentasPage />} />

            {/* Reportes */}
            <Route path="/reportes/ventas" element={<ReportesCortesPage />} />
            <Route path="/reportes/cortes" element={<ReportesPage />} /> {/* ← Corte de Caja */}

            {/* Marcas */}
            <Route path="/marcas" element={<MarcasPage />} />
            <Route path="/agregar-marca" element={<AgregarMarcasPage />} />
            <Route path="/agregar-marca/:id" element={<AgregarMarcasPage />} />
          </Routes>
        </main>
      </Router>
    </div>
  );
}

export default App;
