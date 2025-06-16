import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/ui/button';

export default function ProductosPage() {
  const [productos, setProductos] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [mostrarDialogo, setMostrarDialogo] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const datosFalsos = [
      {
        id: 1,
        nombre: 'Arroz',
        precioUnidadVenta: 30,
        precioUnidadCompra: 25,
        stock: 3,
        proveedor: 'Granos MX',
        fechaCaducidad: '2025-06-20'
      },
      {
        id: 2,
        nombre: 'Frijol',
        precioUnidadVenta: 36,
        precioUnidadCompra: 30,
        stock: 15,
        proveedor: 'AgroComercial',
        fechaCaducidad: '2025-11-15'
      },
      {
        id: 3,
        nombre: 'Aceite',
        precioUnidadVenta: 55,
        precioUnidadCompra: 45,
        stock: 2,
        proveedor: 'NutriAceites',
        fechaCaducidad: '2024-12-01'
      }
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

  return (
    <motion.section
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="px-6 py-8 max-w-7xl mx-auto font-inter"
    >
      <motion.div
        className="flex justify-between items-center mb-8"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.h2
          className="text-3xl font-bold text-blue-800"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Nuestros Productos
        </motion.h2>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Button
            onClick={() => navigate("/agregar-producto")}
            className="bg-blue-800 hover:bg-blue-900 text-white shadow-lg px-6 py-3 text-sm font-medium rounded-xl transition-all duration-300"
          >
            + Agregar Producto
          </Button>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8"
      >
        <AnimatePresence>
          {[...productos]
            .sort((a, b) => {
              const hoy = new Date();
              const caducaA = parseISO(a.fechaCaducidad);
              const caducaB = parseISO(b.fechaCaducidad);

              const criticoA = a.stock < 5 || (caducaA - hoy) / (1000 * 60 * 60 * 24) <= 7;
              const criticoB = b.stock < 5 || (caducaB - hoy) / (1000 * 60 * 60 * 24) <= 7;

              return criticoB - criticoA;
            })
            .map((prod) => {
              const hoy = new Date();
              const fechaCad = parseISO(prod.fechaCaducidad);
              const esPocoStock = prod.stock < 5;
              const esProximaCaducidad = (fechaCad - hoy) / (1000 * 60 * 60 * 24) <= 7;
              const esCritico = esPocoStock || esProximaCaducidad;

              return (
                <motion.div
                  key={prod.id}
                  className={`border rounded-2xl p-5 shadow-md transition-all duration-300 ${
                    esCritico ? 'bg-red-100 border-red-400' : 'bg-white'
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{
                    scale: 1.03,
                    boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.08)'
                  }}
                >
                  <h3 className="text-xl font-bold text-blue-800 mb-2">{prod.nombre}</h3>
                  <p className="text-sm"><strong>ID:</strong> {prod.id}</p>
                  <p className="text-sm"><strong>Proveedor:</strong> {prod.proveedor}</p>
                  <p className="text-sm"><strong>Precio Venta:</strong> ${prod.precioUnidadVenta}</p>
                  <p className="text-sm"><strong>Precio Compra:</strong> ${prod.precioUnidadCompra}</p>
                  <p className="text-sm"><strong>Stock:</strong> {prod.stock}</p>
                  <p className="text-sm"><strong>Caduca:</strong> {format(fechaCad, 'dd/MM/yyyy')}</p>

                  {esCritico && (
                    <div className="mt-2 text-sm text-red-700 font-semibold space-y-1">
                      {esPocoStock && <p>⚠️ ¡Poco stock!</p>}
                      {esProximaCaducidad && <p>⏳ ¡Pronto a caducar!</p>}
                    </div>
                  )}

                  <div className="flex justify-between mt-6 gap-2">
                    <Button
                      variant="destructive"
                      className="w-1/2 text-white bg-red-600 hover:bg-red-700"
                      onClick={() => confirmarEliminacion(prod)}
                    >
                      🗑 Eliminar
                    </Button>
                    <Button
                      variant="outline"
                      className="w-1/2 text-white bg-blue-600 hover:bg-blue-700"
                      onClick={() => navigate('/agregar-producto', { state: { producto: prod } })}
                    >
                      📝 Editar
                    </Button>
                  </div>
                </motion.div>
              );
            })}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {mostrarDialogo && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-6 rounded-2xl shadow-xl max-w-md w-full text-center"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <h3 className="text-xl font-semibold text-red-700 mb-4">¿Eliminar producto?</h3>
              <p className="text-gray-700 mb-6">
                Estás por eliminar <strong>{productoSeleccionado?.nombre}</strong>. Esta acción no se puede deshacer.
              </p>
              <div className="flex justify-center gap-4">
                <Button className="bg-gray-300 hover:bg-gray-400 text-black" onClick={() => setMostrarDialogo(false)}>
                  Cancelar
                </Button>
                <Button className="bg-red-600 hover:bg-red-700" onClick={eliminarProducto}>
                  Confirmar
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
