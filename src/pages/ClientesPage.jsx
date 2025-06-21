import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/ui/button';
import { FaTrash, FaEdit } from 'react-icons/fa';

export default function ClientesPage() {
  const [clientes, setClientes] = useState([]);
  const [clienteAEliminar, setClienteAEliminar] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [tipoMensaje, setTipoMensaje] = useState('success');
  const [busqueda, setBusqueda] = useState('');
  const [ordenCampo, setOrdenCampo] = useState('id_cli');
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:3001/api/clientes')
      .then(res => setClientes(res.data))
      .catch(err => console.error('❌ Error al obtener clientes:', err));
  }, []);

  const confirmarEliminacion = (cliente) => {
    setClienteAEliminar(cliente);
  };

  const cancelarEliminacion = () => {
    setClienteAEliminar(null);
  };

  const mostrarMensaje = (texto, tipo = 'success') => {
    setMensaje(texto);
    setTipoMensaje(tipo);
    setTimeout(() => setMensaje(''), 3000);
  };

  const eliminarCliente = async () => {
    try {
      await axios.delete(`http://localhost:3001/api/clientes/${clienteAEliminar.id_cli}`);
      setClientes(prev => prev.filter(c => c.id_cli !== clienteAEliminar.id_cli));
      mostrarMensaje(`✅ Cliente "${clienteAEliminar.nombre_cli}" eliminado correctamente`);
      setClienteAEliminar(null);
    } catch (err) {
      if (err.response?.status === 409) {
        mostrarMensaje('⚠️ No se puede eliminar el cliente, tiene ventas asociadas.', 'error');
      } else {
        console.error('❌ Error al eliminar cliente:', err);
        mostrarMensaje('❌ Ocurrió un error al eliminar el cliente.', 'error');
      }
    }
  };

  const clientesOrdenados = [...clientes].sort((a, b) => {
    if (ordenCampo === 'id_cli') return a.id_cli - b.id_cli;
    return a.nombre_cli.localeCompare(b.nombre_cli);
  });

  const clientesFiltrados = clientesOrdenados.filter(c =>
    c.nombre_cli.toLowerCase().includes(busqueda.toLowerCase())
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
          className="text-3xl font-bold text-purple-900"
        >
          Lista de Clientes
        </motion.h2>

        <div className="flex items-center flex-wrap gap-3 w-full md:w-auto">
          <select
            value={ordenCampo}
            onChange={(e) => setOrdenCampo(e.target.value)}
            className="bg-white border border-purple-300 text-purple-700 px-4 py-2 rounded-xl shadow hover:border-purple-500 transition-all duration-200"
          >
            <option value="id_cli">Ordenar por ID</option>
            <option value="nombre_cli">Ordenar por Nombre</option>
          </select>

          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              placeholder="Buscar cliente..."
              value={busqueda}
              onChange={(e) => {
                setBusqueda(e.target.value);
                setMostrarSugerencias(true);
              }}
              className="px-4 py-2 border border-purple-300 rounded-xl shadow text-purple-800 placeholder:text-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            {busqueda && mostrarSugerencias && clientesFiltrados.length > 0 && (
              <div className="absolute z-10 mt-1 bg-white border border-purple-200 rounded-xl shadow-md max-h-40 overflow-auto w-full">
                {clientesFiltrados.slice(0, 5).map((c) => (
                  <div
                    key={c.id_cli}
                    onClick={() => {
                      setBusqueda(c.nombre_cli);
                      setMostrarSugerencias(false);
                      if (inputRef.current) inputRef.current.focus();
                    }}
                    className="px-4 py-2 text-sm text-purple-800 hover:bg-purple-100 cursor-pointer transition-all"
                  >
                    {c.nombre_cli}
                  </div>
                ))}
              </div>
            )}
          </div>

          <Button
            onClick={() => navigate("/agregar-cliente")}
            className="bg-purple-800 hover:bg-purple-900 text-white shadow-lg px-6 py-3 text-sm font-medium rounded-xl transition-all duration-300"
          >
            + Agregar Cliente
          </Button>
        </div>
      </div>

      <motion.div
        className="bg-gradient-to-br from-purple-100 to-white shadow-2xl rounded-3xl overflow-hidden border border-purple-200"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="grid grid-cols-5 gap-2 bg-purple-200 text-purple-900 font-semibold text-sm px-4 py-3 border-b border-purple-300 rounded-t-3xl">
          <div>ID</div>
          <div>Nombre</div>
          <div>Teléfono</div>
          <div>Dirección</div>
          <div className="text-right">Acciones</div>
        </div>

        <div className="max-h-[500px] overflow-y-auto custom-scroll">
          <AnimatePresence>
            {clientesFiltrados.map(cliente => (
              <motion.div
                key={cliente.id_cli}
                className="grid grid-cols-5 gap-2 px-4 py-4 text-sm items-center group transition-all duration-300 cursor-pointer rounded-xl mx-2 my-1"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                whileHover={{
                  scale: 1.02,
                  background: 'linear-gradient(to right, #ede9fe, #ddd6fe)',
                  boxShadow: '0px 6px 20px rgba(128, 0, 128, 0.1)',
                }}
              >
                <div className="font-bold text-purple-800">{cliente.id_cli}</div>
                <div className="text-purple-900">{cliente.nombre_cli}</div>
                <div>{cliente.Numero_cli || 'Sin teléfono'}</div>
                <div>{cliente.dir_cli || 'Sin dirección'}</div>
                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <motion.button
                    onClick={() => navigate('/agregar-cliente', { state: { cliente } })}
                    className="px-4 py-2 text-white text-sm font-semibold rounded-full shadow-md bg-gradient-to-r from-indigo-400 to-indigo-600 hover:from-indigo-500 hover:to-indigo-700 transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaEdit className="inline mr-2" /> Editar
                  </motion.button>

                  <motion.button
                    onClick={() => confirmarEliminacion(cliente)}
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
        {clienteAEliminar && (
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
              <h3 className="text-xl font-semibold text-red-700 mb-4">¿Eliminar cliente?</h3>
              <p className="text-gray-700 mb-6">
                Estás por eliminar a <strong>{clienteAEliminar.nombre_cli}</strong>. Esta acción no se puede deshacer.
              </p>
              <div className="flex justify-center gap-4">
                <Button className="bg-gray-300 hover:bg-gray-400 text-black" onClick={cancelarEliminacion}>
                  Cancelar
                </Button>
                <Button className="bg-red-600 hover:bg-red-700" onClick={eliminarCliente}>
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
            className={`fixed top-5 right-5 px-5 py-3 rounded-xl shadow-lg z-50 ${
              tipoMensaje === 'success'
                ? 'bg-green-100 border border-green-400 text-green-800'
                : 'bg-red-100 border border-red-400 text-red-800'
            }`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {mensaje}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}