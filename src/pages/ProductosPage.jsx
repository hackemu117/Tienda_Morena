import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductoCard from '../components/ProductoCard';

export default function ProductosPage() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const datosFalsos = [
      {
        id: 1,
        nombre: 'Arroz',
        precio: 28,
        precioUnidadVenta: 30,
        precioUnidadCompra: 25,
        stock: 20,
        proveedor: 'Granos MX',
        fechaCaducidad: '2025-12-31'
      },
      {
        id: 2,
        nombre: 'Frijol',
        precio: 34,
        precioUnidadVenta: 36,
        precioUnidadCompra: 30,
        stock: 15,
        proveedor: 'AgroComercial',
        fechaCaducidad: '2025-11-15'
      },
      {
        id: 3,
        nombre: 'Aceite',
        precio: 50,
        precioUnidadVenta: 55,
        precioUnidadCompra: 45,
        stock: 10,
        proveedor: 'NutriAceites',
        fechaCaducidad: '2026-01-20'
      }
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
          productos.map((prod) => (
            <ProductoCard
              key={prod.id}
              nombre={prod.nombre}
              precioUnidadVenta={prod.precioUnidadVenta}
              precioUnidadCompra={prod.precioUnidadCompra}
              stock={prod.stock}
              proveedor={prod.proveedor}
              fechaCaducidad={prod.fechaCaducidad}
              id={prod.id}
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
