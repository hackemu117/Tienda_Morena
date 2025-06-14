import React, { useState } from 'react';

export default function AgregarProducto() {
  const [producto, setProducto] = useState({
    nombre: '',
    precio: '',
    stock: '',
    proveedor: ''
  });

  const handleChange = (e) => {
    setProducto({
      ...producto,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Producto agregado:', producto);

    // Aquí iría la lógica para enviar el producto al backend
    alert('Producto agregado correctamente');
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Agregar Producto</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.group}>
          <label>Nombre del Producto</label>
          <input
            type="text"
            name="nombre"
            value={producto.nombre}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.group}>
          <label>Precio</label>
          <input
            type="number"
            name="precio"
            value={producto.precio}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.group}>
          <label>Stock</label>
          <input
            type="number"
            name="stock"
            value={producto.stock}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.group}>
          <label>Proveedor</label>
          <input
            type="text"
            name="proveedor"
            value={producto.proveedor}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>
        <button type="submit" style={styles.button}>Guardar Producto</button>
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
