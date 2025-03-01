import type { WidgetConfig } from "@medusajs/admin";
import React, { useState, useEffect } from "react";
import { XMark, ArrowLongRight, ArrowLongLeft, Eye } from "@medusajs/icons";
import Spinner from "../../components/shared/spinner";
import {
  Table,
  Input,
  Select,
  Label,
  FocusModal,
  Button,
  Text,
  Heading,
  IconButton,
  Drawer,
} from "@medusajs/ui";

import { formatDate } from "../../utils/format-date";
import { getListStoreOrder } from "../../actions/orders/get-list-store-orders";
import OrderCancel from "./order-cancel";
import OrderDetail from "./order-detail";

export interface order {
  id: string;
  pay_method_id: string;
  created_at: string;
  sellerapproved: string;
  customerapproved: string;
  quantity_products: number;
  total_price: string;
  person_name: string;
  person_last_name: string;
  email: string;
  conty: string;
  city: string;
  phone: string;
  state_order:
    | "Completado"
    | "Cancelada"
    | "Pendiente de pago"
    | "Finalizado"
    | "En discusión";
  store_variant: [
    {
      store_id: string;
      store_name: string;
      store_variant_order_id: string;
      variant_order_status_id: string;
      produc_title: string;
      price: string;
      quantity: string;
      total_price_for_product: string;
      serial_code_products: [{ id: string; serial: string }];
    }
  ];
}

type ListDataSellerApplication = {
  dataOrders: Array<order>;
  dataFilter?: Array<order>;
  dataPreview: Array<order>;
  count: number;
};

const dataSelecFilter = [
  {
    value: "All",
    label: "Todos",
  },
  {
    value: "A",
    label: "Aprobado",
  },
  {
    value: "C",
    label: "Pendiente",
  },
  {
    value: "B",
    label: "Rechazado",
  },
  {
    value: "D",
    label: "A Corrección",
  },
  {
    value: "E",
    label: "Corregido",
  },
];
const registerNumber = [20, 50, 100];
// numero de filas por pagina predeterminado
const APPROVED = "APPROVED";
const REJECTED = "REJECTED";
const CORRECT = "CORRECT";

const SellerApplication = () => {
  //manejo de la tabla --------------
  const [dataOrder, setDataCustomer] = useState<ListDataSellerApplication>({
    dataOrders: [],
    dataFilter: [],
    dataPreview: [],
    count: 0,
  });
  const [pageTotal, setPagetotal] = useState<number>(); // paginas totales
  const [page, setPage] = useState(1);
  const [rowsPages, setRowsPages] = useState<number>(20);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [orderDate, setOrderDate] = useState<boolean>(true);
  const [selectOrderData, setTelectOrderData] = useState<order>();
  //----------------------------------

  //datos para el control y actualizacion del status
  const [filterStatus, setFilterStatus] = useState<
    | "Cancelada"
    | "Completado"
    | "En discusión"
    | "Finalizado"
    | "Pagado"
    | "Pendiente de pago"
    | "all"
  >("all");

  //modal para ver el detalle de la orden
  const [open, onOpenChange] = useState(false);

  const handlerReset = () => {};

  const handlerGetListApplication = async (order?: string) => {
    setIsLoading(true);
    const dataApplication = await getListStoreOrder(order)
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
        const dataToUse = dataOrder.dataFilter.length
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
        const dataToUse = dataOrder.dataFilter.length
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
    queryParams: Array<order>,
    page,
    rows?
  ) => {
    // cadena de array para filtrar segun la pagina , se debe de pensar en cambiar el llamado a la api para poder
    // solicitar unicamente los que se estan pidiendo en la paginacion
    const dataRowPage = rows || rowsPages;
    const start = (page - 1) * dataRowPage;
    const end = page * dataRowPage;
    const newArray = queryParams.slice(start, end);
    //setPage(1);
    setPagetotal(Math.ceil(queryParams.length / dataRowPage));
    return newArray;
  };

  useEffect(() => {
    handlerGetListApplication();
  }, []);

  const handlerActionStatus = async () => {};
  const handlerFilter = (value) => {
    // setPage(1);
    // let dataFilter;
    // switch (value) {
    //   case dataSelecFilter[1].value:
    //     dataFilter = dataOrder.dataOrders.filter(
    //       (data) => data.state_application.id === dataSelecFilter[1].value
    //     );
    //     break;
    //   case dataSelecFilter[2].value:
    //     dataFilter = dataOrder.dataOrders.filter(
    //       (data) => data.state_application.id === dataSelecFilter[2].value
    //     );
    //     break;
    //   case dataSelecFilter[3].value:
    //     dataFilter = dataOrder.dataOrders.filter(
    //       (data) => data.state_application.id === dataSelecFilter[3].value
    //     );
    //     break;
    //   case dataSelecFilter[4].value:
    //     dataFilter = dataCustomer.dataSellers.filter(
    //       (data) => data.state_application.id === dataSelecFilter[4].value
    //     );
    //     break;
    //   case dataSelecFilter[5].value:
    //     dataFilter = dataCustomer.dataSellers.filter(
    //       (data) => data.state_application.id === dataSelecFilter[5].value
    //     );
    //     break;
    //   default:
    //     dataFilter = dataCustomer.dataSellers;
    //     break;
    // }
    // setDataCustomer({
    //   ...dataCustomer,
    //   dataPreview: handlerPreviewSellerAplication(dataFilter, 1),
    //   dataFilter: value === dataSelecFilter[0].value ? [] : dataFilter,
    // });
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

  const handlerOrderDate = (value: boolean) => {
    handlerGetListApplication(value ? "ASC" : "DESC");
    setOrderDate((data) => !data);
  };
  const handlerSearcherbar = (e: string) => {
    // const dataFilter = dataOrder.dataOrders.filter((data) => {
    //   const nameIncludes = data.customer.name
    //     .toLowerCase()
    //     .includes(e.toLowerCase());
    //   const emailIncludes = data.customer.email
    //     .toLowerCase()
    //     .includes(e.toLowerCase());
    //   // Devuelve true si la palabra enviada está incluida en el nombre o el correo electrónico
    //   return nameIncludes || emailIncludes;
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
        <>
          <div className="mt-2 h-[120px] flex justify-between">
            <h1 className=" text-xl font-bold"> Lista de ordenes</h1>
            <div className="flex gap-5 h-full items-end py-4">
              <div className="w-[156px] ">
                <Select onValueChange={handlerFilter}>
                  <Select.Trigger>
                    <Select.Value placeholder="Filtar por: " />
                  </Select.Trigger>
                  <Select.Content>
                    {dataSelecFilter.map((item) => (
                      <Select.Item key={item.value} value={item.value}>
                        {item.label}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select>
              </div>
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
          ) : dataOrder.dataPreview.length ? (
            <div className="min-h-[293px]">
              <Table>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>Estado</Table.HeaderCell>
                    <Table.HeaderCell>Número de orden</Table.HeaderCell>
                    <Table.HeaderCell>Usuario</Table.HeaderCell>
                    <Table.HeaderCell>Fecha y hora</Table.HeaderCell>
                    <Table.HeaderCell>Email Cliente</Table.HeaderCell>
                    <Table.HeaderCell>Tiempo a pagar</Table.HeaderCell>
                    <Table.HeaderCell>Detalle</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {dataOrder.dataPreview?.map((data, i) => {
                    return (
                      <Table.Row key={data.id}>
                        <Table.Cell>{data.state_order}</Table.Cell>
                        <Table.Cell>{data.id}</Table.Cell>
                        <Table.Cell>
                          {data.person_name + " " + data.person_last_name}
                        </Table.Cell>
                        <Table.Cell>{formatDate(data.created_at)}</Table.Cell>
                        <Table.Cell>{data.email}</Table.Cell>
                        <Table.Cell>{"123"}</Table.Cell>
                        <Table.Cell>
                          <IconButton
                            onClick={() => {
                              setTelectOrderData(data);
                              onOpenChange(true);
                            }}
                          >
                            <Eye />
                          </IconButton>
                        </Table.Cell>
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

      <FocusModalDemo
        handleReset={handlerReset}
        isOpen={open}
        onOpenChange={onOpenChange}
        orderData={selectOrderData}
      />
    </div>
  );
};

interface ModalOrder {
  orderData?: order;
  isOpen: boolean;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
  handleReset: () => void;
}

function FocusModalDemo({
  orderData,
  isOpen,
  onOpenChange,
  handleReset,
}: ModalOrder) {
  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <Drawer.Content className="w-1/2 right-0">
        <Drawer.Header>
          <Drawer.Title>Edit Variant</Drawer.Title>
        </Drawer.Header>
        <Drawer.Body className="flex flex-col items-center justify-center py-16">
          {orderData?.state_order === "Cancelada" ? (
            <OrderCancel orderData={orderData} />
          ) : (
            <OrderDetail
              customer={orderData?.person_name + orderData?.person_last_name}
              orderData={orderData}
            />
          )}
        </Drawer.Body>
      </Drawer.Content>
    </Drawer>
  );
}

export const config: WidgetConfig = {
  zone: "order.list.before",
};

export default SellerApplication;
