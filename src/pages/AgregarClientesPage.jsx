import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function AgregarClientePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const clienteEditado = location.state?.cliente;

  const [cliente, setCliente] = useState({
    nombre_cli: '',
    Numero_cli: '',
    dir_cli: ''
  });

  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (clienteEditado) {
      setCliente({
        nombre_cli: clienteEditado.nombre_cli ?? '',
        Numero_cli: clienteEditado.Numero_cli ?? '',
        dir_cli: clienteEditado.dir_cli ?? ''
      });
    }
  }, [clienteEditado]);

  const handleChange = (e) => {
    setCliente({ ...cliente, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!cliente.nombre_cli.trim()) {
      setErrorMsg('El nombre del cliente es obligatorio.');
      return;
    }

    try {
      const url = clienteEditado
        ? `http://localhost:3001/api/clientes/${clienteEditado.id_cli}`
        : 'http://localhost:3001/api/clientes';

      const method = clienteEditado ? axios.put : axios.post;
      const res = await method(url, cliente);

      console.log('✅ Cliente guardado:', res.data);
      navigate('/clientes');
    } catch (err) {
      console.error('❌ Error al guardar cliente:', err);
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
        {clienteEditado ? 'Editar Cliente' : 'Agregar Cliente'}
      </h2>

      {errorMsg && (
        <div className="bg-red-100 text-red-700 p-2 mb-4 rounded-lg border border-red-300">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="nombre_cli" className="block text-sm font-medium text-gray-700 mb-1">
            Nombre del Cliente
          </label>
          <input
            id="nombre_cli"
            name="nombre_cli"
            value={cliente.nombre_cli}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
            placeholder="Ej. Juan Pérez"
            required
          />
        </div>

        <div>
          <label htmlFor="Numero_cli" className="block text-sm font-medium text-gray-700 mb-1">
            Número de Contacto
          </label>
          <input
            id="Numero_cli"
            name="Numero_cli"
            value={cliente.Numero_cli}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
            placeholder="Ej. 5551234567"
          />
        </div>

        <div>
          <label htmlFor="dir_cli" className="block text-sm font-medium text-gray-700 mb-1">
            Dirección
          </label>
          <input
            id="dir_cli"
            name="dir_cli"
            value={cliente.dir_cli}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
            placeholder="Ej. Av. Siempre Viva 742"
          />
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <button
            type="button"
            onClick={() => navigate('/clientes')}
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
