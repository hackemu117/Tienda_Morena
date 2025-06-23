import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { FaMoneyBill, FaShoppingCart, FaWarehouse, FaBoxOpen, FaInfoCircle } from "react-icons/fa";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import * as Tooltip from '@radix-ui/react-tooltip';

const colorClasses = {
  green: { text: "text-green-800", bg: "bg-green-200", border: "border-green-500", fill: "#16a34a" },
  red: { text: "text-red-800", bg: "bg-red-200", border: "border-red-500", fill: "#dc2626" },
  lime: { text: "text-lime-800", bg: "bg-lime-200", border: "border-lime-500", fill: "#84cc16" },
  indigo: { text: "text-indigo-800", bg: "bg-indigo-200", border: "border-indigo-500", fill: "#4f46e5" },
};

const Card = ({ title, icon, value, info, color, progress, status, chartData, tooltip }) => {
  const styles = colorClasses[color] || colorClasses.green;
  const formattedChartData = chartData?.map(d => ({ ...d, valor: Number(d.valor) })) || [];

  return (
    <motion.div
      className={`relative rounded-xl p-5 shadow-xl bg-white border-l-4 ${styles.border}`}
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <div className="absolute top-3 right-3 z-10">
        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <button className={`text-sm ${styles.text}`}>
              <FaInfoCircle />
            </button>
          </Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content
              className="bg-white border border-gray-300 shadow-md p-2 rounded text-xs text-gray-700 max-w-xs"
              side="top"
              sideOffset={5}
            >
              {tooltip}
              <Tooltip.Arrow className="fill-white" />
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h3 className={`text-sm font-semibold ${styles.text}`}>{title}</h3>
        <div className={`text-xl ${styles.text}`}>{icon}</div>
      </div>

      <div className="flex items-center justify-between mb-2">
        <p className={`text-2xl font-bold ${styles.text}`}>{value}</p>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${styles.bg} ${styles.text}`}>
          {status}
        </span>
      </div>

      <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden shadow-inner mb-2">
        <div className="h-full" style={{ width: `${progress}%`, backgroundColor: styles.fill }}></div>
      </div>

      <div className="h-16">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={formattedChartData}>
            <Line type="monotone" dataKey="valor" stroke={styles.fill} strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <p className={`text-xs mt-2 ${styles.text}`}>{info}</p>
    </motion.div>
  );
};

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('http://localhost:3001/api/reportes/dashboard');
        if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        const data = await response.json();
        setDashboardData(data);
      } catch (err) {
        console.error("Error:", err);
        setError("No se pudieron cargar los datos. Revisa el servidor.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-xl font-semibold">Cargando dashboard...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-xl text-red-600 bg-red-100 p-8 rounded-lg">{error}</div>;
  }

  return (
    <Tooltip.Provider>
      <div className="max-w-7xl mx-auto px-4 py-8 font-sans">
        <motion.h1
          className="text-3xl font-bold text-red-700 mb-6"
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          ¡Bienvenido de vuelta, Jonathan!
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <div className="grid grid-cols-1 mb-6">
            <Card {...dashboardData.gananciasData} title="Ganancias Netas" icon={<FaMoneyBill />} color="green" tooltip="Ingresos menos gastos." />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card {...dashboardData.gastosData} title="Gastos Totales" icon={<FaShoppingCart />} color="red" tooltip="Gastos operativos totales." />
            <Card {...dashboardData.ventasData} title="Ventas" icon={<FaBoxOpen />} color="lime" tooltip="Ventas totales a la fecha." />
            <Card {...dashboardData.inventarioData} title="Inventario" icon={<FaWarehouse />} color="indigo" tooltip="Productos disponibles en stock." />
          </div>
        </motion.div>

        <div className="mt-12 flex justify-center gap-6">
          <motion.button
            className="bg-red-700 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-red-800 transition-colors"
            whileHover={{ scale: 1.05 }}
            onClick={() => window.location.href = '/productos'}
          >
            Ir al Inventario
          </motion.button>

          <motion.button
            className="bg-red-700 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-red-800 transition-colors"
            whileHover={{ scale: 1.05 }}
            onClick={() => window.location.href = '/ventas'}
          >
            Agregar Venta
          </motion.button>
        </div>
      </div>
    </Tooltip.Provider>
  );
}
