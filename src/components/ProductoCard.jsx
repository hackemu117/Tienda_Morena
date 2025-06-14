import React from 'react';
import PropTypes from 'prop-types';

const ProductCard = ({ nombre, precio, stock, proveedor }) => {
  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <h3 style={styles.title}>{nombre}</h3>
      </div>
      <p><strong>Precio:</strong> ${precio}</p>
      <p><strong>Stock:</strong> {stock}</p>
      <p><strong>Proveedor:</strong> {proveedor}</p>
      <div style={styles.footer}>
        <button style={styles.button}>Editar</button>
        <button style={styles.button}>Eliminar</button>
      </div>
    </div>
  );
};

ProductCard.propTypes = {
  nombre: PropTypes.string.isRequired,
  precio: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  stock: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  proveedor: PropTypes.string.isRequired,
};

const styles = {
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    padding: '1rem',
    boxShadow: '0 0 8px rgba(0,0,0,0.1)',
    width: '220px',
    textAlign: 'left',
    fontFamily: 'Segoe UI, sans-serif',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  header: {
    marginBottom: '0.5rem'
  },
  title: {
    fontSize: '1.2rem',
    color: '#002147',
    margin: 0
  },
  footer: {
    marginTop: '1rem',
    display: 'flex',
    justifyContent: 'space-between'
  },
  button: {
    padding: '0.4rem 0.6rem',
    backgroundColor: '#004080',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    fontSize: '0.9rem',
    cursor: 'pointer'
  }
};

export default ProductCard;
