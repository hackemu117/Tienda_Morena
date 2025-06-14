import React from 'react';

export default function ReportesPage() {
  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Reportes de Ventas</h2>

      <section style={styles.section}>
        <h3 style={styles.subtitle}>📅 Corte de Caja Diario</h3>
        <div style={styles.card}>
          <p>Total ventas: <strong>$3,200.00</strong></p>
          <p>Número de ventas: <strong>17</strong></p>
          <p>Fecha: <strong>14/06/2025</strong></p>
        </div>
      </section>

      <section style={styles.section}>
        <h3 style={styles.subtitle}>📊 Resumen Semanal</h3>
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Día</th>
              <th>Ventas</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Lunes</td>
              <td>12</td>
              <td>$2,000.00</td>
            </tr>
            <tr>
              <td>Martes</td>
              <td>9</td>
              <td>$1,100.00</td>
            </tr>
            <tr>
              <td>Miércoles</td>
              <td>15</td>
              <td>$2,800.00</td>
            </tr>
            {/* Puedes generar estos datos dinámicamente en el futuro */}
          </tbody>
        </table>
      </section>
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
    color: '#002147',
    marginBottom: '1.5rem'
  },
  subtitle: {
    fontSize: '1.2rem',
    marginBottom: '0.8rem',
    color: '#004080'
  },
  section: {
    marginBottom: '2rem'
  },
  card: {
    backgroundColor: '#f2f7ff',
    padding: '1rem',
    borderRadius: '6px',
    boxShadow: '0 0 4px rgba(0,0,0,0.1)',
    lineHeight: '1.6'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: '#fff',
    boxShadow: '0 0 4px rgba(0,0,0,0.1)'
  }
};
