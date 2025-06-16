import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { motion } from 'framer-motion';

export default function AgregarProducto() {
  const location = useLocation();
  const productoEditado = location.state?.producto;

  const [producto, setProducto] = useState({
    id: '',
    nombre: '',
    precioUnidadVenta: '',
    precioUnidadCompra: '',
    stock: '',
    proveedor: '',
    fechaCaducidad: ''
  });

  useEffect(() => {
    if (productoEditado) {
      setProducto(productoEditado);
    }
  }, [productoEditado]);

  const handleChange = (e) => {
    setProducto({
      ...producto,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const nuevoProducto = productoEditado ? producto : { ...producto, id: Date.now() };

    alert(`✅ Producto ${productoEditado ? 'actualizado' : 'agregado'} correctamente`);
    console.log('Producto:', nuevoProducto);

    setProducto({
      id: '',
      nombre: '',
      precioUnidadVenta: '',
      precioUnidadCompra: '',
      stock: '',
      proveedor: '',
      fechaCaducidad: ''
    });
  };

  const campos = [
    { id: 'nombre', label: 'Nombre del Producto', type: 'text', placeholder: 'Ej. Arroz Blanco' },
    { id: 'precioUnidadVenta', label: 'Precio Unidad Venta (MXN)', type: 'number', placeholder: '0.00' },
    { id: 'precioUnidadCompra', label: 'Precio Unidad Compra (MXN)', type: 'number', placeholder: '0.00' },
    { id: 'stock', label: 'Stock', type: 'number', placeholder: 'Ej. 25' },
    { id: 'proveedor', label: 'Proveedor', type: 'text', placeholder: 'Ej. Granos del Norte' },
    { id: 'fechaCaducidad', label: 'Fecha de Caducidad', type: 'date' }
  ];

  return (
    <motion.div
      className="max-w-xl mx-auto py-10 px-4 font-sans"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h2
        className="text-2xl font-bold text-center text-blue-900 mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {productoEditado ? 'Editar Producto' : 'Agregar Producto'}
      </motion.h2>

      <motion.form
        onSubmit={handleSubmit}
        className="space-y-5 bg-white p-6 rounded-xl shadow-md border"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {campos.map((campo, i) => (
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
              type={campo.type}
              min={campo.type === 'number' ? '0' : undefined}
              step={campo.type === 'number' ? '0.01' : undefined}
              value={producto[campo.id]}
              onChange={handleChange}
              required
              placeholder={campo.placeholder || ''}
            />
          </motion.div>
        ))}

        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          <Button type="submit" className="w-full">
            {productoEditado ? 'Actualizar Producto' : 'Guardar Producto'}
          </Button>
        </motion.div>
      </motion.form>
    </motion.div>
  );
}
