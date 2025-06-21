import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";

export default function AgregarProveedorPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const proveedorEditado = location.state?.proveedor;

  const [proveedor, setProveedor] = useState({
    nombre_prov: '',
    Numero_prov: ''
  });

  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (proveedorEditado) {
      setProveedor({
        nombre_prov: proveedorEditado.nombre_prov ?? '',
        Numero_prov: proveedorEditado.Numero_prov ?? ''
      });
    }
  }, [proveedorEditado]);

  const handleChange = (e) => {
    setProveedor({ ...proveedor, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!proveedor.nombre_prov) {
      setErrorMsg('El nombre del proveedor es obligatorio.');
      return;
    }

    try {
      const url = proveedorEditado
        ? `http://localhost:3001/api/proveedores/${proveedorEditado.id_prov}`
        : 'http://localhost:3001/api/proveedores';

      const method = proveedorEditado ? axios.put : axios.post;
      const res = await method(url, proveedor);

      console.log('✅ Respuesta del servidor:', res.data);
      navigate('/proveedores');
    } catch (err) {
      console.error('❌ Error al guardar proveedor:', err);
      const msg = err.response?.data?.error || err.message;
      setErrorMsg(msg);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-4">
        {proveedorEditado ? 'Editar Proveedor' : 'Agregar Proveedor'}
      </h2>

      {errorMsg && <div className="bg-red-100 text-red-700 p-2 mb-4">{errorMsg}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="nombre_prov">Nombre del Proveedor</Label>
          <Input
            id="nombre_prov"
            name="nombre_prov"
            value={proveedor.nombre_prov}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="Numero_prov">Número de Contacto</Label>
          <Input
            id="Numero_prov"
            name="Numero_prov"
            value={proveedor.Numero_prov}
            onChange={handleChange}
          />
        </div>

        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded">
          Guardar
        </Button>
      </form>
    </div>
  );
}
