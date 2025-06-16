import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '../components/ui/dialog';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProveedoresPage() {
  const [proveedores, setProveedores] = useState([]);
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState(null);
  const [mostrarDialogo, setMostrarDialogo] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const datosFalsos = [
      { id: 1, nombre: 'Granos MX', empresa: 'Granos del Norte', telefono: '5544332211', correo: 'contacto@granosmx.com' },
      { id: 2, nombre: 'NutriAceites', empresa: 'Nutrición y Vida S.A.', telefono: '5599887766', correo: 'ventas@nutriaceites.com' },
      { id: 3, nombre: 'Distribuciones El Sol', empresa: 'Grupo El Sol', telefono: '5588776655', correo: 'info@elsol.com' }
    ];
    setProveedores(datosFalsos);
  }, []);

  const confirmarEliminacion = (prov) => {
    setProveedorSeleccionado(prov);
    setMostrarDialogo(true);
  };

  const eliminarProveedor = () => {
    setProveedores(prev => prev.filter(p => p.id !== proveedorSeleccionado.id));
    setMostrarDialogo(false);
  };

  return (
    <div className="p-6 font-sans max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex justify-between items-center mb-6"
      >
        <h2 className="text-2xl font-bold text-blue-900">Proveedores Registrados</h2>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={() => navigate("/agregar-proveedor")}
            className="bg-blue-800 hover:bg-blue-900 text-white shadow-lg px-6 py-3 text-sm font-medium rounded-xl transition-all duration-300"
          >
            + Agregar Proveedor
          </Button>
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {proveedores.map((prov) => (
            <motion.div
              key={prov.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.02 }}
              className="border border-gray-200 shadow-md hover:shadow-lg rounded-2xl p-5 bg-white relative transition-all"
            >
              <h3 className="text-xl font-semibold text-blue-800 mb-2">{prov.nombre}</h3>
              <p className="text-sm text-gray-700"><strong>ID:</strong> {prov.id}</p>
              <p className="text-sm text-gray-700"><strong>Empresa:</strong> {prov.empresa}</p>
              <p className="text-sm text-gray-700"><strong>Teléfono:</strong> {prov.telefono}</p>

              <div className="flex justify-between mt-6">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="destructive"
                    className="text-white bg-red-600 hover:bg-red-700"
                    onClick={() => confirmarEliminacion(prov)}
                  >
                    🗑 Eliminar
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="outline"
                    className="text-white bg-blue-600 hover:bg-blue-700"
                    onClick={() => navigate('/agregar-proveedor', { state: { proveedor: prov } })}
                  >
                    📝 Editar
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <Dialog open={mostrarDialogo} onOpenChange={setMostrarDialogo}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Eliminación</DialogTitle>
          </DialogHeader>
          <p>
            ¿Estás seguro de que deseas eliminar al proveedor "{proveedorSeleccionado?.nombre}"?
            Esta acción no se puede deshacer.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMostrarDialogo(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={eliminarProveedor}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
