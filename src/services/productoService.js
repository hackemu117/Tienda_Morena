const API_URL = 'http://localhost:3001/api/clientes'; // Cambia el puerto si es distinto

// Obtener todos los clientes
export const obtenerClientes = async () => {
  try {
    const response = await fetch(API_URL);
    return await response.json();
  } catch (error) {
    console.error('Error al obtener clientes:', error);
    return [];
  }
};

// Agregar un nuevo cliente
export const agregarCliente = async (cliente) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cliente)
    });
    return await response.json();
  } catch (error) {
    console.error('Error al agregar cliente:', error);
  }
};

// Editar cliente
export const actualizarCliente = async (id, cliente) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cliente)
    });
    return await response.json();
  } catch (error) {
    console.error('Error al actualizar cliente:', error);
  }
};

// Eliminar cliente
export const eliminarCliente = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    });
    return await response.json();
  } catch (error) {
    console.error('Error al eliminar cliente:', error);
  }
};
