import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface MetricsChartProps {
  orderMetrics?: { month: string; total_spent: number; total_orders: number }[];
  sellerMetrics?: {
    store_name: string;
    total_products_sold: number;
    total_balance_paid: number;
  }[];
}

const MetricsChart: React.FC<MetricsChartProps> = ({
  orderMetrics,
  sellerMetrics,
}) => {
  return (
    <div className="w-full h-auto">
      <div className=" flex w-full">
        <div className="p-4 bg-white rounded-lg shadow-md w-1/2">
          <h2 className="text-lg font-bold text-center mb-4">
            💰 Ingresos Mensuales
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={orderMetrics}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="total_spent" fill="#f59e0b" name="Ingresos" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="p-4 bg-white rounded-lg shadow-md w-1/2">
          <h2 className="text-lg font-bold text-center mb-4">
            📈 Ventas Mensuales
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={orderMetrics}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="total_orders" fill="#3b82f6" name="Ventas" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <h2 className="text-2xl font-bold text-center m-4 w-full">
        📦 Metricas Vendedores
      </h2>
      <div className=" flex w-full">
        <div className="p-4 bg-white rounded-lg shadow-md w-1/2">
          <h2 className="text-lg font-bold text-center mb-4">
            📦 Productos Vendidos por Tienda
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={sellerMetrics}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <XAxis dataKey="store_name" tick={false} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="total_products_sold"
                fill="#8884d8"
                name="Productos Vendidos"
                barSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico de Ganancias */}
        <div className="p-4 bg-white rounded-lg shadow-md w-1/2">
          <h2 className="text-lg font-bold text-center mb-4">
            💰 Ganancias por Tienda
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={sellerMetrics}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <XAxis dataKey="store_name" tick={false} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="total_balance_paid"
                fill="#82ca9d"
                name="Ganancias"
                barSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default MetricsChart;
