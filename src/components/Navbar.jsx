import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

const Navbar = () => {
  return (
    <header style={styles.navbar}>
      <div style={styles.left}>
        <img src={logo} alt="Logo Tienda La Moderna" style={styles.logo} />
        <h1 style={styles.title}>MODERNA</h1>
      </div>
      <nav style={styles.links}>
        <Link to="/" style={styles.link}>Inicio</Link>
        <Link to="/productos" style={styles.link}>Productos</Link>
        <Link to="/ventas" style={styles.link}>Ventas</Link>
        <Link to="/reportes" style={styles.link}>Reportes</Link>
        <Link to="/proveedores" style={styles.link}>Proveedores</Link>
      </nav>
    </header>
  );
};

const styles = {
  navbar: {
    backgroundColor: '#002147',
    color: '#fff',
    padding: '10px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  left: {
    display: 'flex',
    alignItems: 'center',
  },
  logo: {
    height: '40px',
    marginRight: '10px',
  },
  title: {
    fontSize: '1.5rem',
    color: '#ff4d4f',
    margin: 0,
  },
  links: {
    display: 'flex',
    gap: '1.5rem',
  },
  link: {
    color: '#fff',
    textDecoration: 'none',
    fontWeight: 'bold',
    fontSize: '1rem',
  }
};

export default Navbar;
