import React, { useEffect, useState } from 'react';
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
    const datosFalsos = [
      { id: 1, nombre: 'Arroz', precioUnidadVenta: 30, precioUnidadCompra: 25, stock: 3, proveedor: 'Granos MX', fechaCaducidad: '2025-06-20' },
      { id: 2, nombre: 'Frijol', precioUnidadVenta: 36, precioUnidadCompra: 30, stock: 15, proveedor: 'AgroComercial', fechaCaducidad: '2025-11-15' },
      { id: 3, nombre: 'Aceite', precioUnidadVenta: 55, precioUnidadCompra: 45, stock: 2, proveedor: 'NutriAceites', fechaCaducidad: '2024-12-01' }
    ];
    setProductos(datosFalsos);
  }, []);

  const confirmarEliminacion = (producto) => {
    setProductoSeleccionado(producto);
    setMostrarDialogo(true);
  };

  const eliminarProducto = () => {
    setProductos(prev => prev.filter(p => p.id !== productoSeleccionado.id));
    setMostrarDialogo(false);
  };

  const hoy = new Date();
  const productosAlerta = productos.filter(prod => prod.stock < 5 || (parseISO(prod.fechaCaducidad) - hoy) / (1000 * 60 * 60 * 24) <= 7);
  const productosNormales = productos.filter(prod => !productosAlerta.includes(prod));

  const CardProducto = ({ prod, esCritico }) => {
    const fechaCad = parseISO(prod.fechaCaducidad);
    const esPocoStock = prod.stock < 5;
    const esProximaCaducidad = (fechaCad - hoy) / (1000 * 60 * 60 * 24) <= 7;

    return (
      <motion.div
        key={prod.id}
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
        <h3 className="text-xl font-bold mb-2">{prod.nombre}</h3>
        <p className="text-sm"><strong>ID:</strong> {prod.id}</p>
        <p className="text-sm"><strong>Proveedor:</strong> {prod.proveedor}</p>
        <p className="text-sm"><strong>Precio Venta:</strong> ${prod.precioUnidadVenta}</p>
        <p className="text-sm"><strong>Precio Compra:</strong> ${prod.precioUnidadCompra}</p>
        <p className="text-sm"><strong>Stock:</strong> {prod.stock}</p>
        <p className="text-sm"><strong>Caduca:</strong> {format(fechaCad, 'dd/MM/yyyy')}</p>

        {esCritico && (
          <div className="mt-3 space-y-1 text-sm font-semibold">
            {esPocoStock && <p><FaExclamationTriangle className="inline mr-2" />Poco stock</p>}
            {esProximaCaducidad && <p><FaClock className="inline mr-2" />Pronto a caducar</p>}
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

      {productosAlerta.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-red-600 mb-4">⚠️ Productos en Alerta</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <AnimatePresence>
              {productosAlerta.map(prod => (
                <CardProducto key={prod.id} prod={prod} esCritico={true} />
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
              <CardProducto key={prod.id} prod={prod} esCritico={false} />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </motion.section>
  );
}