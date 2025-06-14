import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';

export default function AgregarProveedoresPage() {
  const location = useLocation();
  const proveedorEditado = location.state?.proveedor;

  const [formData, setFormData] = useState({
    id: '',
    nombre: '',
    empresa: '',
    telefono: '',
    correo: ''
  });

  useEffect(() => {
    if (proveedorEditado) {
      setFormData(proveedorEditado);
    }
  }, [proveedorEditado]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (proveedorEditado) {
      alert('✅ Proveedor actualizado correctamente');
    } else {
      alert('✅ Proveedor agregado correctamente');
    }

    // Reset form
    setFormData({
      id: '',
      nombre: '',
      empresa: '',
      telefono: '',
      correo: ''
    });
  };

  return (
    <div className="max-w-md mx-auto py-10 px-4 font-sans">
      <h2 className="text-2xl font-bold text-center text-blue-900 mb-6">
        {proveedorEditado ? 'Editar Proveedor' : 'Agregar Proveedor'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="id">ID</Label>
          <Input
            id="id"
            name="id"
            type="text"
            value={formData.id}
            onChange={handleChange}
            required
            disabled={!!proveedorEditado}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="nombre">Nombre</Label>
          <Input
            id="nombre"
            name="nombre"
            type="text"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="empresa">Empresa</Label>
          <Input
            id="empresa"
            name="empresa"
            type="text"
            value={formData.empresa}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="telefono">Teléfono</Label>
          <Input
            id="telefono"
            name="telefono"
            type="tel"
            value={formData.telefono}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="correo">Correo electrónico</Label>
          <Input
            id="correo"
            name="correo"
            type="email"
            value={formData.correo}
            onChange={handleChange}
            required
          />
        </div>

        <Button type="submit" className="w-full mt-4">
          {proveedorEditado ? 'Actualizar' : 'Guardar'}
        </Button>
      </form>
    </div>
  );
}
