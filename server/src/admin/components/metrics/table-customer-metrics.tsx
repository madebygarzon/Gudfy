import React, { useEffect, useState } from "react";
import { Table } from "@medusajs/ui";
import { XMark, ArrowLongRight, ArrowLongLeft } from "@medusajs/icons";
import Spinner from "../../components/shared/spinner";
import { formatDate } from "../../utils/format-date";
import { Select, Input } from "@medusajs/ui";

interface DataCustomerMetrics {
  id: string;
  customer_name: string;
  email: string;
  created_at: string;
  num_orders: number;
  num_products: number;
  mvp_order: number;
  expenses: string;
}

interface TableCustomerMetricsProps {
  isLoading: boolean;
  customer_metrics: DataCustomerMetrics[];
}

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
const TableCustomerMetrics: React.FC<TableCustomerMetricsProps> = ({
  isLoading,
  customer_metrics,
}) => {
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

  const handlerGetListOrder = async () => {
    console.log("entra a las metricas del customer", customer_metrics);
    if (!customer_metrics?.length) return;
    setPagetotal(Math.ceil(customer_metrics.length / rowsPages));
    setDataCustomer({
      dataOrders: customer_metrics,
      dataPreview: handlerPreviewSellerAplication(customer_metrics, 1),
      count: customer_metrics.length,
    });
  };

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

  const handlerSearcherbar = (e: string) => {};

  useEffect(() => {
    handlerGetListOrder();
  }, [customer_metrics]);

  return (
    <div>
      <div className="mt-2 h-[120px] flex justify-between">
        <h1 className="text-xl font-bold">📊 Tabla Clientes</h1>
        <div className="flex gap-5 py-4">
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
                <Table.HeaderCell>Correo electrónico</Table.HeaderCell>
                <Table.HeaderCell>Fecha de Registro</Table.HeaderCell>
                <Table.HeaderCell>Pedidos</Table.HeaderCell>
                <Table.HeaderCell>Cantidad Productos</Table.HeaderCell>
                <Table.HeaderCell>Gastos</Table.HeaderCell>
                <Table.HeaderCell>VMP</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {dataOrder.dataPreview.map((data) => (
                <Table.Row key={data.id}>
                  <Table.Cell>{data.customer_name}</Table.Cell>
                  <Table.Cell>{data.email}</Table.Cell>
                  <Table.Cell>{formatDate(data.created_at)}</Table.Cell>
                  <Table.Cell>{data.num_orders}</Table.Cell>
                  <Table.Cell>{data.num_products}</Table.Cell>
                  <Table.Cell>{data.expenses}</Table.Cell>
                  <Table.Cell>{data.mvp_order}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      ) : (
        <div className="flex items-center justify-center min-h-[293px]">
          <XMark className="text-ui-fg-subtle" />
          <span>No hay datos relacionados</span>
        </div>
      )}

      <div className="flex p-6">
        <div className="w-[35%]">{`${dataOrder.count || 0} Clientes`}</div>
        <div className="flex w-[65%] gap-5 justify-end">
          <span className="text-[12px] mr-[4px]">N° Registros:</span>
          <div className="text-[12px] w-[50px]">
            <Select onValueChange={handlerRowsNumber} size="small">
              <Select.Trigger>
                <Select.Value placeholder={`${rowsPages}`} />
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
          <span>{`${page} de ${pageTotal}`}</span>
          <button disabled={page === 1} onClick={() => handlerNextPage("PREV")}>
            <ArrowLongLeft />
          </button>
          <button
            disabled={page === pageTotal}
            onClick={() => handlerNextPage("NEXT")}
          >
            <ArrowLongRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TableCustomerMetrics;
