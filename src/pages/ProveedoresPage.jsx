import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTrash, FaEdit } from 'react-icons/fa';

export default function ProveedoresPage() {
  const [proveedores, setProveedores] = useState([]);
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState(null);
  const [mostrarDialogo, setMostrarDialogo] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [tipoMensaje, setTipoMensaje] = useState('exito'); // exito o error
  const [busqueda, setBusqueda] = useState('');
  const [ordenCampo, setOrdenCampo] = useState('id_prov');
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:3001/api/proveedores')
      .then(res => setProveedores(res.data))
      .catch(err => console.error('Error al obtener proveedores:', err));
  }, []);

  const confirmarEliminacion = (prov) => {
    setProveedorSeleccionado(prov);
    setMostrarDialogo(true);
  };

  const eliminarProveedor = async () => {
    try {
      await axios.delete(`http://localhost:3001/api/proveedores/${proveedorSeleccionado.id_prov}`);
      setProveedores((prev) => prev.filter((p) => p.id_prov !== proveedorSeleccionado.id_prov));
      setMostrarDialogo(false);
      mostrarMensaje(`Proveedor "${proveedorSeleccionado.nombre_prov}" eliminado correctamente`, 'exito');
    } catch (err) {
      console.error('Error al eliminar proveedor:', err);
      setMostrarDialogo(false);
      mostrarMensaje(
        `No se pudo eliminar "${proveedorSeleccionado.nombre_prov}" porque está asociado a productos.`,
        'error'
      );
    }
  };

  const mostrarMensaje = (texto, tipo = 'exito') => {
    setMensaje(texto);
    setTipoMensaje(tipo);
    setTimeout(() => setMensaje(''), 3500);
  };

  const proveedoresOrdenados = [...proveedores].sort((a, b) => {
    if (ordenCampo === 'id_prov') return a.id_prov - b.id_prov;
    return a.nombre_prov.localeCompare(b.nombre_prov);
  });

  const proveedoresFiltrados = proveedoresOrdenados.filter(p =>
    p.nombre_prov.toLowerCase().includes(busqueda.toLowerCase())
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
          className="text-3xl font-bold text-blue-900"
        >
          Lista de Proveedores
        </motion.h2>

        <div className="flex items-center flex-wrap gap-3 w-full md:w-auto">
          <select
            value={ordenCampo}
            onChange={(e) => setOrdenCampo(e.target.value)}
            className="bg-white border border-blue-300 text-blue-700 px-4 py-2 rounded-xl shadow hover:border-blue-500 transition-all duration-200"
          >
            <option value="id_prov">Ordenar por ID</option>
            <option value="nombre_prov">Ordenar por Nombre</option>
          </select>
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              placeholder="Buscar proveedor..."
              value={busqueda}
              onChange={(e) => {
                setBusqueda(e.target.value);
                setMostrarSugerencias(true);
              }}
              className="px-4 py-2 border border-blue-300 rounded-xl shadow text-blue-800 placeholder:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {busqueda && mostrarSugerencias && proveedoresFiltrados.length > 0 && (
              <div className="absolute z-10 mt-1 bg-white border border-blue-200 rounded-xl shadow-md max-h-40 overflow-auto w-full">
                {proveedoresFiltrados.slice(0, 5).map((p) => (
                  <div
                    key={p.id_prov}
                    onClick={() => {
                      setBusqueda(p.nombre_prov);
                      setMostrarSugerencias(false);
                      if (inputRef.current) inputRef.current.focus();
                    }}
                    className="px-4 py-2 text-sm text-blue-800 hover:bg-blue-100 cursor-pointer transition-all"
                  >
                    {p.nombre_prov}
                  </div>
                ))}
              </div>
            )}
          </div>

          <Button
            onClick={() => navigate('/agregar-proveedor')}
            className="bg-blue-800 hover:bg-blue-900 text-white shadow-lg px-6 py-3 text-sm font-medium rounded-xl transition-all duration-300"
          >
            + Agregar Proveedor
          </Button>
        </div>
      </div>

      <motion.div
        className="bg-gradient-to-br from-blue-100 to-white shadow-2xl rounded-3xl overflow-hidden border border-blue-200"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="grid grid-cols-4 gap-2 bg-blue-200 text-blue-900 font-semibold text-sm px-4 py-3 border-b border-blue-300 rounded-t-3xl">
          <div>ID</div>
          <div>Nombre</div>
          <div>Teléfono</div>
          <div className="text-right">Acciones</div>
        </div>

        <div className="max-h-[500px] overflow-y-auto custom-scroll">
          <AnimatePresence>
            {proveedoresFiltrados.map(prov => (
              <motion.div
                key={prov.id_prov}
                className="grid grid-cols-4 gap-2 px-4 py-4 text-sm items-center group transition-all duration-300 cursor-pointer rounded-xl mx-2 my-1"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                whileHover={{
                  scale: 1.02,
                  background: 'linear-gradient(to right, #e0f2fe, #bae6fd)',
                  boxShadow: '0px 6px 20px rgba(0, 0, 255, 0.1)',
                }}
              >
                <div className="font-bold text-blue-800">{prov.id_prov}</div>
                <div className="text-blue-900">{prov.nombre_prov}</div>
                <div>{prov.Numero_prov || 'Sin teléfono'}</div>
                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <motion.button
                    onClick={() => navigate('/agregar-proveedor', { state: { proveedor: prov } })}
                    className="px-4 py-2 text-white text-sm font-semibold rounded-full shadow-md bg-gradient-to-r from-blue-300 to-blue-600 hover:from-blue-500 hover:to-blue-700 transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaEdit className="inline mr-2" /> Editar
                  </motion.button>

                  <motion.button
                    onClick={() => confirmarEliminacion(prov)}
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

      <AnimatePresence>
        {mostrarDialogo && proveedorSeleccionado && (
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
              <h3 className="text-xl font-semibold text-red-700 mb-4">¿Eliminar proveedor?</h3>
              <p className="text-gray-700 mb-6">
                Estás por eliminar <strong>{proveedorSeleccionado.nombre_prov}</strong>. Esta acción no se puede deshacer.
              </p>
              <div className="flex justify-center gap-4">
                <Button className="bg-gray-300 hover:bg-gray-400 text-black" onClick={() => setMostrarDialogo(false)}>
                  Cancelar
                </Button>
                <Button className="bg-red-600 hover:bg-red-700" onClick={eliminarProveedor}>
                  Confirmar
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {mensaje && (
          <motion.div
            className={`absolute top-4 right-4 px-4 py-2 rounded-xl shadow-md border 
              ${tipoMensaje === 'exito'
                ? 'bg-green-100 border-green-400 text-green-800'
                : 'bg-red-100 border-red-400 text-red-800'}`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {mensaje}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
