import type { RouteConfig, WidgetConfig } from "@medusajs/admin";
import React, { useState, useEffect } from "react";
import { getMetricsSeller } from "../../actions/metrics/get-list-seller";
import { getMetricsListStoreOrderCustomer } from "../../actions/metrics/get-list-store-orders-customer";
import TableCustomerMetrics from "../../components/metrics/table-customer-metrics";
import TableSellerMetrics from "../../components/metrics/table-seller-metrics";

import MetricsChart from "../../components/metrics/metrics-chart";

type ListDataSellerApplication = {
  dataOrders: Array<dataCustomerMetrics>;
  dataFilter?: Array<dataCustomerMetrics>;
  dataPreview: Array<dataCustomerMetrics>;
  count: number;
};
export interface dataCustomerMetrics {
  id: string;
  customer_name: string;
  email: string;
  created_at: string;
  num_orders: number;
  num_products: number;
  mvp_order: number;
  expenses: number;
}

const Metrics = ({ data }) => {
  const [customer_metrics, setDataCustomer] = useState();
  const [sellerTableMetrics, setSellerTableMetrics] = useState();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [orderMetrics, setOrder_metrics] =
    useState<{ month: string; total_spent: number; total_orders: number }[]>();
  const [sellerMetrics, setSellerMetrics] = useState<
    {
      store_name: string;
      total_products_sold: number;
      total_balance_paid: number;
    }[]
  >();

  const handlerGetData = async () => {
    setIsLoading(true);
    const dataMetrics = await getMetricsListStoreOrderCustomer()
      .then((e) => {
        setIsLoading(false);
        return e;
      })
      .catch((e) => {});
    setOrder_metrics(dataMetrics.order_metrics);
    setDataCustomer(dataMetrics.customer_metrics);
  };

  useEffect(() => {
    handlerGetData();
    getMetricsSeller().then((data) => {
      setSellerMetrics(data.metrics);
      setSellerTableMetrics(data.table);
    });
  }, []);

  return (
    <div className="bg-white p-8 border border-gray-200 rounded-lg">
      <MetricsChart orderMetrics={orderMetrics} sellerMetrics={sellerMetrics} />
      <TableCustomerMetrics
        customer_metrics={customer_metrics}
        isLoading={isLoading}
      />
      <TableSellerMetrics sellerTableMetrics={sellerTableMetrics} />
    </div>
  );
};

export const config: RouteConfig = {
  link: {
    label: "Metricas",
    // icon: CustomIcon,
  },
};

export default Metrics;
