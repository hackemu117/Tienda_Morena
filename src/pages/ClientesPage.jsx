import React from 'react';

export default function ClientesPage() {
  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Gestión de Clientes</h2>

      <div style={styles.actions}>
        <button style={styles.button}>Agregar Cliente</button>
      </div>

      <table style={styles.table}>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Teléfono</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Juan Pérez</td>
            <td>juanp@example.com</td>
            <td>555-123-4567</td>
            <td>
              <button style={styles.smallButton}>Editar</button>
              <button style={styles.smallButton}>Eliminar</button>
            </td>
          </tr>
          {/* Aquí se agregarán más filas dinámicamente en el futuro */}
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  container: {
    padding: '2rem',
    fontFamily: 'Segoe UI, sans-serif'
  },
  title: {
    fontSize: '1.8rem',
    marginBottom: '1.5rem',
    color: '#002147'
  },
  actions: {
    marginBottom: '1rem'
  },
  button: {
    padding: '0.5rem 1rem',
    backgroundColor: '#004080',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    cursor: 'pointer'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: '#fff',
    boxShadow: '0 0 4px rgba(0,0,0,0.1)'
  },
  smallButton: {
    marginRight: '0.5rem',
    padding: '0.3rem 0.7rem',
    backgroundColor: '#004080',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem'
  }
};
