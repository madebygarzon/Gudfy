import React, { useState, useEffect } from "react";
import { Table, Drawer } from "@medusajs/ui";
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
import { getListTickets } from "../../actions/tickets/get-list-tickets";
import ViewTicket from "../../components/view-ticket";
import { updateTicketStatus } from "../../actions/tickets/update-ticket-status";

interface Ticket {
  id: string;
  status: "Cerrado" | "Abierto" | "Respondido";
  subject: string;
  last_name: string;
  first_name: string;
  created_at: string;
}

const TicketsListado = () => {
  const [dataTickets, setDataTickets] = useState<{
    dataTickets: Ticket[];
    dataFilter: Ticket[];
    dataPreview: Ticket[];
    count: number;
  }>({
    dataTickets: [],
    dataFilter: [],
    dataPreview: [],
    count: 0,
  });
  const [pageTotal, setPagetotal] = useState(
    Math.ceil(dataTickets.dataFilter.length / 5)
  );
  const [page, setPage] = useState(1);
  const [rowsPages, setRowsPages] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [orderDate, setOrderDate] = useState(true);

  const handlerNextPage = (action) => {
    if (action === "NEXT")
      setPage((old) => {
        setDataTickets({
          ...dataTickets,
          dataPreview: handlerPreviewSellerAplication(
            dataTickets.dataFilter.length
              ? dataTickets.dataFilter
              : dataTickets.dataTickets,
            page + 1
          ),
        });
        return old + 1;
      });

    if (action === "PREV")
      setPage((old) => {
        setDataTickets({
          ...dataTickets,
          dataPreview: handlerPreviewSellerAplication(
            dataTickets.dataFilter.length
              ? dataTickets.dataFilter
              : dataTickets.dataTickets,
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
    let dataFilter = dataTickets.dataTickets;
    if (value !== "All") {
      dataFilter = dataTickets.dataTickets.filter(
        (data) => data.status === value
      );
    }
    setDataTickets({
      ...dataTickets,
      dataPreview: handlerPreviewSellerAplication(dataFilter, 1),
      dataFilter: value === "All" ? [] : dataFilter,
    });
  };

  const handlerRowsNumber = (value) => {
    const valueInt = parseInt(value);
    setRowsPages(valueInt);
    setDataTickets({
      ...dataTickets,
      dataPreview: handlerPreviewSellerAplication(
        dataTickets.dataFilter.length
          ? dataTickets.dataFilter
          : dataTickets.dataTickets,
        1,
        valueInt
      ),
    });
  };

  const handlerSearcherbar = (e) => {
    const dataFilter = dataTickets.dataTickets.filter((data) => {
      const subjectIncludes = data.subject
        .toLowerCase()
        .includes(e.toLowerCase());
      return subjectIncludes;
    });
    setDataTickets({
      ...dataTickets,
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
  const handlerGetListTickets = () => {
    getListTickets().then((e: Ticket[]) => {
      setDataTickets({
        dataTickets: e,
        dataFilter: e,
        dataPreview: e,
        count: e.length,
      });
    });
  };
  useEffect(() => {
    handlerGetListTickets();
  }, []);

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
          ) : dataTickets.dataPreview.length ? (
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
                  {dataTickets.dataPreview.map((data) => (
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
                      <Table.Cell>{DateFormat(data.created_at)}</Table.Cell>
                      <Table.Cell>
                        {data.first_name + data.last_name}
                      </Table.Cell>
                      <Table.Cell>{data.subject}</Table.Cell>
                      <Table.Cell className="flex gap-x-2 items-center">
                        <ModalViewTicket
                          handlerReset={handlerGetListTickets}
                          subject={data.subject}
                          status={data.status}
                          ticketId={data.id}
                        />
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
        <div className="w-[35%]">{`${dataTickets.count || 0} solicitudes`}</div>
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

interface propsModal {
  handlerReset: () => void;
  subject: string;
  ticketId: string;
  status: "Cerrado" | "Abierto" | "Respondido";
}

const ModalViewTicket = ({
  subject,
  ticketId,
  handlerReset,
  status,
}: propsModal) => {
  const handlerUpdateTicket = async (statusid: "Answered_ID" | "Closed_ID") => {
    updateTicketStatus(ticketId, statusid).then(() => {
      handlerReset();
    });
  };
  return (
    <Drawer>
      <Drawer.Trigger asChild>
        <Button>Ver conversación </Button>
      </Drawer.Trigger>
      <Drawer.Content className="w-[60%] right-0">
        <Drawer.Header className="flex flex-col gap-1"></Drawer.Header>
        <Drawer.Body className="">
          <ViewTicket
            handlerReset={handlerReset}
            subject={subject}
            ticketId={ticketId}
            status={status}
          />
        </Drawer.Body>
        <Drawer.Footer className="justify-between px-5">
          {status == "Cerrado" || status == "Respondido" ? (
            <></>
          ) : (
            <div className="">
              <Button
                className="bg-red-500 hover:bg-red-600 mx-2"
                onClick={() => handlerUpdateTicket("Closed_ID")}
              >
                {" "}
                Cancelar Ticket
              </Button>
              <Button
                className="bg-blue-500  hover:bg-blue-600 mx-2"
                onClick={() => handlerUpdateTicket("Answered_ID")}
              >
                {" "}
                Finalizar Ticket
              </Button>
            </div>
          )}
          <Drawer.Close asChild>
            <Button variant="secondary">Cerrar</Button>
          </Drawer.Close>
        </Drawer.Footer>
      </Drawer.Content>
    </Drawer>
  );
};

export default TicketsListado;
