import type { WidgetConfig } from "@medusajs/admin";
import { Link } from "react-router-dom";

import React, { useState, useEffect } from "react";
import { Table, DropdownMenu, IconButton } from "@medusajs/ui";
import { Thumbnail } from "../../components/thumbnail";
import {
  PencilSquare,
  XMark,
  Eye,
  Check,
  ArrowLongRight,
  ArrowLongLeft,
  TriangleDownMini,
  ChatBubble,
  ArrowDownTray,
} from "@medusajs/icons";
import Spinner from "../../components/shared/spinner";
import { Input, Select } from "@medusajs/ui";
import { InformationCircleSolid } from "@medusajs/icons";
import { Tooltip } from "@medusajs/ui";
import { getAllListRequestProduct } from "../../actions/request-product/get-all-list-request-product";
import clsx from "clsx";
import { updateRequestProduct } from "../../actions/request-product/update-request-product";

type ListRequestProduct = {
  request_id: string;
  seller_id: string;
  product_title: string;
  product_image: string;
  description: string;
  variants: string;
  approved: boolean;
  created_at: string;
  store_name: string;
  customer_email: string;
  store_id: string;
};
type arraysRequestProduct = {
  dataRequestProduct: ListRequestProduct[];
  dataFilter?: ListRequestProduct[];
  dataPreview: ListRequestProduct[];
  count: number;
};

const registerNumber = [15, 30, 100];
// numero de filas por pagina predeterminado
const APPROVED = "APPROVED";
const REJECTED = "REJECTED";
const dataSelecFilter = [
  {
    value: true,
    label: "Aprobado",
  },
  {
    value: false,
    label: "Sin Aprobar",
  },
];

const RequestProduct = () => {
  const [dataProduct, setDataCustomer] = useState<arraysRequestProduct>({
    dataRequestProduct: [],
    dataFilter: [],
    dataPreview: [],
    count: 0,
  });
  const [pageTotal, setPagetotal] = useState<number>(); // paginas totales
  const [page, setPage] = useState(1);
  const [rowsPages, setRowsPages] = useState<number>(15);
  const [isLoading2, setIsLoading] = useState<boolean>(true);
  const [orderDate, setOrderDate] = useState<boolean>(true);

  const handlerGetListProduct = async (order?: string) => {
    setIsLoading(true);

    const product = await getAllListRequestProduct().then((p) => {
      setIsLoading(false);
      return p;
    });
    setPagetotal(Math.ceil(product?.length || 0 / rowsPages));
    setDataCustomer({
      dataRequestProduct: product,
      dataPreview: handlerPreviewSellerAplication(product, 1),
      count: product?.length || 0,
    });
  };

  const handlerNextPage = (action) => {
    if (action == "NEXT")
      setPage((old) => {
        if (dataProduct.dataFilter!) {
          setDataCustomer({
            ...dataProduct,
            dataPreview: handlerPreviewSellerAplication(
              dataProduct.dataFilter,
              page + 1
            ),
          });
          return old + 1;
        } else
          setDataCustomer({
            ...dataProduct,
            dataPreview: handlerPreviewSellerAplication(
              dataProduct.dataRequestProduct,
              page + 1
            ),
          });
        return old + 1;
      });

    if (action == "PREV")
      setPage((old) => {
        if (dataProduct.dataFilter!) {
          setDataCustomer({
            ...dataProduct,
            dataPreview: handlerPreviewSellerAplication(
              dataProduct.dataFilter,
              page - 1
            ),
          });
          return old - 1;
        } else
          setDataCustomer({
            ...dataProduct,
            dataPreview: handlerPreviewSellerAplication(
              dataProduct.dataRequestProduct,
              page - 1
            ),
          });
        return old - 1;
      });
  };

  const handlerPreviewSellerAplication = (
    queryParams: Array<ListRequestProduct>,
    page,
    rows?
  ) => {
    // cadena de array para filtrar segun la pagina , se debe de pensar en cambiar el llamado a la api para poder
    // solicitar unicamente los que se estan pidiendo en la paginacion
    const dataRowPage = rows || rowsPages;
    const start = (page - 1) * dataRowPage;
    const end = page * dataRowPage;
    const newArray = queryParams?.slice(start, end);
    setPage(1);
    setPagetotal(Math.ceil(queryParams?.length / dataRowPage));
    return newArray;
  };

  useEffect(() => {
    handlerGetListProduct();
  }, []);

  const handlerFilter = (value) => {
    setPage(1);
    let dataFilter;
    switch (value) {
      case dataSelecFilter[0].value:
        dataFilter = dataProduct.dataRequestProduct.filter(
          (data) => data.approved == dataSelecFilter[0].value
        );
        break;
      case dataSelecFilter[1].value:
        dataFilter = dataProduct.dataRequestProduct.filter(
          (data) => data.approved == dataSelecFilter[1].value
        );
        break;
      default:
        dataFilter = dataProduct.dataRequestProduct;
        break;
    }
    setDataCustomer({
      ...dataProduct,
      dataPreview: handlerPreviewSellerAplication(dataFilter, 1),
      dataFilter: value === dataSelecFilter[0].value ? [] : dataFilter,
    });
  };
  const handlerRowsNumber = (value) => {
    const valueInt = parseInt(value);
    setRowsPages(valueInt);
    setDataCustomer({
      ...dataProduct,
      dataPreview: handlerPreviewSellerAplication(
        dataProduct.dataFilter!
          ? dataProduct.dataFilter
          : dataProduct.dataRequestProduct,
        1,
        valueInt
      ),
    });
  };

  const handlerOrderDate = (value: boolean) => {
    handlerGetListProduct(value ? "ASC" : "DESC");
    setOrderDate((data) => !data);
  };
  const handlerSearcherbar = (e: string) => {
    const dataFilter = dataProduct.dataRequestProduct.filter((data) => {
      if ("customer" in data) {
        const nameIncludes = data.product_title
          .toLowerCase()
          .includes(e.toLowerCase());
        const emailIncludes = data.customer_email
          .toLowerCase()
          .includes(e.toLowerCase());
        return nameIncludes || emailIncludes;
      }
      return false;
    });

    setDataCustomer({
      ...dataProduct,
      dataPreview: handlerPreviewSellerAplication(dataFilter, 1),
      dataFilter: dataFilter?.length ? dataFilter : [],
    });
  };

  const handleDownload = (data: ListRequestProduct) => {
    const link = document.createElement("a");

    const url = data.product_image;
    link.href = data.product_image;
    link.download = data.product_title;

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlerUpdateRequestProduct = (id) => {
    updateRequestProduct(id).then(() => {
      handlerGetListProduct();
    });
  };

  return (
    <div className=" bg-white p-8 border border-gray-200 rounded-lg mb-10">
      <div className="mt-2 h-[120px] flex justify-between">
        <h1 className=" text-xl font-bold"> Solicitud de productos</h1>
        <div className="flex gap-5 h-full items-end py-4">
          <div className="w-[156px] ">
            <Select onValueChange={handlerFilter}>
              <Select.Trigger>
                <Select.Value placeholder="Filtar por: " />
              </Select.Trigger>
              <Select.Content>
                {dataSelecFilter.map((item, i) => (
                  <Select.Item key={i} value={item.label}>
                    {item.label}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select>
          </div>
          <div className="w-[250px]">
            <Input
              placeholder="Search"
              id="search-input"
              type="search"
              onChange={(e) => handlerSearcherbar(e.target.value)}
            />
          </div>
        </div>
      </div>
      {isLoading2 ? (
        <div className="min-h-[293px] flex items-center justify-center">
          <Spinner size="large" variant="secondary" />
        </div>
      ) : dataProduct.dataPreview?.length ? (
        <div className="min-h-[293px] pb-10">
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell
                  className="flex cursor-pointer items-center"
                  onClick={() => handlerOrderDate(orderDate)}
                >
                  Fecha{" "}
                  <TriangleDownMini
                    className={clsx("", {
                      "rotate-180": orderDate === true,
                    })}
                  />
                </Table.HeaderCell>
                <Table.HeaderCell> Nombre</Table.HeaderCell>
                <Table.HeaderCell>Usuario</Table.HeaderCell>
                <Table.HeaderCell>Email</Table.HeaderCell>
                <Table.HeaderCell>Variants</Table.HeaderCell>
                <Table.HeaderCell>Estado</Table.HeaderCell>

                <Table.HeaderCell></Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {dataProduct.dataPreview?.map((data, i) => {
                return (
                  <Table.Row key={data.request_id}>
                    <Table.Cell>{formatarFecha(data.created_at)}</Table.Cell>

                    <Table.Cell>
                      <Tooltip
                        content={
                          <div className="w-auto h-auto flex flex-col items-center">
                            <h3 className=" text-base font-blod text-center m">
                              Imagen proporcionada por el vendedor
                            </h3>
                            <img
                              src={data.product_image}
                              className="object-fill object-center max-h-[200px] max-w-[200px] my-3"
                            />
                            <div>
                              <Link to={data.product_image} target="_blank">
                                <IconButton
                                  className="w-auto border"
                                  // onClick={() => handleDownload(data)}
                                >
                                  Descargar Imagen
                                  <ArrowDownTray />
                                </IconButton>
                              </Link>
                            </div>
                          </div>
                        }
                      >
                        <div className="flex gap-2">
                          <Thumbnail src={data.product_image} />
                          {data.product_title}
                        </div>
                      </Tooltip>
                    </Table.Cell>
                    <Table.Cell>{data.store_name}</Table.Cell>
                    <Table.Cell>{data.customer_email}</Table.Cell>
                    <Table.Cell>{data.variants}</Table.Cell>
                    <Table.Cell>
                      {!data.approved ? "Sin Aprobar" : "Aprobrado"}
                    </Table.Cell>

                    <Table.Cell className="flex gap-x-2 items-center">
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
                              handlerUpdateRequestProduct(data.request_id)
                            }
                          >
                            <Check className="text-ui-fg-subtle" />
                            Aprobar
                          </DropdownMenu.Item>
                        </DropdownMenu.Content>
                      </DropdownMenu>
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

      <div className="flex pt-[10] mt-[10] ">
        <div className="w-[35%]">{`${dataProduct.count || 0} Products`}</div>
        <div className="flex w-[65%] gap-5 justify-end">
          <span className="text-[12px] mr-[4px]">{`N° Registros: `}</span>
          <div className="text-[12px] w-[50px]">
            <Select onValueChange={handlerRowsNumber} size="small">
              <Select.Trigger>
                <Select.Value placeholder="5" />
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
  zone: "product.list.before",
};

export default RequestProduct;
