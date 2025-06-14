import React from 'react';
import PropTypes from 'prop-types';

const AlertBox = ({ type = 'info', message }) => {
  const styles = {
    container: {
      padding: '1rem',
      borderRadius: '6px',
      fontSize: '1rem',
      marginBottom: '1rem',
      border: '1px solid transparent',
      width: '100%',
      maxWidth: '600px',
      margin: '0 auto',
      textAlign: 'center'
    },
    info: {
      backgroundColor: '#d1ecf1',
      color: '#0c5460',
      borderColor: '#bee5eb'
    },
    warning: {
      backgroundColor: '#fff3cd',
      color: '#856404',
      borderColor: '#ffeeba'
    },
    danger: {
      backgroundColor: '#f8d7da',
      color: '#721c24',
      borderColor: '#f5c6cb'
    },
    success: {
      backgroundColor: '#d4edda',
      color: '#155724',
      borderColor: '#c3e6cb'
    }
  };

  const style = {
    ...styles.container,
    ...(styles[type] || styles.info)
  };

  return (
    <div style={style}>
      {message}
    </div>
  );
};

AlertBox.propTypes = {
  type: PropTypes.oneOf(['info', 'warning', 'danger', 'success']),
  message: PropTypes.string.isRequired
};

export default AlertBox;
