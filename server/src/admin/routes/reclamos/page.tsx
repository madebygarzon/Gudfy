import React, { useState } from "react";
import {
  Table,
  DropdownMenu,
  IconButton,
  Select,
  Button,
  FocusModal,
  Heading,
  Input,
  Label,
  Text,
} from "@medusajs/ui";
import {
  EllipsisHorizontal,
  Plus,
  Trash,
  PencilSquare,
  XMark,
  ArrowLongRight,
  ArrowLongLeft,
  Eye,
} from "@medusajs/icons";
import Spinner from "../../components/shared/spinner";
import { RouteConfig } from "@medusajs/admin";

const fakeData = [
  {
    id: 1,
    status: "Abierto",
    orderNumber: "HH4DSAD5A4DADSAD5S6D",
    productName: "Producto A - Tienda 1",
    createdAt: "2024-07-10 14:23",
    client: "Elsy Yuliana",
  },
  {
    id: 2,
    status: "En proceso",
    orderNumber: "HH4DSAD5A4DADSAD5SDSFS",
    productName: "Producto B - Tienda 2",
    createdAt: "2024-07-11 10:15",
    client: "Carlos Garzón",
  },
  {
    id: 3,
    status: "Cerrado",
    orderNumber: "HH4DSAD5A4DADSAD5SSAD7",
    productName: "Producto C - Tienda 3",
    createdAt: "2024-07-12 09:40",
    client: "Luis David Arias",
  },
  {
    id: 4,
    status: "Abierto",
    orderNumber: "HH4DSAD5A4DADSAD5478",
    productName: "Producto D - Tienda 4",
    createdAt: "2024-07-10 08:00",
    client: "Luis Fernando Rivera",
  },
  {
    id: 5,
    status: "Cerrado",
    orderNumber: "HH4DSAD5545AS88S45AS",
    productName: "Producto E - Tienda 5",
    createdAt: "2024-07-11 15:30",
    client: "Alejandra Perez",
  },
];

const ReclamosListado = () => {
  const [dataCustomer, setDataCustomer] = useState({
    dataSellers: fakeData,
    dataFilter: [],
    dataPreview: fakeData,
    count: fakeData.length,
  });
  const [pageTotal, setPagetotal] = useState(Math.ceil(fakeData.length / 5));
  const [page, setPage] = useState(1);
  const [rowsPages, setRowsPages] = useState(5);
  const [isLoading, setIsLoading] = useState(false);

  const handlerNextPage = (action) => {
    if (action === "NEXT")
      setPage((old) => {
        setDataCustomer({
          ...dataCustomer,
          dataPreview: handlerPreviewSellerAplication(
            dataCustomer.dataFilter.length ? dataCustomer.dataFilter : fakeData,
            page + 1
          ),
        });
        return old + 1;
      });

    if (action === "PREV")
      setPage((old) => {
        setDataCustomer({
          ...dataCustomer,
          dataPreview: handlerPreviewSellerAplication(
            dataCustomer.dataFilter.length ? dataCustomer.dataFilter : fakeData,
            page - 1
          ),
        });
        return old - 1;
      });
  };

  const handlerPreviewSellerAplication = (queryParams, page, rows?) => {
    const dataRowPage = rows || rowsPages;
    const start = (page - 1) * dataRowPage;
    const end = page * dataRowPage;
    const newArray = queryParams.slice(start, end);
    setPagetotal(Math.ceil(queryParams.length / dataRowPage));
    return newArray;
  };

  const handlerFilter = (value) => {
    setPage(1);
    let dataFilter = fakeData;
    if (value !== "All") {
      dataFilter = fakeData.filter((data) => data.status === value);
    }
    setDataCustomer({
      ...dataCustomer,
      dataPreview: handlerPreviewSellerAplication(dataFilter, 1),
      dataFilter: value === "All" ? [] : dataFilter,
    });
  };

  const handlerRowsNumber = (value) => {
    const valueInt = parseInt(value);
    setRowsPages(valueInt);
    setDataCustomer({
      ...dataCustomer,
      dataPreview: handlerPreviewSellerAplication(
        dataCustomer.dataFilter.length ? dataCustomer.dataFilter : fakeData,
        1,
        valueInt
      ),
    });
  };

  const handlerSearcherbar = (e) => {
    const dataFilter = fakeData.filter((data) => {
      return data.orderNumber.toLowerCase().includes(e.toLowerCase());
    });
    setDataCustomer({
      ...dataCustomer,
      dataPreview: handlerPreviewSellerAplication(dataFilter, 1),
      dataFilter: dataFilter.length ? dataFilter : [],
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Cerrado":
        return "bg-red-200";
      case "En proceso":
        return "bg-yellow-200";
      case "Abierto":
        return "bg-green-200";
      default:
        return "";
    }
  };

  return (
    <div className="bg-white p-8 border border-gray-200 rounded-lg">
      <div className="w-full h-full ">
        <>
          <div className="mt-1 h-[100px] flex justify-between">
            <h1 className="text-lg font-bold">Listado de reclamos</h1>
            <div className="flex gap-5 h-full items-end py-4">
              <div className="w-[156px]">
                <Select onValueChange={handlerFilter}>
                  <Select.Trigger>
                    <Select.Value placeholder="Filtrar por estado: " />
                  </Select.Trigger>
                  <Select.Content>
                    <Select.Item value="All">Todos</Select.Item>
                    <Select.Item value="Cerrado">Cerrado</Select.Item>
                    <Select.Item value="En proceso">En proceso</Select.Item>
                    <Select.Item value="Abierto">Abierto</Select.Item>
                  </Select.Content>
                </Select>
              </div>
              <div className="w-[250px]">
                <Input
                  placeholder="Buscar por número de orden"
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
          ) : dataCustomer.dataPreview.length ? (
            <div className="min-h-[293px]">
              <Table>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell className="ml-4">Estado</Table.HeaderCell>
                    <Table.HeaderCell>Número de orden</Table.HeaderCell>
                    <Table.HeaderCell>Producto y Tienda</Table.HeaderCell>
                    <Table.HeaderCell>Fecha y hora</Table.HeaderCell>
                    <Table.HeaderCell>Cliente</Table.HeaderCell>
                    <Table.HeaderCell>{""}</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {dataCustomer.dataPreview.map((data) => (
                    <Table.Row key={data.id}>
                      <Table.Cell>
                        <p
                          className={`${getStatusColor(
                            data.status
                          )} px-4 py-2 rounded-lg`}
                        >
                          {data.status}
                        </p>
                      </Table.Cell>
                      <Table.Cell>{data.orderNumber}</Table.Cell>
                      <Table.Cell>{data.productName}</Table.Cell>
                      <Table.Cell>{data.createdAt}</Table.Cell>
                      <Table.Cell>{data.client}</Table.Cell>
                      <Table.Cell className="flex gap-x-2 items-center">
                        <DropdownMenu>
                          <FocusModal>
                            <FocusModal.Trigger asChild>
                              <IconButton>
                                <Eye className="text-ui-fg-subtle" />
                              </IconButton>
                              {/* <Button>Edit Variant</Button> */}
                            </FocusModal.Trigger>
                            <FocusModal.Content>
                              <FocusModal.Header>
                                {/* <Button>Save</Button> */}
                              </FocusModal.Header>
                              <FocusModal.Body className="flex flex-col items-center py-16">
                                <div className="flex w-full max-w-lg flex-col gap-y-8">
                                  <div className="p-4 bg-white rounded shadow-md">
                                    <div className="mb-4">
                                      <p className="text-gray-600 font-bold mb-2">
                                        Conversación
                                      </p>
                                      <div className="bg-gray-100 p-3 rounded mb-4">
                                        <span className="block text-gray-900 font-medium">
                                          Cliente
                                        </span>
                                        <p className="text-gray-700">
                                          no me sirve el código
                                        </p>
                                      </div>
                                    </div>

                                    <div className="relative mb-4">
                                      <input
                                        type="text"
                                        placeholder="Escribe tu respuesta..."
                                        className="w-full p-3 border border-gray-300 rounded focus:outline-none"
                                      />
                                      <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          fill="none"
                                          viewBox="0 0 24 24"
                                          stroke="currentColor"
                                          className="w-6 h-6 text-gray-500"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M8 12h.01M12 12h.01M16 12h.01M9 16h6m-6-8h6m-8 4h.01m-2-4h.01M16 4h2a2 2 0 012 2v12a2 2 0 01-2 2h-4l-4 4v-4H8a2 2 0 01-2-2V6a2 2 0 012-2h2z"
                                          />
                                        </svg>
                                      </button>
                                    </div>

                                    <p className="text-gray-500 mb-4">
                                      Como vendedor, tiene la opción de escalar
                                      esta discusión al administrador para una
                                      resolución más detallada.
                                    </p>

                                    <button className="w-full bg-orange-500 text-white p-3 rounded hover:bg-orange-600 transition-colors">
                                      Cerrar ticket
                                    </button>
                                    <button className="w-full bg-orange-500 text-white p-3 rounded hover:bg-orange-600 transition-colors">
                                      Cerrar ticket
                                    </button>
                                  </div>
                                </div>
                              </FocusModal.Body>
                            </FocusModal.Content>
                          </FocusModal>
                        </DropdownMenu>

                        {/* <IconButton>
                          <PencilSquare className="text-ui-fg-subtle" />
                        </IconButton> */}
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </div>
          ) : (
            <div className="flex items-center justify-center min-h-[293px]">
              <XMark className="text-ui-fg-subtle" />{" "}
              <span>No hay datos relacionados</span>
            </div>
          )}
        </>
      </div>

      <div className="flex p-6">
        <div className="w-[35%]">{`${dataCustomer.count || 0} reclamos`}</div>
        <div className="flex w-[65%] gap-5 justify-end">
          <span className="text-[12px] mr-[4px]">{`N° Registros: `}</span>
          <div className="text-[12px] w-[50px]">
            <Select onValueChange={handlerRowsNumber} size="small">
              <Select.Trigger>
                <Select.Value placeholder="5" />
              </Select.Trigger>
              <Select.Content>
                {[5, 10, 100].map((num) => (
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

export const config: RouteConfig = {
  link: {
    label: "Reclamos",
    // icon: CustomIcon,
  },
};

export default ReclamosListado;
