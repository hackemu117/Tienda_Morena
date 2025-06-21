import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";

export default function AgregarClientePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const clienteEditado = location.state?.cliente;

  const [cliente, setCliente] = useState({
    nombre_cli: '',
    Numero_cli: '',
    dir_cli: ''
  });

  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (clienteEditado) {
      setCliente({
        nombre_cli: clienteEditado.nombre_cli ?? '',
        Numero_cli: clienteEditado.Numero_cli ?? '',
        dir_cli: clienteEditado.dir_cli ?? ''
      });
    }
  }, [clienteEditado]);

  const handleChange = (e) => {
    setCliente({ ...cliente, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!cliente.nombre_cli.trim()) {
      setErrorMsg('El nombre del cliente es obligatorio.');
      return;
    }

    try {
      const url = clienteEditado
        ? `http://localhost:3001/api/clientes/${clienteEditado.id_cli}`
        : 'http://localhost:3001/api/clientes';

      const method = clienteEditado ? axios.put : axios.post;
      const res = await method(url, cliente);

      console.log('✅ Cliente guardado:', res.data);
      navigate('/clientes');
    } catch (err) {
      console.error('❌ Error al guardar cliente:', err);
      const msg = err.response?.data?.error || err.message;
      setErrorMsg(msg);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-4">
        {clienteEditado ? 'Editar Cliente' : 'Agregar Cliente'}
      </h2>

      {errorMsg && <div className="bg-red-100 text-red-700 p-2 mb-4">{errorMsg}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="nombre_cli">Nombre del Cliente</Label>
          <Input
            id="nombre_cli"
            name="nombre_cli"
            value={cliente.nombre_cli}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="Numero_cli">Número de Contacto</Label>
          <Input
            id="Numero_cli"
            name="Numero_cli"
            value={cliente.Numero_cli}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="dir_cli">Dirección</Label>
          <Input
            id="dir_cli"
            name="dir_cli"
            value={cliente.dir_cli}
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
