import React from 'react';
import { motion } from 'framer-motion';

export default function ProductoCard({
  id,
  nombre,
  precioUnidadVenta,
  precioUnidadCompra,
  stock,
  proveedor,
  fechaCaducidad,
  imagen
}) {
  const isLowStock = stock <= 5;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={{
        scale: 1.04,
        boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)",
      }}
      whileTap={{ scale: 0.98 }}
      className={`rounded-2xl overflow-hidden border-2 transition-all duration-300 ${
        isLowStock
          ? 'border-red-500 bg-red-100'
          : 'border-gray-200 bg-white'
      }`}
    >
      {imagen && (
        <motion.img
          src={imagen}
          alt={nombre}
          className="w-full h-48 object-cover"
          initial={{ scale: 1 }}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        />
      )}

      <div className="p-5 font-inter text-gray-800">
        <h3 className="text-xl font-bold text-blue-700 mb-2">{nombre}</h3>
        <p className="text-sm"><strong>ID:</strong> {id}</p>
        <p className="text-sm"><strong>Stock:</strong> {stock}</p>
        <p className="text-sm"><strong>Precio Venta:</strong> ${precioUnidadVenta}</p>
        <p className="text-sm"><strong>Precio Compra:</strong> ${precioUnidadCompra}</p>
        <p className="text-sm"><strong>Proveedor:</strong> {proveedor}</p>
        <p className="text-sm"><strong>Caducidad:</strong> {fechaCaducidad}</p>

        {isLowStock && (
          <p className="mt-2 text-red-700 font-semibold">⚠ Stock bajo</p>
        )}

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-4 w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition-all"
        >
          Ver Detalles
        </motion.button>
      </div>
    </motion.div>
  );
}
