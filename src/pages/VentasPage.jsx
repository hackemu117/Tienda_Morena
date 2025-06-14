import React, { useState } from 'react';

export default function VentasPage() {
  const [ventas, setVentas] = useState([]);
  const [indice, setIndice] = useState(0);
  const [venta, setVenta] = useState({
    id: Date.now(),
    producto: '',
    cantidad: '',
    precio: '',
    fecha: new Date().toLocaleDateString(),
    hora: new Date().toLocaleTimeString()
  });

  const handleChange = (e) => {
    setVenta({ ...venta, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const nuevaVenta = {
      ...venta,
      total: parseFloat(venta.precio) * parseFloat(venta.cantidad)
    };
    const nuevasVentas = [...ventas, nuevaVenta];
    setVentas(nuevasVentas);
    setIndice(nuevasVentas.length - 1);
    alert('✅ Venta registrada correctamente');
    setVenta({
      id: Date.now(),
      producto: '',
      cantidad: '',
      precio: '',
      fecha: new Date().toLocaleDateString(),
      hora: new Date().toLocaleTimeString()
    });
  };

  const handleEditar = () => {
    setVenta({ ...ventas[indice] });
    const nuevas = [...ventas];
    nuevas.splice(indice, 1);
    setVentas(nuevas);
    setIndice(Math.max(indice - 1, 0));
  };

  const handleEliminar = () => {
    const nuevas = ventas.filter((_, i) => i !== indice);
    setVentas(nuevas);
    setIndice(0);
    alert('❌ Venta eliminada');
  };

  const ventaActual = ventas[indice];

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Registrar Venta</h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.group}>
          <label>ID</label>
          <input type="text" name="id" value={venta.id} onChange={handleChange} style={styles.input} />
        </div>
        <div style={styles.group}>
          <label>Producto</label>
          <input type="text" name="producto" value={venta.producto} onChange={handleChange} style={styles.input} />
        </div>
        <div style={styles.group}>
          <label>Cantidad</label>
          <input type="number" name="cantidad" value={venta.cantidad} onChange={handleChange} style={styles.input} />
        </div>
        <div style={styles.group}>
          <label>Precio</label>
          <input type="number" name="precio" value={venta.precio} onChange={handleChange} style={styles.input} />
        </div>
        <div style={styles.group}>
          <label>Fecha</label>
          <input type="text" name="fecha" value={venta.fecha} onChange={handleChange} style={styles.input} />
        </div>
        <div style={styles.group}>
          <label>Hora</label>
          <input type="text" name="hora" value={venta.hora} onChange={handleChange} style={styles.input} />
        </div>
        <button type="submit" style={styles.button}>Registrar Venta</button>
      </form>

      {ventaActual && (
        <div style={styles.result}>
          <div style={styles.resultContent}>
            <h3>📦 Venta #{indice + 1} de {ventas.length}</h3>
            <p><strong>ID:</strong> {ventaActual.id}</p>
            <p><strong>Producto:</strong> {ventaActual.producto}</p>
            <p><strong>Cantidad:</strong> {ventaActual.cantidad}</p>
            <p><strong>Precio:</strong> ${ventaActual.precio}</p>
            <p><strong>Total:</strong> ${ventaActual.total?.toFixed(2)}</p>
            <p><strong>Fecha:</strong> {ventaActual.fecha}</p>
            <p><strong>Hora:</strong> {ventaActual.hora}</p>
            <div style={styles.navButtons}>
              <button onClick={() => setIndice(Math.max(0, indice - 1))} disabled={indice === 0}>⬅ Anterior</button>
              <button onClick={() => setIndice(Math.min(ventas.length - 1, indice + 1))} disabled={indice === ventas.length - 1}>Siguiente ➡</button>
            </div>
            <div style={styles.navButtons}>
              <button onClick={handleEditar}>✏️ Editar</button>
              <button onClick={handleEliminar}>🗑️ Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: '2rem',
    fontFamily: 'Segoe UI, sans-serif',
    maxWidth: '600px',
    margin: '0 auto'
  },
  title: {
    fontSize: '1.8rem',
    marginBottom: '1.5rem',
    textAlign: 'center'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    marginBottom: '2rem'
  },
  group: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem'
  },
  input: {
    padding: '0.5rem',
    fontSize: '1rem',
    borderRadius: '4px',
    border: '1px solid #ccc'
  },
  button: {
    padding: '0.7rem',
    backgroundColor: '#004080',
    color: '#fff',
    borderRadius: '5px',
    border: 'none'
  },
  result: {
    backgroundColor: '#f0f8ff',
    padding: '1rem',
    borderRadius: '8px',
    border: '1px solid #ccc',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  resultContent: {
    textAlign: 'center'
  },
  navButtons: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
    marginTop: '1rem'
  }
};
