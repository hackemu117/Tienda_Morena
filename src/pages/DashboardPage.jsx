import React from 'react';
import { motion } from "framer-motion";
import { FaMoneyBill, FaShoppingCart, FaWarehouse, FaBoxOpen, FaInfoCircle } from "react-icons/fa";
import {
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";
import * as Tooltip from '@radix-ui/react-tooltip';

const colorClasses = {
  green: {
    text: "text-green-800",
    bg: "bg-green-200",
    border: "border-green-500",
    fill: "#16a34a",
  },
  red: {
    text: "text-red-800",
    bg: "bg-red-200",
    border: "border-red-500",
    fill: "#dc2626",
  },
  lime: {
    text: "text-lime-800",
    bg: "bg-lime-200",
    border: "border-lime-500",
    fill: "#84cc16",
  },
  indigo: {
    text: "text-indigo-800",
    bg: "bg-indigo-200",
    border: "border-indigo-500",
    fill: "#4f46e5",
  },
};

const Card = ({ title, icon, value, info, color, progress, status, chartData, tooltip }) => {
  const styles = colorClasses[color] || colorClasses.green;

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
          <LineChart data={chartData}>
            <Line type="monotone" dataKey="valor" stroke={styles.fill} strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <p className={`text-xs mt-2 ${styles.text}`}>{info}</p>
    </motion.div>
    
  );
};

export default function DashboardPage() {
  const sampleData = [
    { valor: 10 },
    { valor: 40 },
    { valor: 30 },
    { valor: 70 },
    { valor: 50 },
    { valor: 90 },
    { valor: 65 },
  ];

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

        <div className="grid grid-cols-1 mb-6">
          <Card
            title="Ganancias Netas"
            icon={<FaMoneyBill />}
            value="$0"
            info="Anual: -$62,495.21"
            color="green"
            progress={0}
            status="Crítico"
            chartData={sampleData}
            tooltip="Representa el total de ingresos menos los gastos. Actualizado mensualmente."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card
            title="Gastos Totales"
            icon={<FaShoppingCart />}
            value="$0"
            info="55 transacciones"
            color="red"
            progress={92}
            status="Alto"
            chartData={sampleData}
            tooltip="Todos los gastos registrados en la operación diaria."
          />
          <Card
            title="Ventas"
            icon={<FaBoxOpen />}
            value="0"
            info="Anual: $0"
            color="lime"
            progress={10}
            status="Bajo"
            chartData={sampleData}
            tooltip="Ventas totales registradas hasta la fecha."
          />
          <Card
            title="Inventario"
            icon={<FaWarehouse />}
            value="73"
            info="50 productos en stock"
            color="indigo"
            progress={60}
            status="Estable"
            chartData={sampleData}
            tooltip="Cantidad total de productos actualmente disponibles en inventario."
          />
        </div>
      </div>
      <div className="mt-12 flex justify-center gap-6">
  <motion.button
    className="bg-red-700 text-white px-6 py-3 rounded-lg shadow hover:bg-red-800 transition"
    whileHover={{ scale: 1.05 }}
    onClick={() => navigate('/productos')}
  >
    Ir al Inventario
  </motion.button>

  <motion.button
    className="bg-red-700 text-white px-6 py-3 rounded-lg shadow hover:bg-red-800 transition"
    whileHover={{ scale: 1.05 }}
    onClick={() => navigate('/ventas')}
  >
    Agregar Venta
  </motion.button>
</div>
    </Tooltip.Provider>
  );
}