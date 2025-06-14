import React, { useState } from 'react';

export default function ReportesPage() {
  const [fechaSeleccionada, setFechaSeleccionada] = useState('2025-06-14');

  const ventasDelDia = [
    { id: 'V-101', producto: 'Arroz', cantidad: 3, total: 90.0, hora: '09:30', fecha: '2025-06-14' },
    { id: 'V-102', producto: 'Aceite', cantidad: 1, total: 50.0, hora: '10:15', fecha: '2025-06-14' },
    { id: 'V-103', producto: 'Frijol', cantidad: 2, total: 68.0, hora: '11:00', fecha: '2025-06-14' }
  ];

  const ventasFiltradas = ventasDelDia.filter(v => v.fecha === fechaSeleccionada);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Reportes de Ventas</h2>

      <section style={styles.section}>
        <h3 style={styles.subtitle}>📅 Corte de Caja</h3>
        <div style={styles.card}>
          <p><strong>ID del Corte:</strong> C-001</p>
          <p><strong>Total ventas:</strong> $3,200.00</p>
          <p><strong>Número de ventas:</strong> 17</p>
          <p><strong>Fecha:</strong> 14/06/2025</p>
        </div>
      </section>

      <section style={styles.section}>
        <h3 style={styles.subtitle}>🧾 Ventas del Día</h3>

        <div style={styles.datePickerContainer}>
          <label htmlFor="fecha">Selecciona una fecha:</label>
          <input
            type="date"
            id="fecha"
            value={fechaSeleccionada}
            onChange={(e) => setFechaSeleccionada(e.target.value)}
            style={styles.dateInput}
          />
        </div>

        {ventasFiltradas.length > 0 ? (
          <table style={styles.table}>
            <thead>
              <tr>
                <th>ID Venta</th>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Total</th>
                <th>Hora</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {ventasFiltradas.map((venta) => (
                <tr key={venta.id}>
                  <td>{venta.id}</td>
                  <td>{venta.producto}</td>
                  <td>{venta.cantidad}</td>
                  <td>${venta.total.toFixed(2)}</td>
                  <td>{venta.hora}</td>
                  <td>{venta.fecha}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ marginTop: '1rem' }}>No hay ventas registradas en esta fecha.</p>
        )}
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
  datePickerContainer: {
    marginBottom: '1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  dateInput: {
    padding: '0.4rem',
    fontSize: '1rem',
    border: '1px solid #ccc',
    borderRadius: '4px'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: '#fff',
    boxShadow: '0 0 4px rgba(0,0,0,0.1)'
  }
};
