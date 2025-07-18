import type { WidgetConfig } from "@medusajs/admin";
import { getListSellerApplication } from "../../actions/seller-application-action/get-seller-application-action";
import { updateSellerAplicationAction } from "../../actions/seller-application-action/update-seller-application-action";
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
import { Input, Select, Button, Heading, Textarea, Text } from "@medusajs/ui";
import clsx from "clsx";
import { ModalComment } from "../../components/seller-application/modal-commet";
type dataView = {
  address: string;
  address_proof: string;
  city: string;
  company_address: string;
  company_city: string;
  company_country: string;
  company_name: string;
  contry: string;
  created_at: string;
  current_stock_distribution: string;
  email: string;
  example_product: string;
  front_identity_document: string;
  id: string;
  last_name: string;
  name: string;
  phone: string;
  postal_code: string;
  quantity_per_product: string;
  quantity_products_sale: string;
  revers_identity_document: string;
  supplier_documents: string;
  supplier_name: string;
  supplier_type: string;
  field_payment_method_1: string;
  field_payment_method_2: string;
  updated_at: string;
};

type objectSellerApplication = {
  application_data: dataView;
  state_application: {
    id: string;
    state: string;
  };
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
  dataFilter?: Array<objectSellerApplication>;
  dataPreview: Array<objectSellerApplication>;
  count: number;
};
type DataStatusSellerApplication = {
  payload?: string;
  customer?: {
    customer_id: string;
    name: string;
    email: string;
  };
  comment_status?: string;
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
const registerNumber = [5, 10, 100];
// numero de filas por pagina predeterminado
const APPROVED = "APPROVED";
const REJECTED = "REJECTED";
const CORRECT = "CORRECT";

const SellerApplication = () => {
  //manejo de la tabla --------------
  const [dataCustomer, setDataCustomer] = useState<ListDataSellerApplication>({
    dataSellers: [],
    dataFilter: [],
    dataPreview: [],
    count: 0,
  });
  const [pageTotal, setPagetotal] = useState<number>(); // paginas totales
  const [page, setPage] = useState(1);
  const [rowsPages, setRowsPages] = useState<number>(5);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [orderDate, setOrderDate] = useState<boolean>(true);
  //----------------------------------

  //datos para el control y actualizacion del status
  const [dataStatus, setDataStatus] = useState<DataStatusSellerApplication>({
    payload: "",
    customer: {
      customer_id: "",
      name: "",
      email: "",
    },
    comment_status: "",
  });

  const [dataView, setDataView] = useState<dataView>({
    address: "",
    address_proof: "",
    city: "",
    company_address: "",
    company_city: "",
    company_country: "",
    company_name: "",
    contry: "",
    created_at: "",
    current_stock_distribution: "",
    email: "",
    example_product: "",
    front_identity_document: "",
    id: "",
    last_name: "",
    name: "",
    phone: "",
    postal_code: "",
    quantity_per_product: "",
    quantity_products_sale: "",
    revers_identity_document: "",
    supplier_documents: "",
    supplier_name: "",
    supplier_type: "",
    updated_at: "",
    field_payment_method_1: "",
    field_payment_method_2: "",
  });
  //Modals
  //modal copnfirmacion de Aceptar solicitud
  const [openModalAccept, changeModalAccept] = useState(false);

  //modal copnfirmacion de Rechazar solicitud
  const [openModalReject, changeModalReject] = useState(false);

  //modal copnfirmacion de Corrección de solicitud
  const [openModalCorrect, changeModalCorrect] = useState(false);

  //modal ver los datos de la solicitud
  const [openModalViewSellerData, changeModalViewSellerData] = useState(false);

  //modaal commentario de la solicitud
  const [modalComment, changeModalCommen] = useState({
    open: false,
    customer: { name: "", customer_id: "", email: "" },
  });

  const handlerGetListApplication = async (order?: string) => {
    setIsLoading(true);
    const dataApplication = await getListSellerApplication(order)
      .then((e) => {
        setIsLoading(false);
        return e;
      })
      .catch((e) => {});
    if (!dataApplication) return;
    setPagetotal(Math.ceil(dataApplication?.length / rowsPages));
    setDataCustomer({
      dataSellers: dataApplication,
      dataPreview: handlerPreviewSellerAplication(dataApplication, 1),
      count: dataApplication?.length,
    });
  };

  const handlerNextPage = (action) => {
    if (action == "NEXT")
      setPage((old) => {
        const dataToUse = dataCustomer.dataFilter?.length
          ? dataCustomer.dataFilter
          : dataCustomer.dataSellers;
        setDataCustomer({
          ...dataCustomer,
          dataPreview: handlerPreviewSellerAplication(dataToUse, page + 1),
        });
        return old + 1;
      });

    if (action == "PREV")
      setPage((old) => {
        const dataToUse = dataCustomer.dataFilter?.length
          ? dataCustomer.dataFilter
          : dataCustomer.dataSellers;
        setDataCustomer({
          ...dataCustomer,
          dataPreview: handlerPreviewSellerAplication(dataToUse, page - 1),
        });
        return old - 1;
      });
  };

  const handlerPreviewSellerAplication = (
    queryParams: Array<objectSellerApplication>,
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
    setPagetotal(Math.ceil(queryParams?.length / dataRowPage));
    return newArray;
  };

  useEffect(() => {
    handlerGetListApplication();
  }, []);

  const handlerActionStatus = async () => {
    updateSellerAplicationAction({
      payload: dataStatus.payload,
      customer_id: dataStatus.customer.customer_id,
      comment_status: dataStatus.comment_status,
    }).then(() => {
      changeModalAccept(false);
      changeModalReject(false);
      changeModalCorrect(false);
      changeModalViewSellerData(false);
      handlerGetListApplication();
      setPage(1);
    });
  };
  const handlerFilter = (value) => {
    setPage(1);
    let dataFilter;
    switch (value) {
      case dataSelecFilter[1].value:
        dataFilter = dataCustomer.dataSellers.filter(
          (data) => data.state_application.id === dataSelecFilter[1].value
        );
        break;
      case dataSelecFilter[2].value:
        dataFilter = dataCustomer.dataSellers.filter(
          (data) => data.state_application.id === dataSelecFilter[2].value
        );
        break;
      case dataSelecFilter[3].value:
        dataFilter = dataCustomer.dataSellers.filter(
          (data) => data.state_application.id === dataSelecFilter[3].value
        );
        break;
      case dataSelecFilter[4].value:
        dataFilter = dataCustomer.dataSellers.filter(
          (data) => data.state_application.id === dataSelecFilter[4].value
        );
        break;
      case dataSelecFilter[5].value:
        dataFilter = dataCustomer.dataSellers.filter(
          (data) => data.state_application.id === dataSelecFilter[5].value
        );
        break;
      default:
        dataFilter = dataCustomer.dataSellers;
        break;
    }
    setDataCustomer({
      ...dataCustomer,
      dataPreview: handlerPreviewSellerAplication(dataFilter, 1),
      dataFilter: value === dataSelecFilter[0].value ? [] : dataFilter,
    });
  };
  const handlerRowsNumber = (value) => {
    const valueInt = parseInt(value);
    setRowsPages(valueInt);
    setDataCustomer({
      ...dataCustomer,
      dataPreview: handlerPreviewSellerAplication(
        dataCustomer.dataFilter!
          ? dataCustomer.dataFilter
          : dataCustomer.dataSellers,
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
    const dataFilter = dataCustomer.dataSellers.filter((data) => {
      const nameIncludes = data.customer.name
        .toLowerCase()
        .includes(e.toLowerCase());
      const emailIncludes = data.customer.email
        .toLowerCase()
        .includes(e.toLowerCase());

      // Devuelve true si la palabra enviada está incluida en el nombre o el correo electrónico
      return nameIncludes || emailIncludes;
    });
    setDataCustomer({
      ...dataCustomer,
      dataPreview: handlerPreviewSellerAplication(dataFilter, 1),
      dataFilter: dataFilter?.length ? dataFilter : [],
    });
  };

  return (
    <div className=" bg-white p-8 border border-gray-200 rounded-lg">
      <div className="w-full h-full ">
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
          ) : dataCustomer.dataPreview?.length ? (
            <div className="min-h-[293px]">
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
                    <Table.HeaderCell>Usuario</Table.HeaderCell>
                    <Table.HeaderCell>Teléfono</Table.HeaderCell>
                    <Table.HeaderCell>Email</Table.HeaderCell>
                    <Table.HeaderCell>Estado</Table.HeaderCell>
                    <Table.HeaderCell></Table.HeaderCell>
                    <Table.HeaderCell></Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {dataCustomer.dataPreview?.map((data, i) => {
                    return (
                      <Table.Row key={data.customer_id}>
                        <Table.Cell>{DateFormat(data.created_at)}</Table.Cell>
                        <Table.Cell>{data.customer.name}</Table.Cell>
                        <Table.Cell>{data.application_data.phone}</Table.Cell>
                        <Table.Cell>{data.customer.email}</Table.Cell>
                        <Table.Cell>{data.state_application.state}</Table.Cell>
                        <Table.Cell className="flex gap-x-2 items-center">
                          <IconButton
                            onClick={() => {
                              setDataStatus({
                                customer: {
                                  customer_id: data.customer_id,
                                  ...data.customer,
                                },
                              });
                              setDataView(data.application_data);
                              changeModalViewSellerData(true);
                            }}
                          >
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
                                onClick={() => {
                                  setDataStatus({
                                    payload: APPROVED,
                                    customer: {
                                      customer_id: data.customer_id,
                                      ...data.customer,
                                    },
                                  });
                                  changeModalAccept(true);
                                }}
                              >
                                <Check className="text-ui-fg-subtle" />
                                Aceptar
                              </DropdownMenu.Item>
                              <DropdownMenu.Item
                                className="gap-x-2"
                                onClick={() => {
                                  setDataStatus({
                                    payload: REJECTED,
                                    customer: {
                                      customer_id: data.customer_id,
                                      ...data.customer,
                                    },
                                    comment_status: "",
                                  });
                                  changeModalReject(true);
                                }}
                              >
                                <XMark className="text-ui-fg-subtle" />
                                Rechazar
                              </DropdownMenu.Item>
                              <DropdownMenu.Item
                                className="gap-x-2"
                                onClick={() => {
                                  setDataStatus({
                                    payload: CORRECT,
                                    customer: {
                                      customer_id: data.customer_id,
                                      ...data.customer,
                                    },
                                    comment_status: "",
                                  });
                                  changeModalCorrect(true);
                                }}
                              >
                                <ArrowPathMini className="text-ui-fg-subtle" />
                                Corregir
                              </DropdownMenu.Item>
                            </DropdownMenu.Content>
                          </DropdownMenu>
                          <IconButton
                            onClick={() => {
                              changeModalCommen({
                                open: true,
                                customer: {
                                  name: data.customer.name,
                                  customer_id: data.customer_id,
                                  email: data.customer.email,
                                },
                              });
                            }}
                          >
                            <ChatBubble />
                          </IconButton>
                        </Table.Cell>
                        <Table.Cell>
                          {" "}
                          {data.state_application.id === "A" && (
                            <Check className="text-emerald-700" />
                          )}
                          {data.state_application.id === "B" && (
                            <XMark className="text-red-700" />
                          )}
                          {data.state_application.id === "C" && (
                            <BellAlert className="text-yellow-500" />
                          )}
                          {data.state_application.id === "D" && (
                            <ArrowPathMini className="text-blue-800" />
                          )}
                          {data.state_application.id === "E" && (
                            <BellAlert className="text-yellow-800" />
                          )}
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
      {
        // Modals
      }
      <ModalApprobed
        openModal={openModalAccept}
        changeModal={changeModalAccept}
        data={dataStatus}
        setDataStatus={setDataStatus}
        handlerActionStatus={handlerActionStatus}
      />
      <ModalRejected
        openModal={openModalReject}
        changeModal={changeModalReject}
        data={dataStatus}
        setDataStatus={setDataStatus}
        handlerActionStatus={handlerActionStatus}
      />
      <ModalCorrect
        openModal={openModalCorrect}
        changeModal={changeModalCorrect}
        data={dataStatus}
        setDataStatus={setDataStatus}
        handlerActionStatus={handlerActionStatus}
      />
      <ModalViewSellerData
        openModal={openModalViewSellerData}
        changeModal={changeModalViewSellerData}
        changeModalAccept={changeModalAccept}
        changeModalCorrect={changeModalCorrect}
        changeModalReject={changeModalReject}
        data={dataStatus}
        viweDataSeller={dataView}
        setDataStatus={setDataStatus}
      />
      {modalComment.open ? (
        <ModalComment
          changeModal={changeModalCommen}
          customer={modalComment.customer}
        />
      ) : (
        <></>
      )}
    </div>
  );
};

type ModalProps = {
  openModal: boolean;
  changeModal: (value: React.SetStateAction<boolean>) => void;
  data: DataStatusSellerApplication;
  viweDataSeller?: dataView;
  setDataStatus: React.Dispatch<
    React.SetStateAction<DataStatusSellerApplication>
  >;
  handlerActionStatus: () => void;
};

const ModalApprobed: React.FC<ModalProps> = ({
  openModal,
  changeModal,
  data,
  setDataStatus,
  handlerActionStatus,
}) => {
  if (!openModal) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-30">
      <div className="bg-white p-8 border border-gray-200 rounded-lg max-w-lg">
        <div className="flex w-full max-w-lg flex-col gap-y-8 justify-center items-center">
          <div className="flex flex-col gap-y-1">
            <Heading>
              Aprobar solicitud al usuario: {data.customer?.name} -{" "}
              {data.customer?.email}
            </Heading>
            <Text className="text-ui-fg-subtle text-center">
              ¿Estás seguro de aprobar a este usuario?
            </Text>
          </div>
        </div>

        <div className="flex justify-center items-center gap-5 pt-5">
          <Button
            className=" bg-emerald-700 hover:bg-emerald-80"
            onClick={handlerActionStatus}
          >
            Aceptar
          </Button>
          <Button
            className="bg-red-500 hover:bg-red-600 "
            onClick={() => changeModal(false)}
          >
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  );
};

const ModalRejected: React.FC<ModalProps> = ({
  openModal,
  changeModal,
  data,
  setDataStatus,
  handlerActionStatus,
}) => {
  if (!openModal) {
    return null;
  }
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-30">
      <div className="bg-white p-8 border border-gray-200 rounded-lg max-w-lg">
        <div className="flex w-full max-w-lg flex-col gap-y-8 justify-center items-center">
          <div className="flex flex-col gap-y-1">
            <Heading>
              Rechazar solicitud al usuario: {data.customer?.name} -{" "}
              {data.customer?.email}
            </Heading>
            <Text className="text-ui-fg-subtle">
              Comenta las razones del rechazo de solicitud:
            </Text>
            <Textarea
              value={data.comment_status}
              onChange={(e) => {
                setDataStatus((prevData) => ({
                  ...prevData,
                  comment_status: e.target.value,
                }));
              }}
            />
          </div>
        </div>

        <div className="flex justify-center items-center gap-5 pt-5 ">
          <Button
            className="bg-red-700 hover:bg-red-800"
            onClick={handlerActionStatus}
          >
            Aceptar
          </Button>
          <Button
            className="bg-red-500 hover:bg-red-600 "
            onClick={() => changeModal(false)}
          >
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  );
};
const ModalCorrect: React.FC<ModalProps> = ({
  openModal,
  changeModal,
  data,
  setDataStatus,
  handlerActionStatus,
}) => {
  if (!openModal) {
    return null;
  }
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-30 ">
      <div className="bg-white p-8 border border-gray-200 rounded-lg max-w-lg">
        <div className="flex w-full max-w-lg flex-col gap-y-8 justify-center items-center">
          <div className="flex flex-col gap-y-1">
            <Heading>
              Enviar corrección al usuario: {data.customer?.name} -{" "}
              {data.customer?.email}
            </Heading>
            <Text className="text-ui-fg-subtle">
              Comenta las razones de la corrección a la solicitud:
            </Text>
            <Textarea
              value={data.comment_status}
              onChange={(e) => {
                setDataStatus((prevData) => ({
                  ...prevData,
                  comment_status: e.target.value,
                }));
              }}
            />
          </div>
        </div>

        <div className="flex justify-center items-center gap-5 pt-5 ">
          <Button
            className="bg-blue-700 hover:bg-blue-800"
            onClick={handlerActionStatus}
          >
            Corregir
          </Button>
          <Button
            className="bg-red-500 hover:bg-red-600 "
            onClick={() => changeModal(false)}
          >
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  );
};

const ModalViewSellerData: React.FC<{
  openModal: boolean;
  changeModal: (value: React.SetStateAction<boolean>) => void;
  changeModalAccept: (value: React.SetStateAction<boolean>) => void;
  changeModalCorrect: (value: React.SetStateAction<boolean>) => void;
  changeModalReject: (value: React.SetStateAction<boolean>) => void;
  data: DataStatusSellerApplication;
  viweDataSeller?: dataView;
  setDataStatus: React.Dispatch<
    React.SetStateAction<DataStatusSellerApplication>
  >;
}> = ({
  openModal,
  changeModal,
  changeModalAccept,
  changeModalCorrect,
  changeModalReject,
  data,
  viweDataSeller,
  setDataStatus,
}) => {
  if (!openModal) {
    return null;
  }
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex flex-col justify-center  items-center ">
      <div className="bg-white p-8 border border-gray-200 rounded-t-lg max-w-2xl mt-5 overflow-y-scroll h-[700px]">
        <div className="flex flex-col gap-y-1">
          <samp className="divide-x divide-dashed" />
          <h3 className="text-lg font-extrabold text-center border-t mt-2 py-2 border-gray-300">
            Visualizacion de Datos
            {/* {data.customer?.name} - {data.customer?.email} */}
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-bold">Nombre:</p>
              <p>{viweDataSeller.name}</p>
            </div>
            <div>
              <p className="font-bold">Apellido:</p>
              <p>{viweDataSeller.last_name}</p>
            </div>
            <div>
              <p className="font-bold">Correo Electrónico:</p>
              <p>{viweDataSeller.email}</p>
            </div>
            <div>
              <p className="font-bold">Teléfono:</p>
              <p>{viweDataSeller.phone}</p>
            </div>
            <div>
              <p className="font-bold">Dirección:</p>
              <p>{viweDataSeller.address}</p>
            </div>
            <div>
              <p className="font-bold">Ciudad:</p>
              <p>{viweDataSeller.city}</p>
            </div>
            <div>
              <p className="font-bold">País:</p>
              <p>{viweDataSeller.contry}</p>
            </div>
            <div>
              <p className="font-bold">Código Postal:</p>
              <p>{viweDataSeller.postal_code}</p>
            </div>

            <p className="text-lg font-extrabold  text-center col-span-2 mt-2 py-2 border-t border-gray-300">
              Orígen del stock
            </p>
            <p className="font-bold text-gray-800 text-sm text-center col-span-2">
              Datos del proveedor
            </p>
            <div>
              <p className="font-bold">Nombre del proveedor:</p>
              <p>{viweDataSeller.supplier_name}</p>
            </div>
            <div>
              <p className="font-bold">Tipo de proveedor:</p>
              <p>{viweDataSeller.supplier_type}</p>
            </div>
            <div>
              <p className="font-bold">Nombre de empresa proveedora:</p>
              <p>{viweDataSeller.company_name}</p>
            </div>
            <div>
              <p className="font-bold">País de la empresa proveedora:</p>
              <p>{viweDataSeller.company_country}</p>
            </div>
            <div>
              <p className="font-bold">Ciudad del proveedor:</p>
              <p>{viweDataSeller.company_city}</p>
            </div>
            <div>
              <p className="font-bold">Dirección del proveedor:</p>
              <p>{viweDataSeller.company_address}</p>
            </div>
            <div>
              <p className="font-bold">Documentos del proveedor:</p>
              <a href={viweDataSeller.supplier_documents} target="_blank">
                Ver Documento
              </a>
              <a
                href={viweDataSeller.supplier_documents}
                download
                className="text-green-600 underline ml-2"
              >
                Descargar
              </a>
            </div>

            <p className="font-bold text-gray-800 text-lg text-center mt-2 py-2 col-span-2 border-t border-gray-300">
              Lo que vendera
            </p>

            <div>
              <p className="font-bold">Cuántos productos vendera:</p>
              <p> {viweDataSeller.quantity_products_sale}</p>
            </div>
            <div>
              <p className="font-bold">Ejemplos de productos que vendera:</p>
              <p> {viweDataSeller.example_product}</p>
            </div>
            <div>
              <p className="font-bold">
                Cantidad de productos de elementos por producto:
              </p>
              <p> {viweDataSeller.quantity_per_product}</p>
            </div>
            <div>
              <p className="font-bold">
                Donde distribuyes actualmente su stock:
              </p>
              <p> {viweDataSeller.current_stock_distribution}</p>
            </div>

            <p className="font-extrabold  text-gray-800 text-lg text-center mt-2 py-2 col-span-2 border-t border-gray-300">
              Verificación comercial
            </p>
            <div>
              <p className="font-bold">Documento de identidad parte frontal:</p>
              <a href={viweDataSeller.front_identity_document} target="_blank">
                Ver Documento
              </a>
              <a
                href={viweDataSeller.front_identity_document}
                download
                className="text-green-600 underline ml-2"
              >
                Descargar
              </a>
            </div>
            <div>
              <p className="font-bold">
                Documento de identidad parte posterior:
              </p>
              <a href={viweDataSeller.revers_identity_document} target="_blank">
                Ver Documento
              </a>
              <a
                href={viweDataSeller.revers_identity_document}
                download
                className="text-green-600 underline ml-2"
              >
                Descargar
              </a>
            </div>
            <div>
              <p className="font-bold">Comprobante de domicilio</p>
              <a href={viweDataSeller.address_proof} target="_blank">
                Ver Documento
              </a>
              <a
                href={viweDataSeller.address_proof}
                download
                className="text-green-600 underline ml-2"
              >
                Descargar
              </a>
            </div>

            <p className="font-extrabold  text-gray-800 text-lg text-center mt-2 py-2 col-span-2 border-t border-gray-300">
              Métodos de pago
            </p>
            <div>
              <p className="font-bold">Metodo de pago 1:</p>
              <p> {viweDataSeller.field_payment_method_1}</p>
            </div>
            <div>
              <p className="font-bold">Metodo de pago 2:</p>
              <p> {viweDataSeller.field_payment_method_2}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center bg-white mb-5  pb-4 max-w-2xl rounded-b-lg gap-5 pt-5 w-full ">
        <Button
          variant="transparent"
          className=" text-emerald-700 hover:text-emerald-800 border border-emerald-700 hover:border-emerald-800"
          onClick={() => {
            setDataStatus({
              payload: APPROVED,
              customer: {
                customer_id: data.customer.customer_id,
                ...data.customer,
              },
            });
            changeModalAccept(true);
          }}
        >
          Aprobar
        </Button>
        <Button
          variant="transparent"
          className="text-blue-700 hover:text-blue-800 border border-blue-700 hover:border-blue-800"
          onClick={() => {
            setDataStatus({
              payload: CORRECT,
              customer: {
                customer_id: data.customer.customer_id,
                ...data.customer,
              },
            });
            changeModalCorrect(true);
          }}
        >
          Corregir
        </Button>
        <Button
          variant="transparent"
          className="text-red-700 hover:text-red-800 border border-red-700 hover:border-red-800 "
          onClick={() => {
            setDataStatus({
              payload: REJECTED,
              customer: {
                customer_id: data.customer.customer_id,
                ...data.customer,
              },
            });
            changeModalReject(true);
          }}
        >
          Rechazar
        </Button>
        <Button
          variant="transparent"
          className="text-red-500 hover:text-red-600 border border-red-500 hover:border-red-600 mx-5 "
          onClick={() => changeModal(false)}
        >
          Cancelar
        </Button>
      </div>
    </div>
  );
};

function DateFormat(fechaString: string): string {
  const fecha = new Date(fechaString);
  const meses = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const dia = fecha.getDate().toString().padStart(2, "0");
  const mes = meses[fecha.getMonth()];
  const año = fecha.getFullYear();
  return `${dia} ${mes} ${año}`;
}
export const config: WidgetConfig = {
  zone: "customer.list.before",
};

export default SellerApplication;
