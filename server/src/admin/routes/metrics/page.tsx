import type { RouteConfig, WidgetConfig } from "@medusajs/admin";
import React, { useState, useEffect } from "react";
import { XMark, ArrowLongRight, ArrowLongLeft, Eye } from "@medusajs/icons";
import Spinner from "../../components/shared/spinner";
import { Table, Input, Select } from "@medusajs/ui";
import { formatDate } from "../../utils/format-date";
import { getMetricsListStoreOrderCustomer } from "../../actions/orders/get-list-store-orders-customer";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const salesData = [
  { month: "Ene", ventas: 150, ingresos: 3000 },
  { month: "Feb", ventas: 200, ingresos: 4500 },
  { month: "Mar", ventas: 170, ingresos: 4200 },
  { month: "Abr", ventas: 220, ingresos: 5000 },
  { month: "May", ventas: 300, ingresos: 7000 },
  { month: "Jun", ventas: 250, ingresos: 6000 },
];
export interface dataCustomerMetrics {
  id: string;
  customer_name: string;
  email: string;
  created_at: string;
  num_orders: number;
  num_products: number;
  mvp_order: number;
  expenses: string;
}

type ListDataSellerApplication = {
  dataOrders: Array<dataCustomerMetrics>;
  dataFilter?: Array<dataCustomerMetrics>;
  dataPreview: Array<dataCustomerMetrics>;
  count: number;
};

const registerNumber = [20, 50, 100];

const SellerApplication = ({ data }) => {
  //manejo de la tabla --------------

  const [dataOrder, setDataCustomer] = useState<ListDataSellerApplication>({
    dataOrders: [
      {
        id: "",
        customer_name: "",
        email: "",
        created_at: "",
        num_orders: 0,
        num_products: 0,
        mvp_order: 0,
        expenses: "",
      },
    ],
    dataFilter: [
      {
        id: "",
        customer_name: "",
        email: "",
        created_at: "",
        num_orders: 0,
        num_products: 0,
        mvp_order: 0,
        expenses: "",
      },
    ],
    dataPreview: [
      {
        id: "",
        customer_name: "",
        email: "",
        created_at: "",
        num_orders: 0,
        num_products: 0,
        mvp_order: 0,
        expenses: "",
      },
    ],
    count: 0,
  });
  const [pageTotal, setPagetotal] = useState<number>();
  const [page, setPage] = useState(1);
  const [rowsPages, setRowsPages] = useState<number>(20);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const handlerGetListOrder = async () => {
    setIsLoading(true);
    const dataApplication = await getMetricsListStoreOrderCustomer()
      .then((e) => {
        setIsLoading(false);
        return e;
      })
      .catch((e) => {});
    if (!dataApplication) return;
    setPagetotal(Math.ceil(dataApplication.length / rowsPages));
    setDataCustomer({
      dataOrders: dataApplication,
      dataPreview: handlerPreviewSellerAplication(dataApplication, 1),
      count: dataApplication.length,
    });
  };

  const handlerNextPage = (action) => {
    if (action == "NEXT")
      setPage((old) => {
        const dataToUse = dataOrder.dataFilter?.length
          ? dataOrder.dataFilter
          : dataOrder.dataOrders;
        setDataCustomer({
          ...dataOrder,
          dataPreview: handlerPreviewSellerAplication(dataToUse, page + 1),
        });
        return old + 1;
      });

    if (action == "PREV")
      setPage((old) => {
        const dataToUse = dataOrder.dataFilter?.length
          ? dataOrder.dataFilter
          : dataOrder.dataOrders;
        setDataCustomer({
          ...dataOrder,
          dataPreview: handlerPreviewSellerAplication(dataToUse, page - 1),
        });
        return old - 1;
      });
  };

  const handlerPreviewSellerAplication = (
    queryParams: Array<dataCustomerMetrics>,
    page,
    rows?
  ) => {
    const dataRowPage = rows || rowsPages;
    const start = (page - 1) * dataRowPage;
    const end = page * dataRowPage;
    const newArray = queryParams.slice(start, end);
    setPagetotal(Math.ceil(queryParams.length / dataRowPage));
    return newArray;
  };

  useEffect(() => {
    handlerGetListOrder();
  }, []);

  const handlerRowsNumber = (value) => {
    const valueInt = parseInt(value);
    setRowsPages(valueInt);
    setDataCustomer({
      ...dataOrder,
      dataPreview: handlerPreviewSellerAplication(
        dataOrder.dataFilter! ? dataOrder.dataFilter : dataOrder.dataOrders,
        1,
        valueInt
      ),
    });
  };

  const handlerSearcherbar = (e: string) => {
    // const dataFilter = dataOrder.dataOrders.filter((data) => {
    //   const nameIncludes = data.email.toLowerCase().includes(e.toLowerCase());
    //   const emailIncludes = data.id.toLowerCase().includes(e.toLowerCase());
    //   const name = (data.person_name + " " + data.person_last_name)
    //     .toLowerCase()
    //     .toLowerCase()
    //     .includes(e.toLowerCase());
    //   // Devuelve true si la palabra enviada está incluida en el nombre o el correo electrónico
    //   return nameIncludes || emailIncludes || name;
    // });
    // setDataCustomer({
    //   ...dataOrder,
    //   dataPreview: handlerPreviewSellerAplication(dataFilter, 1),
    //   dataFilter: dataFilter.length ? dataFilter : [],
    // });
  };

  return (
    <div className=" bg-white p-8 border border-gray-200 rounded-lg ">
      <div className="w-full h-auto ">
        <div className=" flex w-full">
          <div className="p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-lg font-bold text-center mb-4">
              💰 Ingresos Mensuales
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="ingresos" fill="#f59e0b" name="Ingresos" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-lg font-bold text-center mb-4">
              📈 Ventas Mensuales
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="ventas" fill="#3b82f6" name="Ventas" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <>
          <div className="mt-2 h-[120px] flex justify-between">
            <h1 className=" text-xl font-bold"> Metricas Clientes</h1>
            <div className="flex gap-5 h-full items-end py-4">
              <div className="w-[156px] "></div>
              <div className="w-[250px]">
                <Input
                  placeholder="Buscar por nombre"
                  id="search-input"
                  type="search"
                  onChange={(e) => handlerSearcherbar(e.target.value)}
                />
              </div>
            </div>
          </div>
          {isLoading ? (
            <div className="min-h-[293px] flex items-center justify-center">
              <Spinner size="large" variant="secondary" />
            </div>
          ) : dataOrder.dataPreview?.length ? (
            <div className="min-h-[293px]">
              <Table>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>Nombre</Table.HeaderCell>
                    <Table.HeaderCell>Correo electronico</Table.HeaderCell>
                    <Table.HeaderCell>Fecha de Registro</Table.HeaderCell>
                    <Table.HeaderCell>Pedidos</Table.HeaderCell>
                    <Table.HeaderCell>Cantidad Productos</Table.HeaderCell>
                    <Table.HeaderCell>Gastos</Table.HeaderCell>
                    <Table.HeaderCell>VMP</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {dataOrder.dataPreview?.map((data, i) => {
                    return (
                      <Table.Row key={data?.id}>
                        <Table.Cell>{data?.customer_name}</Table.Cell>
                        <Table.Cell>{data?.email}</Table.Cell>
                        <Table.Cell>{formatDate(data?.created_at)}</Table.Cell>
                        <Table.Cell>{data?.num_orders}</Table.Cell>
                        <Table.Cell>{data?.num_products}</Table.Cell>
                        <Table.Cell>{data?.expenses}</Table.Cell>
                        <Table.Cell>{data?.mvp_order}</Table.Cell>
                      </Table.Row>
                    );
                  })}
                </Table.Body>
              </Table>
            </div>
          ) : (
            <div className=" flex items-center justify-center min-h-[293px]">
              <XMark className="text-ui-fg-subtle" />{" "}
              <span>No hay datos relacionados</span>
            </div>
          )}
        </>
      </div>

      <div className="flex p-6">
        <div className="w-[35%]">{`${dataOrder.count || 0} solicitudes`}</div>
        <div className="flex w-[65%] gap-5 justify-end">
          <span className="text-[12px] mr-[4px]">{`N° Registros: `}</span>
          <div className="text-[12px] w-[50px]">
            <Select onValueChange={handlerRowsNumber} size="small">
              <Select.Trigger>
                <Select.Value placeholder="20" />
              </Select.Trigger>
              <Select.Content>
                {registerNumber.map((num) => (
                  <Select.Item key={num} value={`${num}`}>
                    {num}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select>
          </div>
          <>
            {page} of {pageTotal}
          </>
          <button
            disabled={page == 1 ? true : false}
            onClick={() => handlerNextPage("PREV")}
          >
            <ArrowLongLeft />
          </button>

          <button
            disabled={page == pageTotal ? true : false}
            onClick={() => handlerNextPage("NEXT")}
          >
            <ArrowLongRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export const config: RouteConfig = {
  link: {
    label: "Metricas",
    // icon: CustomIcon,
  },
};

export default SellerApplication;
