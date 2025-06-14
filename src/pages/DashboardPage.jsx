import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Alert } from '../components/ui/alert';

export default function DashboardPage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 text-center font-sans">
      <h2 className="text-3xl font-bold text-blue-900 mb-6">
        ¡Bienvenido a Tienda La Moderna!
      </h2>

      <div className="flex flex-col gap-4 mb-10 text-left">
        <Alert
          type="warning"
          title="¡Advertencia de Stock!"
          message="⚠️ Algunos productos tienen menos de 5 unidades en existencia."
        />
        <Alert
          type="danger"
          title="¡Alerta de Caducidad!"
          message="⏰ Algunos productos están por caducar pronto."
        />
      </div>

      <div className="flex justify-center gap-6 flex-wrap">
        <Button onClick={() => navigate('/productos')}>
          Administrar Inventario
        </Button>
        <Button onClick={() => navigate('/ventas')} variant="secondary">
          Registrar Venta
        </Button>
      </div>
    </div>
  );
}
