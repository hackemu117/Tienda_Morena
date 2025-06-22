import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function AgregarProveedorPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const proveedorEditado = location.state?.proveedor;

  const [proveedor, setProveedor] = useState({
    nombre_prov: '',
    Numero_prov: ''
  });

  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (proveedorEditado) {
      setProveedor({
        nombre_prov: proveedorEditado.nombre_prov ?? '',
        Numero_prov: proveedorEditado.Numero_prov ?? ''
      });
    }
  }, [proveedorEditado]);

  const handleChange = (e) => {
    setProveedor({ ...proveedor, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!proveedor.nombre_prov.trim()) {
      setErrorMsg('El nombre del proveedor es obligatorio.');
      return;
    }

    try {
      const url = proveedorEditado
        ? `http://localhost:3001/api/proveedores/${proveedorEditado.id_prov}`
        : 'http://localhost:3001/api/proveedores';

      const method = proveedorEditado ? axios.put : axios.post;
      const res = await method(url, proveedor);

      console.log('✅ Respuesta del servidor:', res.data);
      navigate('/proveedores');
    } catch (err) {
      console.error('❌ Error al guardar proveedor:', err);
      const msg = err.response?.data?.error || err.message;
      setErrorMsg(msg);
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
        {proveedorEditado ? 'Editar Proveedor' : 'Agregar Proveedor'}
      </h2>

      {errorMsg && (
        <div className="bg-red-100 text-red-700 p-2 mb-4 rounded-lg border border-red-300">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="nombre_prov" className="block text-sm font-medium text-gray-700 mb-1">
            Nombre del Proveedor
          </label>
          <input
            id="nombre_prov"
            name="nombre_prov"
            value={proveedor.nombre_prov}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
            placeholder="Ej. Comercializadora X"
            required
          />
        </div>

        <div>
          <label htmlFor="Numero_prov" className="block text-sm font-medium text-gray-700 mb-1">
            Número de Contacto
          </label>
          <input
            id="Numero_prov"
            name="Numero_prov"
            value={proveedor.Numero_prov}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
            placeholder="Ej. 5512345678"
          />
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <button
            type="button"
            onClick={() => navigate('/proveedores')}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Guardar
          </button>
        </div>
      </form>
    </motion.div>
  );
}
