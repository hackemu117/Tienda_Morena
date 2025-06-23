import React, { useState, useEffect, useCallback } from 'react';
import { motion } from "framer-motion";
import axios from 'axios';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { BsCashCoin } from "react-icons/bs";
import { useNavigate } from 'react-router-dom';

export default function AlertasPage() {
  const [productosBajoStock, setProductosBajoStock] = useState([]);
  const [productosPorCaducar, setProductosPorCaducar] = useState([]);
  const [productosCaducados, setProductosCaducados] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [actualizandoPrecios, setActualizandoPrecios] = useState(false);
  const navigate = useNavigate();

  const obtenerAlertas = useCallback(async () => {
    try {
      const res = await axios.get('http://localhost:3001/alertas');
      setProductosBajoStock(res.data.bajo_stock || []);
      setProductosPorCaducar(res.data.por_caducar || []);
      setProductosCaducados(res.data.caducados || []);
      setError('');
    } catch (err) {
      console.error('Error al cargar alertas:', err);
      setError('Error al cargar las alertas. Verifica la conexión con el servidor.');
    } finally {
      if (cargando) setCargando(false);
    }
  }, [cargando]);

  useEffect(() => {
    obtenerAlertas();
  }, [obtenerAlertas]);

  const handleRebajarPrecios = async () => {
    setActualizandoPrecios(true);
    try {
      const res = await axios.post('http://localhost:3001/alertas/rebajar-precios');
      alert(res.data.message);
      await obtenerAlertas();
    } catch (err) {
      console.error('Error al rebajar precios:', err);
      const errorMessage = err.response?.data?.error || 'Ocurrió un error inesperado.';
      alert(`Error: ${errorMessage}`);
    } finally {
      setActualizandoPrecios(false);
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar el producto con ID ${productId}?`)) {
      try {
        await axios.delete(`http://localhost:3001/alertas/${productId}`);
        alert('Producto eliminado correctamente.');
        await obtenerAlertas();
      } catch (err) {
        console.error('Error al eliminar el producto:', err);
        alert('No se pudo eliminar el producto.');
      }
    }
  };

  const handleEdit = (product) => {
    navigate('/agregar-producto', {
      state: {
        producto: {
          ID_Producto: product.ID_Producto,
          Nombre_Producto: product.Nombre,
          Precio_Venta: product.Precio_Venta,
          Precio_Compra: product.Precio_Compra,
          Stock_Disponible: product.Stock,
          ID_Proveedor: product.ID_Proveedor,
          ID_Marca: product.ID_Marca,
          Fecha_Caducidad: product.Caducidad
        }
      }
    });
  };

  if (cargando) {
    return <div className="flex justify-center items-center h-screen text-xl font-semibold">Cargando alertas...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-xl text-red-600 bg-red-100 p-8 rounded-lg">{error}</div>;
  }

  const renderTabla = (title, productos, colorClass) => (
    <div>
      <h3 className={`text-xl font-bold mb-4 ${colorClass}`}>{title}</h3>
      {productos.length === 0 ? (
        <div className="text-gray-500 bg-white p-4 rounded-lg shadow-md text-center">
          No hay productos en esta categoría de alerta.
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            {/* Encabezado separado para que quede fijo */}
            <table className="w-full text-sm text-left text-gray-600">
              <thead className="text-xs text-gray-700 uppercase bg-red-50 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-3">ID</th>
                  <th className="px-6 py-3">Nombre</th>
                  <th className="px-6 py-3">Marca</th>
                  <th className="px-6 py-3">Proveedor</th>
                  <th className="px-6 py-3">Stock</th>
                  <th className="px-6 py-3">Precio Compra</th>
                  <th className="px-6 py-3">Caducidad</th>
                  <th className="px-6 py-3">Precio Venta</th>
                  <th className="px-6 py-3">Acciones</th>
                </tr>
              </thead>
            </table>

            {/* Contenedor con scroll vertical */}
            <div className="max-h-[350px] overflow-y-auto">
              <table className="w-full text-sm text-left text-gray-600">
                <tbody className="divide-y divide-gray-200">
                  {productos.map((p) => (
                    <tr key={p.ID_Producto} className="bg-white hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">{p.ID_Producto}</td>
                      <td className="px-6 py-4">{p.Nombre}</td>
                      <td className="px-6 py-4">{p.Marca || 'N/A'}</td>
                      <td className="px-6 py-4">{p.Proveedor || 'N/A'}</td>
                      <td className="px-6 py-4 font-bold text-red-500">{p.Stock}</td>
                      <td className="px-6 py-4">${p.Precio_Compra.toFixed(2)}</td>
                      <td className="px-6 py-4 font-bold text-orange-500">
                        {p.Caducidad ? new Date(p.Caducidad).toLocaleDateString('es-MX', { timeZone: 'UTC' }) : 'N/A'}
                      </td>
                      <td className="px-6 py-4 font-semibold text-green-600">${p.Precio_Venta.toFixed(2)}</td>
                      <td className="px-6 py-4 flex items-center space-x-3">
                        <button onClick={() => handleEdit(p)} className="text-blue-500 hover:text-blue-700"><FaEdit /></button>
                        <button onClick={() => handleDelete(p.ID_Producto)} className="text-red-500 hover:text-red-700"><FaTrash /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <motion.section
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
        <h2 className="text-3xl font-bold text-gray-800">Alertas de Productos</h2>
        <button
          onClick={handleRebajarPrecios}
          disabled={actualizandoPrecios}
          className="flex items-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 disabled:bg-blue-300 transition"
        >
          <BsCashCoin className="mr-2" />
          {actualizandoPrecios ? 'Procesando...' : 'Rebajar Precio por Caducar'}
        </button>
      </div>

      <div className="space-y-12">
        {renderTabla("Productos con Stock Crítico", productosBajoStock, "text-red-600")}
        {renderTabla("Productos Próximos a Caducar", productosPorCaducar, "text-orange-600")}
        {renderTabla("Productos Caducados", productosCaducados, "text-black")}
      </div>
    </motion.section>
  );
}