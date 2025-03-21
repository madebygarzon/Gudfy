import React, { useEffect, useState } from "react";
import { Table } from "@medusajs/ui";
import { XMark, ArrowLongRight, ArrowLongLeft } from "@medusajs/icons";
import Spinner from "../../components/shared/spinner";
import { formatDate } from "../../utils/format-date";
import { Select, Input } from "@medusajs/ui";

interface TableCustomerMetricsProps {
  sellerTableMetrics: dataCustomerSeller[];
}

export interface dataCustomerSeller {
  store_id: string;
  store_name: string;
  date_order: string;
  wallet_address: string;
  product: number;
  available_balance: number;
  outstanding_balance: number;
  balance_paid: number;
}
type ListDataSellerApplication = {
  dataOrders: Array<dataCustomerSeller>;
  dataFilter?: Array<dataCustomerSeller>;
  dataPreview: Array<dataCustomerSeller>;
  count: number;
};

const registerNumber = [20, 50, 100];
const TableSellerMetrics: React.FC<TableCustomerMetricsProps> = ({
  sellerTableMetrics,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [dataOrder, setDataCustomer] = useState<ListDataSellerApplication>({
    dataOrders: [
      {
        store_id: "",
        store_name: "",
        date_order: "",
        wallet_address: "",
        product: 0,
        available_balance: 0,
        outstanding_balance: 0,
        balance_paid: 0,
      },
    ],
    dataFilter: [
      {
        store_id: "",
        store_name: "",
        date_order: "",
        wallet_address: "",
        product: 0,
        available_balance: 0,
        outstanding_balance: 0,
        balance_paid: 0,
      },
    ],
    dataPreview: [
      {
        store_id: "",
        store_name: "",
        date_order: "",
        wallet_address: "",
        product: 0,
        available_balance: 0,
        outstanding_balance: 0,
        balance_paid: 0,
      },
    ],
    count: 0,
  });
  const [pageTotal, setPagetotal] = useState<number>();
  const [page, setPage] = useState(1);
  const [rowsPages, setRowsPages] = useState<number>(20);

  const handlerGetListOrder = async () => {
    console.log(
      "estos son los datos de la tabla de la tienda",
      sellerTableMetrics
    );
    if (!sellerTableMetrics?.length) return;
    setPagetotal(Math.ceil(sellerTableMetrics.length / rowsPages));
    setDataCustomer({
      dataOrders: sellerTableMetrics,
      dataPreview: handlerPreviewSellerAplication(sellerTableMetrics, 1),
      count: sellerTableMetrics.length,
    });
    setIsLoading(false);
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
    queryParams: Array<dataCustomerSeller>,
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
  }, [sellerTableMetrics]);

  return (
    <div>
      <div className="mt-2 h-[120px] flex justify-between">
        <h1 className="text-xl font-bold">📊 Tabla Vendedores</h1>
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
                <Table.HeaderCell>Nombre Tienda</Table.HeaderCell>
                <Table.HeaderCell>Creado</Table.HeaderCell>
                <Table.HeaderCell>Dirección Wallet</Table.HeaderCell>
                <Table.HeaderCell>Productos</Table.HeaderCell>
                <Table.HeaderCell>Saldo Disponible</Table.HeaderCell>
                <Table.HeaderCell>Saldo Pendiente</Table.HeaderCell>
                <Table.HeaderCell>Saldo Pagado</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {dataOrder.dataPreview.map((data) => (
                <Table.Row key={data.store_id}>
                  <Table.Cell>{data.store_name}</Table.Cell>
                  <Table.Cell>{formatDate(data.date_order)}</Table.Cell>
                  <Table.Cell>{data.wallet_address}</Table.Cell>
                  <Table.Cell>{data.product}</Table.Cell>
                  <Table.Cell>${data.available_balance}</Table.Cell>
                  <Table.Cell>${data.outstanding_balance}</Table.Cell>
                  <Table.Cell>${data.balance_paid}</Table.Cell>
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
        <div className="w-[35%]">{`${dataOrder.count || 0} Vendedores`}</div>
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

export default TableSellerMetrics;
