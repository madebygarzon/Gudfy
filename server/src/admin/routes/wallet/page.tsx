import React, { useState, useEffect } from "react";
import { Table, DropdownMenu, IconButton } from "@medusajs/ui";
import {
  PencilSquare,
  XMark,
  Check,
  ArrowPathMini,
} from "@medusajs/icons";
import Spinner from "../../components/shared/spinner";
import { Input, Select } from "@medusajs/ui";
import clsx from "clsx";
import { RouteConfig } from "@medusajs/admin";

const fakeData = [
  {
    id: 1,
    storeName: "Tienda A",
    balance: 150.23,
    status: "Liberado",
    createdAt: "2024-09-01",
  },
  {
    id: 2,
    storeName: "Tienda B",
    balance: 200.50,
    status: "Sin liberar",
    createdAt: "2024-09-02",
  },
  {
    id: 3,
    storeName: "Tienda C",
    balance: 320.00,
    status: "Disponible",
    createdAt: "2024-09-03",
  },
  {
    id: 4,
    storeName: "Tienda D",
    balance: 430.75,
    status: "Liberado",
    createdAt: "2024-09-04",
  },
  {
    id: 5,
    storeName: "Tienda E",
    balance: 500.00,
    status: "Sin liberar",
    createdAt: "2024-09-05",
  },
  {
    id: 6,
    storeName: "Tienda F",
    balance: 150.99,
    status: "Disponible",
    createdAt: "2024-09-06",
  },
  {
    id: 7,
    storeName: "Tienda G",
    balance: 230.45,
    status: "Liberado",
    createdAt: "2024-09-07",
  },
  {
    id: 8,
    storeName: "Tienda H",
    balance: 120.33,
    status: "Disponible",
    createdAt: "2024-09-08",
  },
  {
    id: 9,
    storeName: "Tienda I",
    balance: 420.20,
    status: "Sin liberar",
    createdAt: "2024-09-09",
  },
  {
    id: 10,
    storeName: "Tienda J",
    balance: 310.10,
    status: "Liberado",
    createdAt: "2024-09-10",
  },
];

const WalletListado = () => {
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

  const handlerFilter = (value, filterType) => {
    setPage(1);
    let dataFilter = fakeData;
    if (filterType === "status" && value !== "All") {
      dataFilter = fakeData.filter((data) => data.status === value);
    }
    if (filterType === "storeName" && value !== "All") {
      dataFilter = fakeData.filter((data) => data.storeName === value);
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

  const getStatusColor = (status) => {
    switch (status) {
      case "Liberado":
        return "bg-blue-200";
      case "Sin liberar":
        return "bg-purple-200";
      case "Disponible":
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
            <h1 className="text-lg font-bold">Listado de Wallets</h1>
            <div className="flex gap-5 h-full items-end py-4">
              <div className="w-[156px]">
                <Select onValueChange={(value) => handlerFilter(value, "status")}>
                  <Select.Trigger>
                    <Select.Value placeholder="Filtrar por estado: " />
                  </Select.Trigger>
                  <Select.Content>
                    <Select.Item value="All">Todos</Select.Item>
                    <Select.Item value="Liberado">Liberado</Select.Item>
                    <Select.Item value="Sin liberar">Sin liberar</Select.Item>
                    <Select.Item value="Disponible">Disponible</Select.Item>
                  </Select.Content>
                </Select>
              </div>
              <div className="w-[156px]">
                <Select onValueChange={(value) => handlerFilter(value, "storeName")}>
                  <Select.Trigger>
                    <Select.Value placeholder="Filtrar por tienda: " />
                  </Select.Trigger>
                  <Select.Content>
                    <Select.Item value="All">Todas</Select.Item>
                    {fakeData.map((item) => (
                      <Select.Item key={item.storeName} value={item.storeName}>
                        {item.storeName}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select>
              </div>
              <div className="w-[250px]">
                <Input placeholder="Buscar por tienda" type="search" />
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
                    <Table.HeaderCell>Nombre de tienda</Table.HeaderCell>
                    <Table.HeaderCell>Saldo</Table.HeaderCell>
                    <Table.HeaderCell>Estado</Table.HeaderCell>
                    <Table.HeaderCell>Fecha</Table.HeaderCell>
                    <Table.HeaderCell>Más</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {dataCustomer.dataPreview.map((data) => (
                    <Table.Row key={data.id}>
                      <Table.Cell>{data.storeName}</Table.Cell>
                      <Table.Cell>${data.balance.toFixed(2)}</Table.Cell>
                      <Table.Cell>
                        <p
                          className={`${getStatusColor(
                            data.status
                          )} px-4 py-2 rounded-lg`}
                        >
                          {data.status}
                        </p>
                      </Table.Cell>
                      <Table.Cell>{data.createdAt}</Table.Cell>
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
                              Eliminar
                            </DropdownMenu.Item>
                            <DropdownMenu.Item className="gap-x-2">
                              <ArrowPathMini className="text-ui-fg-subtle" />
                              Actualizar
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
            <p className="text-center text-ui-fg-subtle p-5">Sin datos</p>
          )}
        </>
      </div>
      <div className="flex justify-end mt-4">
        <button
          disabled={page === 1}
          onClick={() => handlerNextPage("PREV")}
          className="bg-gray-200 px-4 py-2 mr-2 rounded"
        >
          Anterior
        </button>
        <button
          disabled={page === pageTotal}
          onClick={() => handlerNextPage("NEXT")}
          className="bg-gray-200 px-4 py-2 rounded"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};
export const config: RouteConfig = {
    link: {
      label: "Wallet",
      // icon: CustomIcon,
    },
  };

export default WalletListado;
