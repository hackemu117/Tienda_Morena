import React from 'react';

export default function ProductoCard({
  id,
  nombre,
  precioUnidadVenta,
  precioUnidadCompra,
  stock,
  proveedor,
  fechaCaducidad
}) {
  const isLowStock = stock <= 5;

  return (
    <div style={{ 
      ...styles.card, 
      borderColor: isLowStock ? '#cc0000' : '#ccc', 
      backgroundColor: isLowStock ? '#ffe5e5' : '#fafafa' 
    }}>
      <h3>{nombre}</h3>
      <p><strong>ID:</strong> {id}</p>
      <p><strong>Stock:</strong> {stock}</p>
      <p><strong>Precio Venta:</strong> ${precioUnidadVenta}</p>
      <p><strong>Precio Compra:</strong> ${precioUnidadCompra}</p>
      <p><strong>Proveedor:</strong> {proveedor}</p>
      <p><strong>Caducidad:</strong> {fechaCaducidad}</p>
      {isLowStock && <p style={styles.lowStock}>⚠ Stock bajo</p>}
    </div>
  );
}

const styles = {
  card: {
    border: '2px solid',
    borderRadius: '8px',
    padding: '1rem',
    width: '260px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
    transition: 'all 0.3s ease'
  },
  lowStock: {
    color: '#cc0000',
    fontWeight: 'bold'
  }
};

