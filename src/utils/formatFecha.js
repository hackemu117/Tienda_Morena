// src/utils/formatFecha.js

export function formatFechaLocal(fechaISO) {
  const date = new Date(fechaISO);
  
  // Ajustar a UTC-6
  const opciones = {
    timeZone: 'America/Mexico_City',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  };

  return new Intl.DateTimeFormat('es-MX', opciones).format(date);
}
