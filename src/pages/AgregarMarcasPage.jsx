import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

export default function AgregarMarcasPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const marcaEditada = location.state?.marca || null;

  const [nombreMarca, setNombreMarca] = useState('');

  useEffect(() => {
    if (marcaEditada) {
      setNombreMarca(marcaEditada.Nombre_marca);
    } else if (id) {
      // Si entramos por ruta con :id pero sin location.state, hacemos fetch
      axios.get(`http://localhost:3001/api/marcas/${id}`)
        .then(res => {
          setNombreMarca(res.data.Nombre_marca);
        })
        .catch(err => {
          console.error('Error al cargar marca:', err);
          navigate('/marcas');
        });
    }
  }, [marcaEditada, id, navigate]);

  const handleGuardar = async () => {
    if (!nombreMarca.trim()) {
      alert('El nombre de la marca es obligatorio.');
      return;
    }

    try {
      if (marcaEditada || id) {
        // Actualizar
        await axios.put(`http://localhost:3001/api/marcas/${marcaEditada?.id_marca || id}`, {
          Nombre_marca: nombreMarca,
        });
      } else {
        // Crear nueva
        await axios.post('http://localhost:3001/api/marcas', {
          Nombre_marca: nombreMarca,
        });
      }

      navigate('/marcas');
    } catch (error) {
      console.error('Error al guardar la marca:', error);
      alert('Ocurrió un error al guardar la marca.');
    }
  };

  return (
    <motion.div
      className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-md border border-gray-200"
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold mb-6 text-red-700">
        {marcaEditada || id ? 'Editar Marca' : 'Agregar Marca'}
      </h2>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la marca:</label>
        <input
          type="text"
          value={nombreMarca}
          onChange={(e) => setNombreMarca(e.target.value)}
          className="w-full px-4 py-2 border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
          placeholder="Ej. Bimbo"
        />
      </div>

      <div className="flex justify-end gap-4 mt-6">
        <button
          onClick={() => navigate('/marcas')}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
        >
          Cancelar
        </button>
        <button
          onClick={handleGuardar}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Guardar
        </button>
      </div>
    </motion.div>
  );
}
