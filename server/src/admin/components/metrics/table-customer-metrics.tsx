import React, { useEffect, useState } from "react";
import { Table } from "@medusajs/ui";
import { XMark, ArrowLongRight, ArrowLongLeft } from "@medusajs/icons";
import Spinner from "../../components/shared/spinner";
import { formatDate } from "../../utils/format-date";
import { Select, Input } from "@medusajs/ui";
import { formatPrice } from "../../utils/format-price";

interface DataCustomerMetrics {
  id: string;
  customer_name: string;
  email: string;
  created_at: string;
  num_orders: number;
  num_products: number;
  mvp_order: number;
  expenses: string;
  total_media_order: number;
  phone?: string;
  last_order_date: Date;
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
  total_media_order: number;
  phone?: string;
  last_order_date: Date;
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
        total_media_order: 0,
        phone: "",
        last_order_date: new Date(),
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
        total_media_order: 0,
        phone: "",
        last_order_date: new Date(),
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
        total_media_order: 0,
        phone: "",
        last_order_date: new Date(),
      },
    ],
    count: 0,
  });
  const [pageTotal, setPagetotal] = useState<number>();
  const [page, setPage] = useState(1);
  const [rowsPages, setRowsPages] = useState<number>(20);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);
  const [sortField, setSortField] = useState<'expenses' | 'average' | 'maxPrice' | 'registration' | 'lastOrder' | null>(null);

  const handlerGetListOrder = async () => {
    
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

  const handleSort = (field: 'expenses' | 'average' | 'maxPrice' | 'registration' | 'lastOrder') => {
    // Si se hace clic en el mismo campo, alternar dirección. Si se hace clic en un campo diferente, establecer ascendente
    let newSortDirection: 'asc' | 'desc' | null = 'asc';
    if (sortField === field) {
      newSortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    }
    
    setSortField(field);
    setSortDirection(newSortDirection);
    
    // Obtener los datos actuales para ordenar (filtrados o todos)
    const dataToSort = [...(dataOrder.dataFilter?.length ? dataOrder.dataFilter : dataOrder.dataOrders)];
    
    // Ordenar los datos según el campo seleccionado
    const sortedData = dataToSort.sort((a, b) => {
      if (field === 'expenses') {
        const expensesA = parseFloat(a.expenses);
        const expensesB = parseFloat(b.expenses);
        return newSortDirection === 'asc' ? expensesA - expensesB : expensesB - expensesA;
      } else if (field === 'average') {
        const avgA = a.total_media_order;
        const avgB = b.total_media_order;
        return newSortDirection === 'asc' ? avgA - avgB : avgB - avgA;
      } else if (field === 'maxPrice') {
        const maxA = a.mvp_order;
        const maxB = b.mvp_order;
        return newSortDirection === 'asc' ? maxA - maxB : maxB - maxA;
      } else if (field === 'registration') {
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        return newSortDirection === 'asc' ? dateA - dateB : dateB - dateA;
      } else if (field === 'lastOrder') {
        const dateA = new Date(a.last_order_date).getTime();
        const dateB = new Date(b.last_order_date).getTime();
        return newSortDirection === 'asc' ? dateA - dateB : dateB - dateA;
      }
      return 0;
    });
    
    // Actualizar el estado con los datos ordenados
    setDataCustomer({
      ...dataOrder,
      dataPreview: handlerPreviewSellerAplication(sortedData, page),
      dataFilter: dataOrder.dataFilter?.length ? sortedData : undefined,
      dataOrders: dataOrder.dataFilter?.length ? dataOrder.dataOrders : sortedData,
    });
  };
  
  const handlerSortByExpenses = () => handleSort('expenses');
  const handlerSortByAverage = () => handleSort('average');
  const handlerSortByMaxPrice = () => handleSort('maxPrice');
  const handlerSortByRegistration = () => handleSort('registration');
  const handlerSortByLastOrder = () => handleSort('lastOrder');
  
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
                <Table.HeaderCell>Contancto</Table.HeaderCell>
                <Table.HeaderCell>
                  <button 
                    onClick={handlerSortByRegistration}
                    className="flex items-center gap-1 hover:text-ui-fg-base transition-colors"
                  >
                    Registro
                    <div className="flex flex-col ml-1 text-[10px] leading-none">
                      <span className={sortField === 'registration' && sortDirection === 'asc' ? 'text-blue-500 font-bold' : 'text-gray-400'}>▲</span>
                      <span className={sortField === 'registration' && sortDirection === 'desc' ? 'text-blue-500 font-bold' : 'text-gray-400'}>▼</span>
                    </div>
                  </button>
                </Table.HeaderCell>
                <Table.HeaderCell>
                  <button 
                    onClick={handlerSortByLastOrder}
                    className="flex items-center gap-1 hover:text-ui-fg-base transition-colors"
                  >
                    Última Orden
                    <div className="flex flex-col ml-1 text-[10px] leading-none">
                      <span className={sortField === 'lastOrder' && sortDirection === 'asc' ? 'text-blue-500 font-bold' : 'text-gray-400'}>▲</span>
                      <span className={sortField === 'lastOrder' && sortDirection === 'desc' ? 'text-blue-500 font-bold' : 'text-gray-400'}>▼</span>
                    </div>
                  </button>
                </Table.HeaderCell>
                <Table.HeaderCell>Pedidos</Table.HeaderCell>
                <Table.HeaderCell className="whitespace-nowrap">N°Productos</Table.HeaderCell>
                <Table.HeaderCell>
                  <button 
                    onClick={handlerSortByExpenses}
                    className="flex items-center gap-1 hover:text-ui-fg-base transition-colors"
                  >
                    Gastos
                    <div className="flex flex-col ml-1 text-[10px] leading-none">
                      <span className={sortField === 'expenses' && sortDirection === 'asc' ? 'text-blue-500 font-bold' : 'text-gray-400'}>▲</span>
                      <span className={sortField === 'expenses' && sortDirection === 'desc' ? 'text-blue-500 font-bold' : 'text-gray-400'}>▼</span>
                    </div>
                  </button>
                </Table.HeaderCell>
                <Table.HeaderCell>
                  <button 
                    onClick={handlerSortByAverage}
                    className="flex items-center gap-1 hover:text-ui-fg-base transition-colors"
                  >
                    Promedio
                    <div className="flex flex-col ml-1 text-[10px] leading-none">
                      <span className={sortField === 'average' && sortDirection === 'asc' ? 'text-blue-500 font-bold' : 'text-gray-400'}>▲</span>
                      <span className={sortField === 'average' && sortDirection === 'desc' ? 'text-blue-500 font-bold' : 'text-gray-400'}>▼</span>
                    </div>
                  </button>
                </Table.HeaderCell>
                <Table.HeaderCell className="whitespace-nowrap">
                  <button 
                    onClick={handlerSortByMaxPrice}
                    className="flex items-center gap-1 hover:text-ui-fg-base transition-colors"
                  >
                    Max. Pre.
                    <div className="flex flex-col ml-1 text-[10px] leading-none">
                      <span className={sortField === 'maxPrice' && sortDirection === 'asc' ? 'text-blue-500 font-bold' : 'text-gray-400'}>▲</span>
                      <span className={sortField === 'maxPrice' && sortDirection === 'desc' ? 'text-blue-500 font-bold' : 'text-gray-400'}>▼</span>
                    </div>
                  </button>
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {dataOrder.dataPreview.map((data) => (
                <Table.Row key={data.id}>
                  <Table.Cell>{data.customer_name}</Table.Cell>
                  <Table.Cell>
                    <p>{data.email}</p>
                    <p>{data.phone}</p>
                  </Table.Cell>
                  <Table.Cell>{formatDate(data.created_at)}</Table.Cell>
                  <Table.Cell>{formatDate(data.last_order_date.toString())}</Table.Cell>
                  <Table.Cell>{data.num_orders}</Table.Cell>
                  <Table.Cell>{data.num_products}</Table.Cell>
                  <Table.Cell>{formatPrice(parseFloat(data.expenses))}</Table.Cell>
                  <Table.Cell>${data.total_media_order}</Table.Cell>
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
