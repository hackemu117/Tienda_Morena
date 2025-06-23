import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import axios from 'axios';
import { FaBell } from 'react-icons/fa';
import * as HoverCard from '@radix-ui/react-hover-card';
import logo from '../assets/logo.png';

// Array de items de navegación para generar los links
const navItems = [
    { name: "Inicio", href: "/" },
    { name: "Productos", href: "/productos" },
    { name: "Ventas", href: "/ventas" },
    { name: "Reportes", href: "/reportes" },
    { name: "Proveedores", href: "/proveedores" },
    { name: "Clientes", href: "/clientes" },
    { name: "Alertas", href: "/alertas" }, // Link a la página de alertas
];

export default function Navbar() {
    const pathname = window.location.pathname;

    // Estados para guardar los conteos de las alertas
    const [conteoBajoStock, setConteoBajoStock] = useState(0);
    const [conteoPorCaducar, setConteoPorCaducar] = useState(0);

    // useEffect para obtener los datos de las alertas al cargar el Navbar
    useEffect(() => {
        const fetchAlertas = async () => {
            try {
                // Hacemos ambas llamadas a la API en paralelo
                const [resBajoStock, resPorCaducar] = await Promise.all([
                    axios.get('http://localhost:3001/api/alertas/conteo/bajo-stock'),
                    axios.get('http://localhost:3001/api/alertas/conteo/por-caducar')
                ]);

                // Actualizamos los estados. Si no hay datos, se queda en 0.
                setConteoBajoStock(resBajoStock.data?.total_productos_bajo_stock || 0);
                setConteoPorCaducar(resPorCaducar.data?.total_productos_por_caducar || 0);

            } catch (error) {
                console.error("Error al obtener las alertas para el Navbar:", error);
            }
        };

        fetchAlertas();
        // El array vacío [] asegura que la llamada se haga solo una vez
    }, []);
    
    // Calculamos el total de alertas para mostrar en el indicador
    const totalAlertas = conteoBajoStock + conteoPorCaducar;

    return (
        <nav className="bg-gradient-to-r from-red-600 via-red-500 to-red-700 shadow-lg px-8 py-5 sticky top-0 z-50 flex justify-between items-center">
            {/* Logo y Nombre de la Tienda */}
            <motion.div
                whileHover={{ scale: 1.08 }}
                className="flex items-center gap-3 text-3xl font-extrabold text-white tracking-wide drop-shadow-lg"
            >
                <img src={logo} alt="Logo" className="h-10 w-auto" />
                Tienda La Moderna
            </motion.div>

            {/* Contenedor para los links de navegación y las notificaciones */}
            <div className="flex items-center gap-4">
                <ul className="flex gap-3">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <motion.li key={item.name} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                                <a
                                    href={item.href}
                                    className={`px-5 py-2 rounded-full font-semibold text-sm uppercase transition-all duration-300 shadow-md border-2 ${
                                        isActive
                                        ? "bg-white text-red-700 border-white"
                                        : "bg-red-100 text-red-700 border-red-300 hover:bg-white hover:text-red-700 hover:border-white"
                                    }`}
                                >
                                    {item.name}
                                </a>
                            </motion.li>
                        );
                    })}
                </ul>

                {/* Componente de Notificaciones con panel flotante */}
                <HoverCard.Root>
                    <HoverCard.Trigger asChild>
                        <a href="/alertas" className="relative text-white p-3 rounded-full hover:bg-red-700 transition-colors">
                            <FaBell size={20} />
                            {/* Indicador rojo que solo aparece si hay alertas */}
                            {totalAlertas > 0 && (
                                <span className="absolute top-1 right-1 flex h-4 w-4">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-300 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-4 w-4 bg-yellow-400 justify-center items-center text-red-700 text-xs font-bold">
                                        {totalAlertas}
                                    </span>
                                </span>
                            )}
                        </a>
                    </HoverCard.Trigger>
                    
                    <HoverCard.Portal>
                        <HoverCard.Content 
                            className="bg-white rounded-lg shadow-2xl p-4 w-72 border border-gray-200 z-50" 
                            sideOffset={10}
                            asChild
                        >
                            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
                                <div className="flex flex-col gap-2">
                                    <h3 className="font-bold text-md text-gray-800 border-b pb-2 mb-2">Notificaciones</h3>
                                    {totalAlertas > 0 ? (
                                        <>
                                            {conteoBajoStock > 0 && (
                                                <div className="text-sm text-gray-700">
                                                    ⚠️ Tienes <span className="font-semibold text-orange-600">{conteoBajoStock}</span> producto(s) con bajo stock.
                                                </div>
                                            )}
                                            {conteoPorCaducar > 0 && (
                                                <div className="text-sm text-gray-700">
                                                    🗓️ Tienes <span className="font-semibold text-yellow-600">{conteoPorCaducar}</span> producto(s) cerca de caducar.
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <div className="text-sm text-gray-500">No hay alertas nuevas. ¡Todo en orden!</div>
                                    )}
                                </div>
                                <HoverCard.Arrow className="fill-white" />
                            </motion.div>
                        </HoverCard.Content>
                    </HoverCard.Portal>
                </HoverCard.Root>
            </div>
        </nav>
    );
}