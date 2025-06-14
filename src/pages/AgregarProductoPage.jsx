import React, { useState } from 'react';
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";

export default function AgregarProducto() {
  const [producto, setProducto] = useState({
    nombre: '',
    precioUnidadVenta: '',
    precioUnidadCompra: '',
    stock: '',
    proveedor: '',
    fechaCaducidad: ''
  });

  const handleChange = (e) => {
    setProducto({
      ...producto,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const nuevoProducto = { ...producto, id: Date.now() };
    console.log('Producto agregado:', nuevoProducto);
    alert('✅ Producto agregado correctamente');

    setProducto({
      nombre: '',
      precioUnidadVenta: '',
      precioUnidadCompra: '',
      stock: '',
      proveedor: '',
      fechaCaducidad: ''
    });
  };

  return (
    <div className="max-w-xl mx-auto py-10 px-4 font-sans">
      <h2 className="text-2xl font-bold text-center text-blue-900 mb-6">
        Agregar Producto
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <Label htmlFor="nombre">Nombre del Producto</Label>
          <Input
            id="nombre"
            name="nombre"
            value={producto.nombre}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="precioUnidadVenta">Precio Unidad Venta</Label>
          <Input
            id="precioUnidadVenta"
            name="precioUnidadVenta"
            type="number"
            value={producto.precioUnidadVenta}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="precioUnidadCompra">Precio Unidad Compra</Label>
          <Input
            id="precioUnidadCompra"
            name="precioUnidadCompra"
            type="number"
            value={producto.precioUnidadCompra}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="stock">Stock</Label>
          <Input
            id="stock"
            name="stock"
            type="number"
            value={producto.stock}
            onChange={handleChange}
            required
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
          Guardar Producto
        </Button>
      </form>
    </div>
  );
}
