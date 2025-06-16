import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/ui/button';

export default function ClientesPage() {
  const navigate = useNavigate();

  const [clientes, setClientes] = useState([
    { id: 1, nombre: 'Juan Pérez', telefono: '555-123-4567', direccion: 'Av. Reforma 123, CDMX' },
    { id: 2, nombre: 'María López', telefono: '555-987-6543', direccion: 'Calle Falsa 456, Guadalajara' }
  ]);

  const [clienteAEliminar, setClienteAEliminar] = useState(null);

  const confirmarEliminacion = (cliente) => {
    setClienteAEliminar(cliente);
  };

  const cancelarEliminacion = () => {
    setClienteAEliminar(null);
  };

  const eliminarCliente = () => {
    setClientes(prev => prev.filter(c => c.id !== clienteAEliminar.id));
    setClienteAEliminar(null);
  };

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
                    onClick={() => confirmarEliminacion(cliente)}
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

      {/* Modal de Confirmación */}
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
              <p className="text-gray-700 mb-6">Estás por eliminar a <strong>{clienteAEliminar.nombre}</strong>. Esta acción no se puede deshacer.</p>
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
    </div>
  );
}