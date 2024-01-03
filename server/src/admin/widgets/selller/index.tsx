import type { WidgetConfig } from "@medusajs/admin";
import { getListSellerApplication } from "../../actions/seller-application-action/get-seller-application-action";
import { updateSellerAplicationAction } from "../../actions/seller-application-action/update-seller-application-action";
import React, { useState, useEffect } from "react";
import { Table, DropdownMenu, IconButton } from "@medusajs/ui";
import { PencilSquare, XMark, Eye, Check } from "@medusajs/icons";
import Spinner from "../../components/shared/spinner";
import { useQuery } from "@tanstack/react-query";
import { ArrowLongRight, ArrowLongLeft } from "@medusajs/icons";
import { Input, Select } from "@medusajs/ui";

type objectSellerApplication = {
  customer_id: string;
  customer: {
    name: string;
    email: string;
  };
  approved: boolean;
  rejected: boolean;
  created_at: string;
};

type ListDataSellerApplication = {
  dataSellers: Array<objectSellerApplication>;
  dataPreview: Array<objectSellerApplication>;
  count: number;
};
const dataSelecFilter = [
  {
    value: "Todos",
    label: "Todos",
  },
  {
    value: "Aprobado",
    label: "Aprobado",
  },
  {
    value: "Rechazado",
    label: "Rechazado",
  },
  {
    value: "Pendiente",
    label: "Pendiente",
  },
];
const SellerApplication = () => {
  const [dataCustomer, setDataCustomer] = useState<ListDataSellerApplication>({
    dataSellers: [],
    dataPreview: [],
    count: 0,
  });
  const [pageTotal, setPagetotal] = useState<number>(); // paginas totales
  const [rowsPerPages, setRowsPerPages] = useState(2); // numero de filas por pagina
  const [page, setPage] = useState(1);

  const handlerGetListApplication = async () => {
    const dataApplication = await getListSellerApplication();
    setPagetotal(Math.ceil(dataApplication.length / rowsPerPages));
    setDataCustomer({
      dataSellers: dataApplication,
      dataPreview: handlerListSellerAplication(dataApplication, 1),
      count: dataApplication.length,
    });
  };

  const handlerNextPage = (action) => {
    if (action == "NEXT")
      setPage((old) => {
        setDataCustomer({
          ...dataCustomer,
          dataPreview: handlerListSellerAplication(
            dataCustomer.dataSellers,
            page + 1
          ),
        });
        return old + 1;
      });

    if (action == "PREV")
      setPage((old) => {
        setDataCustomer({
          ...dataCustomer,
          dataPreview: handlerListSellerAplication(
            dataCustomer.dataSellers,
            page - 1
          ),
        });
        return old - 1;
      });
  };

  const handlerListSellerAplication = (queryParams, page) => {
    // cadena de array para filtrar segun la pagina , se debe de pensar en cambiar el llamado a la api para poder
    // solicitar unicamente los que se estan pidiendo en la paginacion
    const start = (page - 1) * rowsPerPages;
    const end = page * rowsPerPages;
    const newArray = queryParams.slice(start, end);

    return newArray;
  };

  useEffect(() => {
    handlerGetListApplication();
  }, []);

  const handlerEditstatus = async (e) => {
    updateSellerAplicationAction(e.payload, e.customer_id).then(() => {
      handlerGetListApplication();
      setPage(1);
    });
  };
  const handlerFilter = (value) => {
    setPage(1);
    let dataFilter;
    switch (value) {
      case dataSelecFilter[1].value:
        dataFilter = dataCustomer.dataSellers.filter((data) => data.approved);
        break;
      case dataSelecFilter[2].value:
        dataFilter = dataCustomer.dataSellers.filter((data) => data.rejected);
        break;
      case dataSelecFilter[3].value:
        dataFilter = dataCustomer.dataSellers.filter(
          (data) => !data.approved && !data.rejected
        );
        break;
      default:
        dataFilter = dataCustomer.dataSellers;
        break;
    }
    setPagetotal(Math.ceil(dataFilter.length / rowsPerPages));
    setDataCustomer({
      ...dataCustomer,
      dataPreview: handlerListSellerAplication(dataFilter, 1),
    });
  };

  return (
    <div className=" bg-white p-8 border border-gray-200 rounded-lg">
      <div className="w-full h-full ">
        {dataCustomer.dataPreview.length ? (
          <>
            <div className="mt-2 h-[120px] flex justify-between">
              <h1 className=" text-xl font-bold"> Solicitud de vendedores</h1>
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
                  <Input placeholder="Search" id="search-input" type="search" />
                </div>
              </div>
            </div>
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Fecha Agregada</Table.HeaderCell>
                  <Table.HeaderCell>Usuario</Table.HeaderCell>
                  <Table.HeaderCell>Email</Table.HeaderCell>
                  <Table.HeaderCell>Estado</Table.HeaderCell>
                  <Table.HeaderCell></Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {dataCustomer.dataPreview?.map((data, i) => {
                  return (
                    <Table.Row key={data.customer_id}>
                      <Table.Cell>{formatarFecha(data.created_at)}</Table.Cell>
                      <Table.Cell>{data.customer.name}</Table.Cell>
                      <Table.Cell>{data.customer.email}</Table.Cell>
                      <Table.Cell>
                        {data.approved
                          ? "Aprobado"
                          : data.rejected
                          ? "Rechazado"
                          : "Pendiente"}
                      </Table.Cell>
                      <Table.Cell className="flex gap-x-2 items-center">
                        <IconButton>
                          <Eye />
                        </IconButton>
                        <DropdownMenu>
                          <DropdownMenu.Trigger asChild>
                            <IconButton>
                              <PencilSquare className="text-ui-fg-subtle" />
                            </IconButton>
                          </DropdownMenu.Trigger>
                          <DropdownMenu.Content>
                            <DropdownMenu.Item
                              className="gap-x-2"
                              onClick={() =>
                                handlerEditstatus({
                                  payload: "APROBED",
                                  customer_id: data.customer_id,
                                })
                              }
                            >
                              <Check className="text-ui-fg-subtle" />
                              Aceptar
                            </DropdownMenu.Item>
                            <DropdownMenu.Item
                              className="gap-x-2"
                              onClick={() =>
                                handlerEditstatus({
                                  payload: "REJECT",
                                  customer_id: data.customer_id,
                                })
                              }
                            >
                              <XMark className="text-ui-fg-subtle" />
                              Rechazar
                            </DropdownMenu.Item>
                          </DropdownMenu.Content>
                        </DropdownMenu>
                      </Table.Cell>
                    </Table.Row>
                  );
                })}
              </Table.Body>
            </Table>
          </>
        ) : (
          <Spinner size="large" variant="secondary" />
        )}
      </div>
      <div className="flex justify-between p-4">
        <div>{`${dataCustomer.count} solicitudes`}</div>
        <div className="flex gap-5">
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
function formatarFecha(fechaString: string): string {
  const fecha = new Date(fechaString);
  const opcionesDeFormato: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  const fechaFormateada: string = fecha.toLocaleDateString(
    "en-US",
    opcionesDeFormato
  );
  return fechaFormateada;
}
export const config: WidgetConfig = {
  zone: "customer.list.after",
};

export default SellerApplication;
