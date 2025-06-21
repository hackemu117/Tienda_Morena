// src/components/InventarioTable.js (Corregido)

import React from 'react';
import { format, parseISO } from 'date-fns';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { Button } from './ui/button';

const InventarioTable = ({ productos, onEditar, onEliminar }) => {
  const hoy = new Date();

  const getEstadoProducto = (prod) => {
    const diasParaCaducar = prod.Fecha_Caducidad
      // <-- CAMBIO AQUÍ: Primero revisamos si la fecha existe
      ? (parseISO(prod.Fecha_Caducidad) - hoy) / (1000 * 60 * 60 * 24)
      : Infinity; // Si no hay fecha, no puede caducar

    if (prod.Stock_Disponible < 5 || (diasParaCaducar >= 0 && diasParaCaducar <= 7)) {
      let tooltip = '';
      if (prod.Stock_Disponible < 5) tooltip += 'Poco stock. ';
      if (diasParaCaducar >= 0 && diasParaCaducar <= 7) tooltip += 'Próximo a caducar.';
      return { critico: true, tooltip: tooltip.trim() };
    }
    
    // <-- CAMBIO AQUÍ: Estado crítico si no hay fecha de caducidad
    if (!prod.Fecha_Caducidad) {
        return { critico: true, tooltip: 'Fecha no disponible' };
    }

    return { critico: false, tooltip: 'En buen estado' };
  };

  if (productos.length === 0) {
    return <p className="text-center text-gray-500 py-8">No hay productos en el inventario.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marca</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio Venta</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Caducidad</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {productos.map((prod) => {
            const estado = getEstadoProducto(prod);
            const diasParaCaducar = prod.Fecha_Caducidad ? (parseISO(prod.Fecha_Caducidad) - hoy) / (1000 * 60 * 60 * 24) : null;

            return (
              <tr key={prod.ID_Producto} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span
                      className={`h-3 w-3 rounded-full ${estado.critico ? 'bg-red-500' : 'bg-green-500'}`}
                      title={estado.tooltip}
                    ></span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{prod.Nombre_Producto}</div>
                  <div className="text-sm text-gray-500">ID: {prod.ID_Producto}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{prod.Marca}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-semibold ${prod.Stock_Disponible < 5 ? 'text-red-600' : 'text-gray-900'}`}>
                        {prod.Stock_Disponible}
                    </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">${prod.Precio_Venta}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                    {/* <-- CAMBIO AQUÍ: Verificamos si la fecha existe antes de intentar formatearla */}
                    {prod.Fecha_Caducidad ? (
                        <span className={`text-sm ${(diasParaCaducar !== null && diasParaCaducar <= 7) ? 'text-red-600 font-semibold' : 'text-gray-700'}`}>
                            {format(parseISO(prod.Fecha_Caducidad), 'dd/MM/yyyy')}
                        </span>
                    ) : (
                        <span className="text-sm text-gray-500">N/A</span>
                    )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => onEditar(prod)}>
                    <FaEdit className="text-blue-600 h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => onEliminar(prod)}>
                    <FaTrash className="text-red-600 h-4 w-4" />
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default InventarioTable;