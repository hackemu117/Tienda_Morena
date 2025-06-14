import React, { useState } from 'react';

export default function VentasPage() {
  const [venta, setVenta] = useState({
    producto: '',
    cantidad: '',
    precio: ''
  });

  const handleChange = (e) => {
    setVenta({
      ...venta,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Venta registrada:', venta);
    alert('✅ Venta registrada correctamente');
    setVenta({ producto: '', cantidad: '', precio: '' });
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Registrar Venta</h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.group}>
          <label>Producto</label>
          <input
            type="text"
            name="producto"
            value={venta.producto}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.group}>
          <label>Cantidad</label>
          <input
            type="number"
            name="cantidad"
            value={venta.cantidad}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.group}>
          <label>Precio Unitario</label>
          <input
            type="number"
            step="0.01"
            name="precio"
            value={venta.precio}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>
        <button type="submit" style={styles.button}>
          Registrar Venta
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    padding: '2rem',
    fontFamily: 'Segoe UI, sans-serif',
    maxWidth: '500px',
    margin: '0 auto'
  },
  title: {
    fontSize: '1.8rem',
    marginBottom: '1.5rem',
    color: '#002147',
    textAlign: 'center'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.2rem'
  },
  group: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem'
  },
  input: {
    padding: '0.5rem',
    fontSize: '1rem',
    border: '1px solid #ccc',
    borderRadius: '4px'
  },
  button: {
    padding: '0.7rem',
    backgroundColor: '#004080',
    color: '#fff',
    fontSize: '1rem',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer'
  }
};
