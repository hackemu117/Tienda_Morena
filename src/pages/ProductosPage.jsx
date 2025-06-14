import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductoCard from '../components/ProductoCard'; // ✅ Import correcto

export default function ProductosPage() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const datosFalsos = [
      { nombre: 'Arroz', precio: 28, stock: 20, proveedor: 'Granos MX' },
      { nombre: 'Frijol', precio: 34, stock: 15, proveedor: 'AgroComercial' },
      { nombre: 'Aceite', precio: 50, stock: 10, proveedor: 'NutriAceites' }
    ];
    setProductos(datosFalsos);
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>Gestión de Productos</h2>
        <Link to="/agregar-producto" style={styles.addButton}>
          + Agregar Producto
        </Link>
      </div>

      <div style={styles.grid}>
        {productos.length > 0 ? (
          productos.map((prod, index) => (
            <ProductoCard
              key={index}
              nombre={prod.nombre}
              precio={prod.precio}
              stock={prod.stock}
              proveedor={prod.proveedor}
            />
          ))
        ) : (
          <p>No hay productos registrados.</p>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '2rem',
    fontFamily: 'Segoe UI, sans-serif'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem'
  },
  addButton: {
    backgroundColor: '#004080',
    color: '#fff',
    padding: '0.6rem 1rem',
    borderRadius: '5px',
    textDecoration: 'none',
    fontSize: '1rem'
  },
  grid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1rem'
  }
};
