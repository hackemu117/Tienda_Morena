import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/ui/button';

export default function ClientesPage() {
  const navigate = useNavigate();

  const clientes = [
    {
      id: 1,
      nombre: 'Juan Pérez',
      telefono: '555-123-4567',
      direccion: 'Av. Reforma 123, CDMX'
    },
    {
      id: 2,
      nombre: 'María López',
      telefono: '555-987-6543',
      direccion: 'Calle Falsa 456, Guadalajara'
    }
  ];

  return (
    <div className="p-6 font-sans max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex justify-between items-center mb-6"
      >
        <h2 className="text-2xl font-bold text-blue-900">Clientes Registrados</h2>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={() => navigate("/agregar-cliente")}
            className="bg-blue-800 hover:bg-blue-900 text-white shadow-lg px-6 py-3 text-base font-medium rounded-xl transition-all duration-300"
          >
            + Agregar Cliente
          </Button>
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {clientes.map((cliente) => (
            <motion.div
              key={cliente.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.02 }}
              className="border border-gray-200 shadow-md hover:shadow-lg rounded-2xl p-5 bg-white relative transition-all"
            >
              <h3 className="text-xl font-semibold text-blue-800 mb-2">{cliente.nombre}</h3>
              <p className="text-sm text-gray-700"><strong>ID:</strong> {cliente.id}</p>
              <p className="text-sm text-gray-700"><strong>Teléfono:</strong> {cliente.telefono}</p>
              <p className="text-sm text-gray-700"><strong>Dirección:</strong> {cliente.direccion}</p>

              <div className="flex justify-between mt-6">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="destructive"
                    className="text-white bg-red-600 hover:bg-red-700"
                  >
                    🗑 Eliminar
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="outline"
                    className="text-white bg-blue-600 hover:bg-blue-700"
                    onClick={() => navigate('/agregar-cliente', { state: { cliente } })}
                  >
                    📝 Editar
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
