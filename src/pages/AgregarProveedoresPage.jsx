import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { motion } from 'framer-motion';

export default function AgregarProveedoresPage() {
  const location = useLocation();
  const proveedorEditado = location.state?.proveedor;

  const [proveedor, setProveedor] = useState({
    id: '',
    nombre: '',
    empresa: '',
    telefono: '',
    correo: ''
  });

  useEffect(() => {
    if (proveedorEditado) {
      setProveedor(proveedorEditado);
    }
  }, [proveedorEditado]);

  const handleChange = (e) => {
    setProveedor({
      ...proveedor,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Proveedor guardado:', proveedor);
    alert('✅ Proveedor guardado correctamente');
    setProveedor({
      id: '',
      nombre: '',
      empresa: '',
      telefono: '',
      correo: ''
    });
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
        {proveedorEditado ? 'Editar Proveedor' : 'Agregar Proveedor'}
      </motion.h2>

      <motion.form
        onSubmit={handleSubmit}
        className="space-y-5 bg-white p-6 rounded-xl shadow-md border"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {['id', 'nombre', 'empresa', 'telefono', 'correo'].map((campo, i) => (
          <motion.div
            key={campo}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Label htmlFor={campo}>
              {campo === 'correo' ? 'Correo electrónico' : campo.charAt(0).toUpperCase() + campo.slice(1)}
            </Label>
            <Input
              id={campo}
              name={campo}
              type={campo === 'correo' ? 'email' : 'text'}
              value={proveedor[campo]}
              onChange={handleChange}
              required
              disabled={campo === 'id' && proveedorEditado}
            />
          </motion.div>
        ))}

        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          <Button type="submit" className="w-full">
            {proveedorEditado ? 'Actualizar Proveedor' : 'Guardar Proveedor'}
          </Button>
        </motion.div>
      </motion.form>
    </motion.div>
  );
}