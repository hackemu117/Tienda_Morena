import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { Button } from '../components/ui/button';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '../components/ui/dialog';

export default function ProductosPage() {
  const [productos, setProductos] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [mostrarDialogo, setMostrarDialogo] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const datosFalsos = [
      {
        id: 1,
        nombre: 'Arroz',
        precioUnidadVenta: 30,
        precioUnidadCompra: 25,
        stock: 3,
        proveedor: 'Granos MX',
        fechaCaducidad: '2025-06-20'
      },
      {
        id: 2,
        nombre: 'Frijol',
        precioUnidadVenta: 36,
        precioUnidadCompra: 30,
        stock: 15,
        proveedor: 'AgroComercial',
        fechaCaducidad: '2025-11-15'
      },
      {
        id: 3,
        nombre: 'Aceite',
        precioUnidadVenta: 55,
        precioUnidadCompra: 45,
        stock: 2,
        proveedor: 'NutriAceites',
        fechaCaducidad: '2024-12-01'
      }
    ];
    setProductos(datosFalsos);
  }, []);

  const confirmarEliminacion = (producto) => {
    setProductoSeleccionado(producto);
    setMostrarDialogo(true);
  };

  const eliminarProducto = () => {
    setProductos(prev => prev.filter(p => p.id !== productoSeleccionado.id));
    setMostrarDialogo(false);
  };

  return (
    <div className="p-6 font-sans max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-blue-900">Productos Registrados</h2>
        <Button onClick={() => navigate('/agregar-producto')} className="bg-blue-800 hover:bg-blue-900 text-white">+ Agregar Producto</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {productos.map((prod) => (
          <div key={prod.id} className="border shadow rounded-lg p-4 bg-white relative">
            <h3 className="text-xl font-semibold text-blue-800 mb-2">{prod.nombre}</h3>
            <p><strong>ID:</strong> {prod.id}</p>
            <p><strong>Proveedor:</strong> {prod.proveedor}</p>
            <p><strong>Precio Venta:</strong> ${prod.precioUnidadVenta}</p>
            <p><strong>Precio Compra:</strong> ${prod.precioUnidadCompra}</p>
            <p><strong>Stock:</strong> {prod.stock}</p>
            <p><strong>Caduca:</strong> {format(parseISO(prod.fechaCaducidad), 'dd/MM/yyyy')}</p>

            <div className="flex justify-between mt-6">
              <Button
                variant="destructive"
                className="text-white bg-red-600 hover:bg-red-700"
                onClick={() => confirmarEliminacion(prod)}
              >
                🗑 Eliminar
              </Button>
              <Button
                variant="outline"
                className="text-white bg-blue-600 hover:bg-blue-700"
                onClick={() => navigate('/agregar-producto', { state: { producto: prod } })}
              >
                📝 Editar
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={mostrarDialogo} onOpenChange={setMostrarDialogo}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Eliminación</DialogTitle>
          </DialogHeader>
          <p>
            ¿Estás seguro de que deseas eliminar el producto "{productoSeleccionado?.nombre}"?
            Esta acción no se puede deshacer.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMostrarDialogo(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={eliminarProducto}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
