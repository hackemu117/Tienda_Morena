import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";

export default function AgregarProductoPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const productoEditado = location.state?.producto;

  const [producto, setProducto] = useState({
    nombre_prod: '',
    precio_ven_prod: '',
    precio_com_prod: '',
    stock_prod: '',
    id_prov_prod: '',
    id_marca_prod: '',
    fecha_cad_prod: ''
  });
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (productoEditado) {
      setProducto({
        nombre_prod: productoEditado.Nombre_Producto ?? '',
        precio_ven_prod: productoEditado.Precio_Venta ?? '',
        precio_com_prod: productoEditado.Precio_Compra ?? '',
        stock_prod: productoEditado.Stock_Disponible ?? '',
        id_prov_prod: productoEditado.ID_Proveedor ?? '',
        id_marca_prod: productoEditado.ID_Marca ?? '',
        fecha_cad_prod: productoEditado.Fecha_Caducidad?.substring(0,10) ?? ''
      });
    }
  }, [productoEditado]);

  const campos = [
    { id: 'nombre_prod', label: 'Nombre', type: 'text', placeholder: 'Ej. Arroz' },
    { id: 'precio_ven_prod', label: 'Precio Venta', type: 'number', placeholder: '22.50' },
    { id: 'precio_com_prod', label: 'Precio Compra', type: 'number', placeholder: '18.00' },
    { id: 'stock_prod', label: 'Stock', type: 'number', placeholder: '100' },
    { id: 'id_prov_prod', label: 'ID Proveedor', type: 'number', placeholder: '1' },
    { id: 'id_marca_prod', label: 'ID Marca', type: 'number', placeholder: '2' },
    { id: 'fecha_cad_prod', label: 'Fecha Caducidad', type: 'date' }
  ];

  const handleChange = (e) => setProducto({ ...producto, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    // Validación básica
    if (!producto.nombre_prod || !producto.stock_prod || !producto.precio_ven_prod || !producto.precio_com_prod) {
      setErrorMsg('Completa Nombre, Stock y Precios');
      return;
    }

    const payload = {
      ...producto,
      stock_prod: parseInt(producto.stock_prod),
      precio_ven_prod: parseFloat(producto.precio_ven_prod),
      precio_com_prod: parseFloat(producto.precio_com_prod),
      id_prov_prod: producto.id_prov_prod ? parseInt(producto.id_prov_prod) : null,
      id_marca_prod: producto.id_marca_prod ? parseInt(producto.id_marca_prod) : null,
      fecha_cad_prod: producto.fecha_cad_prod || null
    };

    try {
      const url = productoEditado
        ? `http://localhost:3001/api/productos/${productoEditado.ID_Producto}`
        : 'http://localhost:3001/api/productos';

      const method = productoEditado ? axios.put : axios.post;
      const res = await method(url, payload);

      console.log('✅ Respuesta del servidor:', res.data);
      navigate('/productos');
    } catch (err) {
      console.error('❌ Error en petición:', err);
      const msg = err.response?.data?.error || err.message;
      setErrorMsg(msg);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">
        {productoEditado ? 'Editar Producto' : 'Agregar Producto'}
      </h2>

      {errorMsg && <div className="bg-red-100 text-red-700 p-2 mb-4">{errorMsg}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {campos.map(c => (
          <div key={c.id}>
            <Label htmlFor={c.id}>{c.label}</Label>
            <Input
              id={c.id}
              name={c.id}
              type={c.type}
              placeholder={c.placeholder}
              value={producto[c.id]}
              onChange={handleChange}
              required={['nombre_prod','precio_ven_prod','precio_com_prod','stock_prod'].includes(c.id)}
            />
          </div>
        ))}

        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded">
          Guardar
        </Button>
      </form>
    </div>
  );
}
