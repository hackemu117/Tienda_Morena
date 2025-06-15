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
      <h2 className="text-2xl font-bold text-center text-blue-900 mb-6">
        {proveedorEditado ? 'Editar Proveedor' : 'Agregar Proveedor'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <Label htmlFor="id">ID</Label>
          <Input
            id="id"
            name="id"
            value={proveedor.id}
            onChange={handleChange}
            required
            disabled={proveedorEditado} // deshabilita el ID si se está editando
          />
        </div>

        <div>
          <Label htmlFor="nombre">Nombre</Label>
          <Input
            id="nombre"
            name="nombre"
            value={proveedor.nombre}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="empresa">Empresa</Label>
          <Input
            id="empresa"
            name="empresa"
            value={proveedor.empresa}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="telefono">Teléfono</Label>
          <Input
            id="telefono"
            name="telefono"
            value={proveedor.telefono}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="correo">Correo electrónico</Label>
          <Input
            id="correo"
            name="correo"
            type="email"
            value={proveedor.correo}
            onChange={handleChange}
            required
          />
        </div>

        <Button type="submit" className="w-full">
          {proveedorEditado ? 'Actualizar Proveedor' : 'Guardar Proveedor'}
        </Button>
      </form>
    </motion.div>
  );
}
