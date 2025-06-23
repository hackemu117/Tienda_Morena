import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { BsCashCoin } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function AlertasPage() {
  const [bajoStock, setBajoStock] = useState([]);
  const [porCaducar, setPorCaducar] = useState([]);
  const [caducados, setCaducados] = useState([]);
  const [conteo, setConteo] = useState({ productos_por_caducar: 0, productos_bajo_stock: 0 });
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [actualizando, setActualizando] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const [alertas, caducarCount, stockCount] = await Promise.all([
          axios.get('http://localhost:3001/api/alertas/'),
          axios.get('http://localhost:3001/api/alertas/conteo/por-caducar'),
          axios.get('http://localhost:3001/api/alertas/conteo/bajo-stock')
        ]);

        setBajoStock(alertas.data.bajo_stock || []);
        setPorCaducar(alertas.data.por_caducar || []);
        setCaducados(alertas.data.caducados || []);
        setConteo({
          productos_por_caducar: caducarCount.data.productos_por_caducar,
          productos_bajo_stock: stockCount.data.productos_bajo_stock
        });

        setError('');
      } catch (err) {
        console.error('❌ Error cargando alertas:', err);
        setError('Error al cargar las alertas. Verifica la conexión con el servidor.');
      } finally {
        setCargando(false);
      }
    };

    obtenerDatos();
  }, []);

  const handleRebajarPrecios = async () => {
    setActualizando(true);
    try {
      const res = await axios.post('http://localhost:3001/api/alertas/rebajar-precios');
      alert(res.data.message || 'Precios rebajados.');
      window.location.reload();
    } catch (err) {
      console.error('❌ Error rebajando precios:', err);
      alert('No se pudo rebajar los precios.');
    } finally {
      setActualizando(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`¿Eliminar el producto ${id}?`)) return;
    try {
      await axios.delete(`http://localhost:3001/api/alertas/${id}`);
      alert('Producto eliminado.');
      window.location.reload();
    } catch (err) {
      console.error('❌ Error al eliminar:', err);
      alert('No se pudo eliminar el producto.');
    }
  };

  const handleEdit = (p) => {
    navigate('/agregar-producto', {
      state: {
        producto: {
          ID_Producto: p.ID_Producto,
          Nombre_Producto: p.Nombre,
          Precio_Venta: p.Precio_Venta,
          Precio_Compra: p.Precio_Compra,
          Stock_Disponible: p.Stock,
          ID_Proveedor: p.ID_Proveedor,
          ID_Marca: p.ID_Marca,
          Fecha_Caducidad: p.Caducidad
        }
      }
    });
  };

  const renderTabla = (titulo, productos, colorTitulo) => (
    <div>
      <h3 className={`text-xl font-bold mb-4 ${colorTitulo}`}>{titulo}</h3>
      {productos.length === 0 ? (
        <div className="text-gray-500 bg-white p-4 rounded-lg shadow text-center">
          No hay productos en esta categoría.
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-600">
              <thead className="text-xs text-gray-700 uppercase bg-red-50 sticky top-0">
                <tr>
                  <th className="px-4 py-2">ID</th>
                  <th className="px-4 py-2">Nombre</th>
                  <th className="px-4 py-2">Marca</th>
                  <th className="px-4 py-2">Proveedor</th>
                  <th className="px-4 py-2">Stock</th>
                  <th className="px-4 py-2">Precio Compra</th>
                  <th className="px-4 py-2">Caducidad</th>
                  <th className="px-4 py-2">Precio Venta</th>
                  <th className="px-4 py-2">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {productos.map((p) => (
                  <tr key={p.ID_Producto} className="bg-white hover:bg-gray-50">
                    <td className="px-4 py-2 font-medium">{p.ID_Producto}</td>
                    <td className="px-4 py-2">{p.Nombre}</td>
                    <td className="px-4 py-2">{p.Marca || 'N/A'}</td>
                    <td className="px-4 py-2">{p.Proveedor || 'N/A'}</td>
                    <td className="px-4 py-2 text-red-600 font-bold">{p.Stock}</td>
                    <td className="px-4 py-2">${p.Precio_Compra?.toFixed(2)}</td>
                    <td className="px-4 py-2 text-orange-500 font-bold">
                      {p.Caducidad ? new Date(p.Caducidad).toLocaleDateString('es-MX') : 'N/A'}
                    </td>
                    <td className="px-4 py-2 text-green-600 font-semibold">${p.Precio_Venta?.toFixed(2)}</td>
                    <td className="px-4 py-2 flex space-x-3">
                      <button onClick={() => handleEdit(p)} className="text-blue-500 hover:text-blue-700">
                        <FaEdit />
                      </button>
                      <button onClick={() => handleDelete(p.ID_Producto)} className="text-red-500 hover:text-red-700">
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );

  if (cargando) return <div className="text-center mt-20 text-lg">Cargando alertas...</div>;
  if (error) return <div className="text-center mt-20 text-red-600">{error}</div>;

  return (
    <motion.section
      className="max-w-7xl mx-auto px-4 py-8 font-sans"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">Alertas de Productos</h2>
        <button
          onClick={handleRebajarPrecios}
          disabled={actualizando}
          className="flex items-center px-4 py-2 bg-blue-600 text-white font-semibold rounded shadow hover:bg-blue-700 disabled:bg-gray-400"
        >
          <BsCashCoin className="mr-2" />
          {actualizando ? 'Procesando...' : 'Rebajar Precio por Caducar'}
        </button>
      </div>

      <div className="mb-8 text-sm text-gray-800">
        {conteo.productos_bajo_stock > 0 && (
          <p className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-2 rounded mb-2">
            ⚠ Hay {conteo.productos_bajo_stock} productos con stock crítico.
          </p>
        )}
        {conteo.productos_por_caducar > 0 && (
          <p className="bg-orange-100 border border-orange-400 text-orange-800 px-4 py-2 rounded">
            ⏳ Hay {conteo.productos_por_caducar} productos por caducar pronto.
          </p>
        )}
      </div>

      <div className="space-y-12">
        {renderTabla("Productos con Stock Crítico", bajoStock, "text-red-600")}
        {renderTabla("Productos Próximos a Caducar", porCaducar, "text-orange-600")}
        {renderTabla("Productos Caducados", caducados, "text-black")}
      </div>
    </motion.section>
  );
}
