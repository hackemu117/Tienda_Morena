import React from 'react';
import { useNavigate } from 'react-router-dom';
import AlertBox from '../components/AlertBox';

export default function DashboardPage() {
  const navigate = useNavigate();

  return (
    <div style={styles.page}>
      <h2 style={styles.title}>¡Bienvenido a Tienda La Moderna!</h2>

      <div style={styles.alerts}>
        <AlertBox
          type="warning"
          message="⚠️ Algunos productos tienen menos de 5 unidades."
        />
        <AlertBox
          type="danger"
          message="⏰ Algunos productos están por caducar."
        />
      </div>

      <div style={styles.buttons}>
        <button onClick={() => navigate('/productos')} style={styles.button}>
          Administrar Inventario
        </button>
        <button onClick={() => navigate('/ventas')} style={styles.button}>
          Registrar Venta
        </button>
      </div>
    </div>
  );
}

const styles = {
  page: {
    padding: '3rem 1rem',
    maxWidth: '800px',
    margin: '0 auto',
    textAlign: 'center',
    fontFamily: 'Segoe UI, sans-serif',
  },
  title: {
    fontSize: '2rem',
    marginBottom: '2rem',
    color: '#002147'
  },
  alerts: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    marginBottom: '2.5rem'
  },
  buttons: {
    display: 'flex',
    gap: '1.5rem',
    justifyContent: 'center',
    flexWrap: 'wrap'
  },
  button: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#004080',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'background 0.3s',
  }
};
