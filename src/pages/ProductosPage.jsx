import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTrash, FaEdit } from 'react-icons/fa';

export default function ProductosPage() {
  const [productos, setProductos] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [mostrarDialogo, setMostrarDialogo] = useState(false);
  const [ordenCampo, setOrdenCampo] = useState("ID_Producto");
  const [busqueda, setBusqueda] = useState("");
  const inputRef = React.useRef(null);
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false);
  const navigate = useNavigate();

  const ordenarProductos = (campo, data) => {
    const copia = [...data];
    copia.sort((a, b) => {
      if (typeof a[campo] === "number") {
        return a[campo] - b[campo];
      }
      return (a[campo] || '').toString().localeCompare((b[campo] || '').toString());
    });
    return copia;
  };

  useEffect(() => {
    axios.get('http://localhost:3001/api/productos')
      .then(res => {
        const ordenados = ordenarProductos(ordenCampo, res.data);
        setProductos(ordenados);
      })
      .catch(err => console.error('Error al obtener productos:', err));
  }, [ordenCampo]);

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

  const opcionesOrden = [
    { label: "ID", value: "ID_Producto" },
    { label: "Nombre", value: "Nombre_Producto" },
    { label: "Marca", value: "Marca" },
    { label: "Proveedor", value: "Proveedor" },
    { label: "Stock", value: "Stock_Disponible" },
    { label: "Precio Compra", value: "Precio_Compra" },
    { label: "Caducidad", value: "Fecha_Caducidad" },
    { label: "Precio Venta", value: "Precio_Venta" },
  ];

  const productosFiltrados = productos.filter(p =>
    p.Nombre_Producto.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <motion.section
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="px-6 py-8 max-w-7xl mx-auto font-inter relative"
    >
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: 'spring', stiffness: 100, damping: 10 }}
          className="text-3xl font-bold text-red-700"
        >
          Lista de Productos
        </motion.h2>

        <div className="flex items-center flex-wrap gap-3 w-full md:w-auto">
          <select
            value={ordenCampo}
            onChange={(e) => setOrdenCampo(e.target.value)}
            className="bg-white border border-red-300 text-red-700 px-4 py-2 rounded-xl shadow hover:border-red-500 transition-all duration-200"
          >
            {opcionesOrden.map(op => (
              <option key={op.value} value={op.value}>{`Ordenar por ${op.label}`}</option>
            ))}
          </select>

          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              placeholder="Buscar producto..."
              value={busqueda}
              onChange={(e) => {
                setBusqueda(e.target.value);
                setMostrarSugerencias(true);
              }}
              className="px-4 py-2 border border-red-300 rounded-xl shadow text-red-700 placeholder:text-red-400 focus:outline-none focus:ring-2 focus:ring-red-400"
            />
            {busqueda && mostrarSugerencias && productosFiltrados.length > 0 && (
              <div className="absolute z-10 mt-1 bg-white border border-red-200 rounded-xl shadow-md max-h-40 overflow-auto w-full">
                {productosFiltrados
                  .slice(0, 5)
                  .map(p => (
                    <div
                      key={p.ID_Producto}
                      onClick={() => {
                        setBusqueda(p.Nombre_Producto);
                        setMostrarSugerencias(false);
                        if (inputRef.current) inputRef.current.focus();
                      }}
                      className="px-4 py-2 text-sm text-red-700 hover:bg-red-100 cursor-pointer transition-all"
                    >
                      {p.Nombre_Producto}
                    </div>
                  ))}
                {productosFiltrados.length === 0 && (
                  <div className="px-4 py-2 text-sm text-gray-500 italic">Sin resultados</div>
                )}
              </div>
            )}
          </div>

          <button
            onClick={() => navigate("/agregar-producto")}
            className="bg-red-700 hover:bg-red-800 text-white shadow px-5 py-2 rounded-xl transition-all duration-300"
          >
            + Agregar Producto
          </button>
        </div>
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
              <button onClick={() => setMostrarDialogo(false)} className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded">
                Cancelar
              </button>
              <button onClick={eliminarProducto} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded">
                Sí, eliminar
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <motion.div
        className="bg-gradient-to-br from-red-100 to-white shadow-2xl rounded-3xl overflow-hidden border border-red-200"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="grid grid-cols-9 gap-2 bg-red-200 text-red-900 font-semibold text-sm px-4 py-3 border-b border-red-300 rounded-t-3xl">
          <div>ID</div>
          <div>Nombre</div>
          <div>Marca</div>
          <div>Proveedor</div>
          <div>Stock</div>
          <div>Precio Compra</div>
          <div>Caducidad</div>
          <div>Precio Venta</div>
          <div className="text-right">Acciones</div>
        </div>

        <div className="max-h-[500px] overflow-y-auto custom-scroll">
          <AnimatePresence>
            {productosFiltrados.map(prod => (
              <motion.div
                key={prod.ID_Producto}
                className="grid grid-cols-9 gap-2 px-4 py-4 text-sm items-center group transition-all duration-300 cursor-pointer rounded-xl mx-2 my-1"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                whileHover={{
                  scale: 1.02,
                  background: 'linear-gradient(to right, #ffe4e6, #fecaca)',
                  boxShadow: '0px 6px 20px rgba(255, 0, 0, 0.1)',
                }}
              >
                <div className="font-bold text-red-800">{prod.ID_Producto}</div>
                <div className="text-red-900">{prod.Nombre_Producto}</div>
                <div>{prod.Marca || 'N/A'}</div>
                <div>{prod.Proveedor || 'N/A'}</div>
                <div className="text-red-600">{prod.Stock_Disponible}</div>
                <div>${prod.Precio_Compra}</div>
                <div>{prod.Fecha_Caducidad ? new Date(prod.Fecha_Caducidad).toLocaleDateString() : 'Sin fecha'}</div>
                <div className="text-green-700 font-semibold">${prod.Precio_Venta}</div>
                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <motion.button
                    onClick={() => navigate('/agregar-producto', { state: { producto: prod } })}
                    className="px-4 py-2 text-white text-sm font-semibold rounded-full shadow-md bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaEdit className="inline mr-2" /> Editar
                  </motion.button>

                  <motion.button
                    onClick={() => confirmarEliminacion(prod)}
                    className="px-4 py-2 text-white text-sm font-semibold rounded-full shadow-md bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaTrash className="inline mr-2" /> Eliminar
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.section>
  );
}