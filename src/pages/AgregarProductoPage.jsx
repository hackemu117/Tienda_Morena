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

  return (
    <motion.div
      className="max-w-xl mx-auto py-10 px-4 font-sans"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h2
        className="text-2xl font-bold text-center text-blue-900 mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {productoEditado ? 'Editar Producto' : 'Agregar Producto'}
      </motion.h2>

      <motion.form
        onSubmit={handleSubmit}
        className="space-y-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div>
          <Label htmlFor="nombre">Nombre del Producto</Label>
          <Input
            id="nombre"
            name="nombre"
            value={producto.nombre}
            onChange={handleChange}
            required
            placeholder="Ej. Arroz Blanco"
          />
        </div>

        <div>
          <Label htmlFor="precioUnidadVenta">Precio Unidad Venta (MXN)</Label>
          <Input
            id="precioUnidadVenta"
            name="precioUnidadVenta"
            type="number"
            min="0"
            step="0.01"
            value={producto.precioUnidadVenta}
            onChange={handleChange}
            required
            placeholder="0.00"
          />
        </div>

        <div>
          <Label htmlFor="precioUnidadCompra">Precio Unidad Compra (MXN)</Label>
          <Input
            id="precioUnidadCompra"
            name="precioUnidadCompra"
            type="number"
            min="0"
            step="0.01"
            value={producto.precioUnidadCompra}
            onChange={handleChange}
            required
            placeholder="0.00"
          />
        </div>

        <div>
          <Label htmlFor="stock">Stock</Label>
          <Input
            id="stock"
            name="stock"
            type="number"
            min="0"
            value={producto.stock}
            onChange={handleChange}
            required
            placeholder="Ej. 25"
          />
        </div>

        <div>
          <Label htmlFor="proveedor">Proveedor</Label>
          <Input
            id="proveedor"
            name="proveedor"
            value={producto.proveedor}
            onChange={handleChange}
            required
            placeholder="Ej. Granos del Norte"
          />
        </div>

        <div>
          <Label htmlFor="fechaCaducidad">Fecha de Caducidad</Label>
          <Input
            id="fechaCaducidad"
            name="fechaCaducidad"
            type="date"
            value={producto.fechaCaducidad}
            onChange={handleChange}
            required
          />
        </div>

        <Button type="submit" className="w-full">
          {productoEditado ? 'Actualizar Producto' : 'Guardar Producto'}
        </Button>
      </motion.form>
    </motion.div>
  );
}
