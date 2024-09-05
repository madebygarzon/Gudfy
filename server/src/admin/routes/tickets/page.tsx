import React, { useState, useEffect } from "react";
import { Table, DropdownMenu, IconButton } from "@medusajs/ui";
import {
  PencilSquare,
  XMark,
  Eye,
  Check,
  ArrowLongRight,
  ArrowLongLeft,
  TriangleDownMini,
  ChatBubble,
  ArrowPathMini,
  BellAlert,
} from "@medusajs/icons";
import Spinner from "../../components/shared/spinner";
import { Input, Select, Button, Heading } from "@medusajs/ui";
import clsx from "clsx";
import { ModalComment } from "../../components/seller-application/modal-commet";
import { RouteConfig } from "@medusajs/admin";

const fakeData = [
  {
    id: 1,
    status: "Cerrado",
    subject: "Problema con la cuenta",
    createdAt: "2024-07-10",
    client: "Elsy Yuliana",
  },
  {
    id: 2,
    status: "Abierto",
    subject: "Error en la aplicación",
    createdAt: "2024-07-11",
    client: "Carlos Garzón",
  },
  {
    id: 3,
    status: "Respondido",
    subject: "Pregunta sobre características",
    createdAt: "2024-07-12",
    client: "luis David Arias",
  },
  {
    id: 4,
    status: "Cerrado",
    subject: "Problema con la cuenta",
    createdAt: "2024-07-10",
    client: "Luis Fernando Rivera",
  },
  {
    id: 5,
    status: "Abierto",
    subject: "Error en la aplicación",
    createdAt: "2024-07-11",
    client: "Alejandra Perez",
  },
  {
    id: 6,
    status: "Respondido",
    subject: "Pregunta sobre características",
    createdAt: "2024-07-12",
    client: "Juan Jose Sosa",
  },
  {
    id: 7,
    status: "Cerrado",
    subject: "Problema con la cuenta",
    createdAt: "2024-07-10",
    client: "Blanca Isabel Aguirre",
  },
  {
    id: 8,
    status: "Abierto",
    subject: "Error en la aplicación",
    createdAt: "2024-07-11",
    client: "Luisa Fernanda Giraldo",
  },
  {
    id: 9,
    status: "Respondido",
    subject: "Pregunta sobre características",
    createdAt: "2024-07-12",
    client: "Alfonso Giraldo Osorio",
  },
];

const TicketsListado = () => {
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
  const [orderDate, setOrderDate] = useState(true);

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
      const subjectIncludes = data.subject
        .toLowerCase()
        .includes(e.toLowerCase());
      return subjectIncludes;
    });
    setDataCustomer({
      ...dataCustomer,
      dataPreview: handlerPreviewSellerAplication(dataFilter, 1),
      dataFilter: dataFilter.length ? dataFilter : [],
    });
  };

  type StatusType = "Cerrado" | "Abierto" | "Respondido";

  const isValidStatus = (status: string): status is StatusType => {
    return ["Cerrado", "Abierto", "Respondido"].includes(status);
  };

  const getStatusColor = (
    status: "Cerrado" | "Abierto" | "Respondido"
  ): string => {
    switch (status) {
      case "Cerrado":
        return "bg-red-200";
      case "Abierto":
        return "bg-green-200";
      case "Respondido":
        return "bg-blue-200";
      default:
        return "";
    }
  };

  return (
    <div className=" bg-white p-8 border border-gray-200 rounded-lg">
      <div className="w-full h-full ">
        <>
          <div className="mt-1 h-[100px] flex justify-between">
            <h1 className=" text-lg font-bold">Mis tickets</h1>
            <div className="flex gap-5 h-full items-end py-4">
              <div className="w-[156px] ">
                <Select onValueChange={handlerFilter}>
                  <Select.Trigger>
                    <Select.Value placeholder="Filtrar por estado: " />
                  </Select.Trigger>
                  <Select.Content>
                    <Select.Item value="All">Todos</Select.Item>
                    <Select.Item value="Cerrado">Cerrado</Select.Item>
                    <Select.Item value="Abierto">Abierto</Select.Item>
                    <Select.Item value="Respondido">Respondido</Select.Item>
                  </Select.Content>
                </Select>
              </div>
              <div className="w-[250px]">
                <Input
                  placeholder="Buscar por asunto"
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
                    <Table.HeaderCell className="flex cursor-pointer items-center">
                      Fecha{" "}
                    </Table.HeaderCell>
                    <Table.HeaderCell>Cliente</Table.HeaderCell>
                    <Table.HeaderCell>Asunto</Table.HeaderCell>
                    <Table.HeaderCell>{""}</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {dataCustomer.dataPreview.map((data) => (
                    <Table.Row key={data.id}>
                      
                      <Table.Cell>
                        {isValidStatus(data.status) ? (
                          <p
                            className={`${getStatusColor(
                              data.status
                            )} px-4 py-2 rounded-lg`}
                          >
                            {data.status}
                          </p>
                        ) : (
                          <p className="px-4 py-2 rounded-lg">{data.status}</p>
                        )}
                      </Table.Cell>
                      <Table.Cell>{DateFormat(data.createdAt)}</Table.Cell>
                      <Table.Cell>{data.client}</Table.Cell>
                      <Table.Cell>{data.subject}</Table.Cell>
                      <Table.Cell className="flex gap-x-2 items-center">
                        <DropdownMenu>
                          <DropdownMenu.Trigger asChild>
                            <IconButton>
                              <PencilSquare className="text-ui-fg-subtle" />
                            </IconButton>
                          </DropdownMenu.Trigger>
                          <DropdownMenu.Content>
                            <DropdownMenu.Item className="gap-x-2">
                              <Check className="text-ui-fg-subtle" />
                              Ver
                            </DropdownMenu.Item>

                            <DropdownMenu.Item className="gap-x-2">
                              <XMark className="text-ui-fg-subtle" />
                              Responder
                            </DropdownMenu.Item>

                            <DropdownMenu.Item className="gap-x-2">
                              <ArrowPathMini className="text-ui-fg-subtle" />
                              Cerrar ticket
                            </DropdownMenu.Item>
                          </DropdownMenu.Content>
                        </DropdownMenu>
                      </Table.Cell>
                    </Table.Row>
                  ))}
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
        <div className="w-[35%]">{`${
          dataCustomer.count || 0
        } solicitudes`}</div>
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

function DateFormat(fechaString) {
  const fecha = new Date(fechaString);
  const meses = [
    "Ene",
    "Feb",
    "Mar",
    "Abr",
    "May",
    "Jun",
    "Jul",
    "Ago",
    "Sep",
    "Oct",
    "Nov",
    "Dic",
  ];
  const dia = fecha.getDate().toString().padStart(2, "0");
  const mes = meses[fecha.getMonth()];
  const año = fecha.getFullYear();
  return `${dia} ${mes} ${año}`;
}
export const config: RouteConfig = {
  link: {
    label: "Tickets",
    // icon: CustomIcon,
  },
};
export default TicketsListado;
