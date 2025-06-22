import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTrash, FaEdit } from 'react-icons/fa';

export default function MarcasPage() {
  const [marcas, setMarcas] = useState([]);
  const [marcaSeleccionada, setMarcaSeleccionada] = useState(null);
  const [mostrarDialogo, setMostrarDialogo] = useState(false);
  const [ordenCampo, setOrdenCampo] = useState("id_marca");
  const [busqueda, setBusqueda] = useState("");
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const ordenarMarcas = (campo, data) => {
    const copia = [...data];
    copia.sort((a, b) => (a[campo] || "").toString().localeCompare((b[campo] || "").toString()));
    return copia;
  };

  useEffect(() => {
    axios.get('http://localhost:3001/api/marcas')
      .then(res => {
        const ordenadas = ordenarMarcas(ordenCampo, res.data);
        setMarcas(ordenadas);
      })
      .catch(err => console.error('Error al obtener marcas:', err));
  }, [ordenCampo]);

  const confirmarEliminacion = (marca) => {
    setMarcaSeleccionada(marca);
    setMostrarDialogo(true);
  };

  const eliminarMarca = async () => {
    if (!marcaSeleccionada) return;
    try {
      await axios.delete(`http://localhost:3001/api/marcas/${marcaSeleccionada.id_marca}`);
      setMarcas(prev => prev.filter(m => m.id_marca !== marcaSeleccionada.id_marca));
      setMostrarDialogo(false);
    } catch (error) {
      console.error('Error al eliminar marca:', error);
      alert('No se puede eliminar la marca. Está relacionada con uno o más productos.');
    }
  };

  const opcionesOrden = [
    { label: "ID", value: "id_marca" },
    { label: "Nombre", value: "Nombre_marca" },
  ];

  const marcasFiltradas = marcas.filter(m =>
    (m.Nombre_marca || "").toLowerCase().includes(busqueda.toLowerCase())
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
          className="text-3xl font-bold text-green-700"
        >
          Lista de Marcas
        </motion.h2>

        <div className="flex items-center flex-wrap gap-3 w-full md:w-auto">
          <select
            value={ordenCampo}
            onChange={(e) => setOrdenCampo(e.target.value)}
            className="bg-white border border-green-300 text-green-700 px-4 py-2 rounded-xl shadow"
          >
            {opcionesOrden.map(op => (
              <option key={op.value} value={op.value}>{`Ordenar por ${op.label}`}</option>
            ))}
          </select>

          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              placeholder="Buscar marca..."
              value={busqueda}
              onChange={(e) => {
                setBusqueda(e.target.value);
                setMostrarSugerencias(true);
              }}
              className="px-4 py-2 border border-green-300 rounded-xl shadow text-green-700 placeholder:text-green-400 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            {busqueda && mostrarSugerencias && marcasFiltradas.length > 0 && (
              <div className="absolute z-10 mt-1 bg-white border border-green-200 rounded-xl shadow-md max-h-40 overflow-auto w-full">
                {marcasFiltradas.slice(0, 5).map(m => (
                  <div
                    key={m.id_marca}
                    onClick={() => {
                      setBusqueda(m.Nombre_marca);
                      setMostrarSugerencias(false);
                      if (inputRef.current) inputRef.current.focus();
                    }}
                    className="px-4 py-2 text-sm text-green-700 hover:bg-green-100 cursor-pointer"
                  >
                    {m.Nombre_marca}
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => navigate("/agregar-marca")}
            className="bg-green-700 hover:bg-green-800 text-white shadow px-5 py-2 rounded-xl transition-all"
          >
            + Agregar Marca
          </button>
        </div>
      </div>

      {mostrarDialogo && marcaSeleccionada && (
        <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-white rounded-xl shadow-lg p-6 w-[90%] max-w-md text-center"
          >
            <h3 className="text-lg font-bold text-green-700 mb-2">¿Eliminar marca?</h3>
            <p className="text-sm text-gray-700 mb-4">
              Estás a punto de eliminar <strong>{marcaSeleccionada.Nombre_marca}</strong> (ID: {marcaSeleccionada.id_marca}). ¿Deseas continuar?
            </p>
            <div className="flex justify-center gap-4">
              <button onClick={() => setMostrarDialogo(false)} className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded">
                Cancelar
              </button>
              <button onClick={eliminarMarca} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded">
                Sí, eliminar
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <motion.div
        className="bg-gradient-to-br from-green-100 to-white shadow-2xl rounded-3xl overflow-hidden border border-green-200"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="grid grid-cols-3 gap-2 bg-green-100 text-green-800 font-semibold text-sm px-4 py-3 border-b border-green-300 rounded-t-3xl">
          <div>ID</div>
          <div>Nombre</div>
          <div className="text-right">Acciones</div>
        </div>

        <div className="max-h-[500px] overflow-y-auto custom-scroll">
          <AnimatePresence>
            {marcasFiltradas.map(marca => (
              <motion.div
                key={marca.id_marca}
                className="grid grid-cols-3 gap-2 px-4 py-4 text-sm items-center group transition-all duration-300 cursor-pointer rounded-xl mx-2 my-1"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                whileHover={{
                  scale: 1.02,
                  background: 'linear-gradient(to right, #d1fae5, #bbf7d0)',
                  boxShadow: '0px 6px 20px rgba(34, 197, 94, 0.15)',
                }}
              >
                <div className="font-bold text-green-800">{marca.id_marca}</div>
                <div className="text-green-900">{marca.Nombre_marca}</div>
                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <motion.button
                    onClick={() => navigate('/agregar-marca', { state: { marca } })}
                    className="px-4 py-2 text-white text-sm font-semibold rounded-full bg-green-500 hover:bg-green-600"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaEdit className="inline mr-2" /> Editar
                  </motion.button>
                  <motion.button
                    onClick={() => confirmarEliminacion(marca)}
                    className="px-4 py-2 text-white text-sm font-semibold rounded-full bg-red-600 hover:bg-red-700"
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
