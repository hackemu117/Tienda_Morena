import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/ui/button';
import { FaExclamationTriangle, FaClock, FaTrash, FaEdit } from 'react-icons/fa';

export default function ProductosPage() {
  const [productos, setProductos] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [mostrarDialogo, setMostrarDialogo] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:3001/api/productos')
      .then(res => setProductos(res.data))
      .catch(err => console.error('Error al obtener productos:', err));
  }, []);

  const confirmarEliminacion = (producto) => {
    setProductoSeleccionado(producto);
    setMostrarDialogo(true);
  };

  const eliminarProducto = async () => {
    if (!productoSeleccionado) return;

    try {
      await axios.delete(`http://localhost:3001/api/productos/${productoSeleccionado.ID_Producto}`);
      setProductos(prev =>
        prev.filter(p => p.ID_Producto !== productoSeleccionado.ID_Producto)
      );
      setMostrarDialogo(false);
    } catch (error) {
      console.error('Error al eliminar producto:', error);
    }
  };

  const hoy = new Date();

  const productosAlerta = productos.filter(prod => {
    const fecha = prod.Fecha_Caducidad ? parseISO(prod.Fecha_Caducidad) : null;
    const caducaPronto = fecha
      ? (fecha - hoy) / (1000 * 60 * 60 * 24) <= 7
      : false;
    return prod.Stock_Disponible < 5 || caducaPronto;
  });

  const productosNormales = productos.filter(prod => !productosAlerta.includes(prod));

  const CardProducto = ({ prod, esCritico }) => {
    const fechaCad = prod.Fecha_Caducidad ? parseISO(prod.Fecha_Caducidad) : null;
    const esPocoStock = prod.Stock_Disponible < 5;
    const esProximaCaducidad = fechaCad
      ? (fechaCad - hoy) / (1000 * 60 * 60 * 24) <= 7
      : false;

    return (
      <motion.div
        key={prod.ID_Producto}
        className={`rounded-2xl p-5 shadow-md transition-all duration-300 text-white ${
          esCritico
            ? 'bg-gradient-to-br from-red-500 to-red-700'
            : 'bg-gradient-to-br from-green-400 to-green-600'
        }`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        whileHover={{
          scale: 1.03,
          boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.1)'
        }}
      >
        <h3 className="text-xl font-bold mb-2">{prod.Nombre_Producto}</h3>
        <p className="text-sm"><strong>ID:</strong> {prod.ID_Producto}</p>
        <p className="text-sm"><strong>Marca:</strong> {prod.Marca || 'N/A'}</p>
        <p className="text-sm"><strong>Proveedor:</strong> {prod.ID_Proveedor || 'N/A'}</p>
        <p className="text-sm"><strong>Precio Venta:</strong> ${prod.Precio_Venta}</p>
        <p className="text-sm"><strong>Precio Compra:</strong> ${prod.Precio_Compra}</p>
        <p className="text-sm"><strong>Stock:</strong> {prod.Stock_Disponible}</p>
        <p className="text-sm">
          <strong>Caduca:</strong>{' '}
          {fechaCad ? format(fechaCad, 'dd/MM/yyyy') : 'Sin fecha'}
        </p>

        {esCritico && (
          <div className="mt-3 space-y-1 text-sm font-semibold">
            {esPocoStock && (
              <p><FaExclamationTriangle className="inline mr-2" />Poco stock</p>
            )}
            {esProximaCaducidad && (
              <p><FaClock className="inline mr-2" />Pronto a caducar</p>
            )}
          </div>
        )}

        <div className="flex justify-between mt-6 gap-2">
          <Button
            variant="destructive"
            className="w-1/2 bg-white text-red-600 hover:bg-red-200"
            onClick={() => confirmarEliminacion(prod)}
          >
            <FaTrash className="mr-1" /> Eliminar
          </Button>
          <Button
            variant="outline"
            className="w-1/2 bg-white text-green-700 hover:bg-green-200"
            onClick={() => navigate('/agregar-producto', { state: { producto: prod } })}
          >
            <FaEdit className="mr-1" /> Editar
          </Button>
        </div>
      </motion.div>
    );
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="px-6 py-8 max-w-7xl mx-auto font-inter"
    >
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-red-700">Nuestros Productos</h2>
        <Button
          onClick={() => navigate("/agregar-producto")}
          className="bg-red-700 hover:bg-red-800 text-white shadow-lg px-6 py-3 text-sm font-medium rounded-xl"
        >
          + Agregar Producto
        </Button>
      </div>

      {mostrarDialogo && productoSeleccionado && (
        <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-white rounded-xl shadow-lg p-6 w-[90%] max-w-md text-center"
          >
            <h3 className="text-lg font-bold text-red-700 mb-2">¿Eliminar producto?</h3>
            <p className="text-sm text-gray-700 mb-4">
              Estás a punto de eliminar <strong>{productoSeleccionado.Nombre_Producto}</strong> (ID: {productoSeleccionado.ID_Producto}). ¿Deseas continuar?
            </p>
            <div className="flex justify-center gap-4">
              <Button onClick={() => setMostrarDialogo(false)} className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded">
                Cancelar
              </Button>
              <Button onClick={eliminarProducto} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded">
                Sí, eliminar
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {productosAlerta.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-red-600 mb-4">⚠️ Productos en Alerta</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <AnimatePresence>
              {productosAlerta.map(prod => (
                <CardProducto key={prod.ID_Producto} prod={prod} esCritico={true} />
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      <div>
        <h3 className="text-xl font-semibold text-green-600 mb-4">Productos en Buen Estado</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <AnimatePresence>
            {productosNormales.map(prod => (
              <CardProducto key={prod.ID_Producto} prod={prod} esCritico={false} />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </motion.section>
  );
}
