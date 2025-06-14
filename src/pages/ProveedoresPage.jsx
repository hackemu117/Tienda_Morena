import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function ProveedoresPage() {
  const [proveedores, setProveedores] = useState([]);

  useEffect(() => {
    const datosFalsos = [
      { id: 1, nombre: 'Granos MX', empresa: 'Granos del Norte', telefono: '5544332211', correo: 'contacto@granosmx.com' },
      { id: 2, nombre: 'NutriAceites', empresa: 'Nutrición y Vida S.A.', telefono: '5599887766', correo: 'ventas@nutriaceites.com' },
      { id: 3, nombre: 'Distribuciones El Sol', empresa: 'Grupo El Sol', telefono: '5588776655', correo: 'info@elsol.com' }
    ];
    setProveedores(datosFalsos);
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>Proveedores Registrados</h2>
        <Link to="/agregar-proveedor" style={styles.addButton}>
          + Agregar Proveedor
        </Link>
      </div>

      <div style={styles.grid}>
        {proveedores.map((prov) => (
          <div key={prov.id} style={styles.card}>
            <h3>{prov.nombre}</h3>
            <p><strong>ID:</strong> {prov.id}</p>
            <p><strong>Empresa:</strong> {prov.empresa}</p>
            <p><strong>Teléfono:</strong> {prov.telefono}</p>
            <p><strong>Correo:</strong> {prov.correo}</p>
          </div>
        ))}
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
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: '1.5rem'
  },
  card: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '1rem',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
    backgroundColor: '#fafafa'
  }
};
