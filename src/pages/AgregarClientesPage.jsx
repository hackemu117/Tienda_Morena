import React, { useState } from 'react';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { motion } from 'framer-motion';

export default function AgregarClientePage() {
  const [cliente, setCliente] = useState({
    id: '',
    nombre: '',
    telefono: '',
    direccion: ''
  });

  const handleChange = (e) => {
    setCliente({
      ...cliente,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Cliente guardado:', cliente);
    alert('✅ Cliente guardado correctamente');
    setCliente({ id: '', nombre: '', telefono: '', direccion: '' });
  };

  return (
    <motion.div
      className="max-w-xl mx-auto py-10 px-4 font-sans"
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <motion.h2
        className="text-2xl font-bold text-center text-blue-900 mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        Agregar Cliente
      </motion.h2>

      <motion.form
        onSubmit={handleSubmit}
        className="space-y-5 bg-white p-6 rounded-xl shadow-md border"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {[{ id: 'id', label: 'ID' }, { id: 'nombre', label: 'Nombre' }, { id: 'telefono', label: 'Teléfono' }, { id: 'direccion', label: 'Dirección' }].map((campo, i) => (
          <motion.div
            key={campo.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Label htmlFor={campo.id}>{campo.label}</Label>
            <Input
              id={campo.id}
              name={campo.id}
              type="text"
              value={cliente[campo.id]}
              onChange={handleChange}
              required
            />
          </motion.div>
        ))}

        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          <Button type="submit" className="w-full">
            Guardar Cliente
          </Button>
        </motion.div>
      </motion.form>
    </motion.div>
  );
}
