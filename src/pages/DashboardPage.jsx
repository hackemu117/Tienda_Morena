import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Alert } from '../components/ui/alert';

export default function DashboardPage() {
  const navigate = useNavigate();

  return (
    <motion.div
      className="max-w-4xl mx-auto px-4 py-10 text-center font-sans"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h2
        className="text-3xl font-bold text-blue-900 mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        ¡Bienvenido a Tienda La Moderna!
      </motion.h2>

      <motion.div
        className="flex flex-col gap-4 mb-10 text-left"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <Alert
          type="warning"
          title="¡Advertencia de Stock!"
          message="⚠️ Algunos productos tienen menos de 5 unidades en existencia."
        />
        <Alert
          type="danger"
          title="¡Alerta de Caducidad!"
          message="⏰ Algunos productos están por caducar pronto."
        />
      </motion.div>

      <motion.div
        className="flex justify-center gap-6 flex-wrap"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <Button onClick={() => navigate('/productos')}>
          Administrar Inventario
        </Button>
        <Button onClick={() => navigate('/ventas')} variant="secondary">
          Registrar Venta
        </Button>
      </motion.div>
    </motion.div>
  );
}
