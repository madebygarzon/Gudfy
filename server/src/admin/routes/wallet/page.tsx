import { useState } from "react";
import {
  Drawer,
  Input,
  DatePicker,
  Table,
  IconButton,
  Button,
  Alert,
  Tooltip,
  Badge,
  Copy,
  Container,
  Prompt,
  Checkbox,
  Label,
  Textarea,
} from "@medusajs/ui";
import {
  Eye,
  InformationCircleSolid,
  PlusMini,
} from "@medusajs/icons";
import Spinner from "../../components/shared/spinner";
import { RouteConfig } from "@medusajs/admin";
import { ListPayStore } from "./list_pay_store";

const fakeData = [
  {
    id: 1,
    storeName: "Store Serials",
    saldo_disponible: 150.7,
    saldo_pendiente: 150.23,
    saldo_pagado: 150.23,
    fecha_limite_pago: "2024-11-01",
    binance_id: "IDBINANCE12359",
    details: [
      {
        id: 1,
        producto: "Netflix Colombia",
        cantidad: 4,
        ped_numero: "PED-9874",
        valor: "15.00",
        fecha_pago: "2024-11-01",
        comision: "1.00",
        estado: "Pagado",
        neto_pagar: "59.00",
        cliente: "Luis David Arias",
      },
      {
        id: 2,
        producto: "Netflix Brasil",
        cantidad: 2,
        ped_numero: "PED-5689",
        valor: "15.00",
        fecha_pago: "2024-11-01",
        comision: "1.00",
        estado: "Pagado",
        neto_pagar: "59.00",
        cliente: "Luis Fernando Rivera",
      },
      {
        id: 3,
        producto: "Netflix Turquia",
        cantidad: 1,
        ped_numero: "PED-1278",
        valor: "15.00",
        fecha_pago: "2024-11-01",
        comision: "1.00",
        estado: "Pendiente",
        neto_pagar: "59.00",
        cliente: "Luisa Fernanda Giraldo",
      },
      {
        id: 4,
        producto: "Free Fire",
        cantidad: 6,
        ped_numero: "PED-1457",
        valor: "15.00",
        fecha_pago: "2024-11-01",
        comision: "1.00",
        estado: "Pendiente",
        neto_pagar: "59.00",
        cliente: "Yuliana Sosa",
      },
      {
        id: 5,
        producto: "Spotify",
        cantidad: 3,
        ped_numero: "PED-2987",
        valor: "15.00",
        fecha_pago: "2024-11-01",
        comision: "1.00",
        estado: "Disponible",
        neto_pagar: "59.00",
        cliente: "Fernando Giraldo",
      },
      {
        id: 6,
        producto: "Prime Video",
        cantidad: 2,
        ped_numero: "PED-8517",
        valor: "15.00",
        fecha_pago: "2024-11-01",
        comision: "1.00",
        estado: "Disponible",
        neto_pagar: "59.00",
        cliente: "Juan Perez",
      },
    ],
  },
  {
    id: 2,
    storeName: "Serials Marxs",
    saldo_disponible: 111.0,
    saldo_pendiente: 10.23,
    saldo_pagado: 150.23,
    fecha_limite_pago: "2024-11-07",
    binance_id: "IDBINANCE789545",
    details: [
      {
        producto: "Netflix Turquia",
        cantidad: 6,
        ped_numero: "PED-0001",
        valor: "10.00",
        fecha_pago: "2024-11-01",
        comision: "1.00",
        estado: "Pendiente",
        neto_pagar: "59.00",
        cliente: "Luis ",
      },
    ],
    details_2: [
      {
        id: 2,
        fecha: "2024-11-01",
        id_de_pago: "897845451212",
        monto: "150.20",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ac quisque eu fusce penatibus nisl primis blandit fermentum justo nisi sociosqu velit. Hac eros lacinia sollicitudin himenaeos risus et nec varius est ad potenti quam. Scelerisque rhoncus eros euismod dui mollis purus sagittis nisl quisque porta vivamus sagittis.",
      },
    ],
  },
  {
    id: 3,
    storeName: "Store New",
    saldo_disponible: 150.7,
    saldo_pendiente: 150.23,
    saldo_pagado: 150.23,
    fecha_limite_pago: "2024-11-01",
    binance_id: "IDBINANCE75454",
    details: [
      {
        id: 1,
        producto: "Netflix Brasil",
        cantidad: 4,
        ped_numero: "PED-0001",
        valor: "15.00",
        fecha_pago: "2024-11-01",
        comision: "1.00",
        estado: "Pendiente",
        neto_pagar: "59.00",
        cliente: "Juan Perez",
      },
    ],
    details_2: [
      {
        id: 3,
        fecha: "2024-11-01",
        id_de_pago: "897845451212",
        monto: "150.20",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ac quisque eu fusce penatibus nisl primis blandit fermentum justo nisi sociosqu velit. Hac eros lacinia sollicitudin himenaeos risus et nec varius est ad potenti quam. Scelerisque rhoncus eros euismod dui mollis purus sagittis nisl quisque porta vivamus sagittis.",
      },
    ],
  },
  {
    id: 4,
    storeName: "Tienda Yuliana",
    saldo_disponible: 111.0,
    saldo_pendiente: 10.23,
    saldo_pagado: 150.23,
    fecha_limite_pago: "2024-11-07",
    binance_id: "IDBINANCE8972123",
    details: [
      {
        id: 1,
        producto: "Netflix Colombia",
        cantidad: 4,
        ped_numero: "PED-0001",
        valor: "15.00",
        fecha_pago: "2024-11-01",
        comision: "1.00",
        estado: "Pendiente",
        neto_pagar: "59.00",
        cliente: "Juan Perez",
      },
    ],
  },
  {
    id: 5,
    storeName: "Ronaldo Store",
    saldo_disponible: 111.0,
    saldo_pendiente: 10.23,
    saldo_pagado: 150.23,
    fecha_limite_pago: "2024-11-07",
    binance_id: "IDBINANCE587615",
    details: [
      {
        id: 1,
        producto: "Netflix Colombia",
        cantidad: 4,
        ped_numero: "PED-0001",
        valor: "15.00",
        fecha_pago: "2024-11-01",
        comision: "1.00",
        estado: "Pendiente",
        neto_pagar: "59.00",
        cliente: "Juan Perez",
      },
    ],
  },
  {
    id: 6,
    storeName: "Alejandra Store",
    saldo_disponible: 111.0,
    saldo_pendiente: 10.23,
    saldo_pagado: 150.23,
    fecha_limite_pago: "2024-11-07",
    binance_id: "IDBINANCE916872",
    details: [
      {
        id: 1,
        producto: "Netflix Colombia",
        cantidad: 4,
        ped_numero: "PED-0001",
        valor: "15.00",
        fecha_pago: "2024-11-01",
        comision: "1.00",
        estado: "Pendiente",
        neto_pagar: "59.00",
        cliente: "Juan Perez",
      },
    ],
  },
];

type detailsVendor = {
  id: number;
  producto: string;
  cantidad: number;
  ped_numero: string;
  valor: string;
  fecha_pago: string;
  comision: string;
  estado: string;
  neto_pagar: string;
  cliente: string;
};

type detailsPays = {
  id: number;
  fecha: string;
  monto: string;
  description: string;
};
const WalletListado = () => {
  const [dataCustomer, setDataCustomer] = useState({
    dataSellers: fakeData,
    dataFilter: [],
    dataPreview: fakeData,
    count: fakeData.length,
  });
  const [isConfirmed, setIsConfirmed] = useState(false);
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
                {/* <Select
                  onValueChange={(value) => handlerFilter(value, "status")}
                >
                  <Select.Trigger>
                    <Select.Value placeholder="Filtrar por estado: " />
                  </Select.Trigger>
                  <Select.Content>
                    <Select.Item value="All">Todos</Select.Item>
                    <Select.Item value="Sin liberar">Sin liberar</Select.Item>
                    <Select.Item value="Disponible">Disponible</Select.Item>
                  </Select.Content>
                </Select> */}
              </div>
              <div className="w-[156px]">
                {/* <Select
                  onValueChange={(value) => handlerFilter(value, "storeName")}
                >
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
                </Select> */}
              </div>
              <div>
                <div className="w-[250px]">
                  <DatePicker
                    placeholder="Filtrar por fecha"
                    presets={[
                      {
                        date: new Date(),
                        label: "Hoy",
                      },
                      {
                        label: "Manaña",
                        date: new Date(
                          new Date().setDate(new Date().getDate() + 1)
                        ),
                      },
                      {
                        label: "Próxima semañana",
                        date: new Date(
                          new Date().setDate(new Date().getDate() + 7)
                        ),
                      },
                      {
                        label: "Próximo mes",
                        date: new Date(
                          new Date().setMonth(new Date().getMonth() + 1)
                        ),
                      },
                      {
                        label: "Próximo año",
                        date: new Date(
                          new Date().setFullYear(new Date().getFullYear() + 1)
                        ),
                      },
                    ]}
                  />
                </div>
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
                    <Table.HeaderCell>Saldo pendiente</Table.HeaderCell>
                    <Table.HeaderCell>Saldo disponible</Table.HeaderCell>
                    <Table.HeaderCell>Fecha límite de pago</Table.HeaderCell>
                    <Table.HeaderCell className="flex items-center gap-x-2">
                      Histórico
                      <Tooltip content="Historial de ventas de la tienda">
                        <InformationCircleSolid />
                      </Tooltip>
                    </Table.HeaderCell>
                    <Table.HeaderCell></Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {dataCustomer.dataPreview.map((data) => (
                    <Table.Row key={data.id}>
                      <Table.Cell>{data.storeName}</Table.Cell>

                      <Table.Cell>{data.saldo_pendiente}</Table.Cell>
                      <Table.Cell className="font-extrabold bg-[#54bf784a] flex justify-center items-center mr-12 rounded-2xl">
                        {data.saldo_disponible}
                      </Table.Cell>
                      <Table.Cell>{data.fecha_limite_pago}</Table.Cell>

                      <Table.Cell className="flex gap-x-2 items-center">
                        <Drawer>
                          <Drawer.Trigger>
                            <Eye className="text-ui-fg-subtle" />
                          </Drawer.Trigger>
                          <Drawer.Content className="w-9/12 right-0">
                            <Drawer.Header>
                              <div className="flex justify-center items-center gap-x-2">
                                <Drawer.Title>Historial de ventas de {data.storeName}</Drawer.Title>
                              </div>
                            </Drawer.Header>
                            <Drawer.Body className="overflow-y-auto p-4">
                              <Container>
                              <Table>
                                <Table.Header>
                                  <Table.Row>
                                    <Table.HeaderCell>
                                      Producto
                                    </Table.HeaderCell>
                                    <Table.HeaderCell>
                                      Cantidad
                                    </Table.HeaderCell>
                                    <Table.HeaderCell>Pedido</Table.HeaderCell>
                                    <Table.HeaderCell>Valor</Table.HeaderCell>
                                    <Table.HeaderCell>
                                      Fecha pago
                                    </Table.HeaderCell>
                                    <Table.HeaderCell className="flex items-center gap-x-2">
                                      Comisión
                                      <Tooltip content="Valor de comisión de la plataforma por cada venta">
                                        <InformationCircleSolid />
                                      </Tooltip>
                                    </Table.HeaderCell>
                                    <Table.HeaderCell>Estado</Table.HeaderCell>
                                    <Table.HeaderCell>
                                      Neto a pagar
                                    </Table.HeaderCell>
                                    <Table.HeaderCell>Cliente</Table.HeaderCell>
                                  </Table.Row>
                                </Table.Header>
                                  <Table.Body>
                                    {data.details.map((order) => {
                                      return (
                                        <Table.Row
                                          key={order.id}
                                          className="[&_td:last-child]:w-[1%] [&_td:last-child]:whitespace-nowrap"
                                        >
                                          <Table.Cell>
                                            {order.producto}
                                          </Table.Cell>
                                          <Table.Cell>
                                            {order.cantidad}
                                          </Table.Cell>
                                          <Table.Cell>
                                            {order.ped_numero}
                                          </Table.Cell>
                                          <Table.Cell>{order.valor}</Table.Cell>
                                          <Table.Cell>
                                            {order.fecha_pago}
                                          </Table.Cell>
                                          <Table.Cell>
                                            {order.comision}
                                          </Table.Cell>
                                          <Table.Cell>
                                            {order.estado === "Disponible" ? (
                                              <div className="bg-green-500 text-white rounded-md px-2 py-1">
                                                {order.estado}
                                              </div>
                                            ) : order.estado === "Pendiente" ? (
                                              <div className="bg-[#46679da3] text-white rounded-md px-2 py-1">
                                                {order.estado}
                                              </div>
                                            ) : (
                                              <div className="">
                                                {order.estado}
                                              </div>
                                            )}
                                          </Table.Cell>
                                          <Table.Cell>
                                            {order.neto_pagar}
                                          </Table.Cell>
                                          <Table.Cell>{order.cliente}</Table.Cell>
                                        </Table.Row>
                                      );
                                    })}
                                  </Table.Body>
                                </Table>
                              </Container>                              
                            </Drawer.Body>
                            <Drawer.Footer>
                              <div className="flex justify-end items-center gap-x-2 py-4">
                                <p>Saldo Pagado: </p>
                                <Badge className="bg-[#233044a3] text-white shadow-md ">
                                  {data.saldo_pagado}
                                </Badge>
                                <p>Saldo pendiente:</p>
                                <Badge className="bg-[#578be0a3] text-white shadow-md ">
                                  {data.saldo_disponible}
                                </Badge>
                                <p>Saldo disponible:</p>
                                <Badge className="bg-green-500 text-white shadow-md ">
                                  {data.saldo_pendiente}
                                </Badge>
                              </div>
                            </Drawer.Footer>
                          </Drawer.Content>
                        </Drawer>
                      </Table.Cell>

                      <Table.Cell>
                        <Drawer>
                          <Drawer.Trigger>
                            <Button className="bg-green-500 border-green-500 shadow-md text-white rounded-md px-4 py-2 ">
                              Pagos
                            </Button>
                          </Drawer.Trigger>
                          <Drawer.Content className="w-6/12 right-0">
                            <Drawer.Header>
                              <Drawer.Title>Zona de pagos tienda: {data.storeName}</Drawer.Title>
                            </Drawer.Header>
                            <Drawer.Body className="overflow-y-auto">
                              <div className="w-full px-4">
                                
                                <h3 className="my-4">Realizar pago de <span className="font-extrabold">{data.saldo_disponible}</span> a la tienda <span className="font-extrabold">{data.storeName}</span></h3>         
                                <Container className="mt-4">

                                <div className="mt-4 flex justify-start items-center gap-x-4">
                                  
                                  <div className="flex justify-start items-center gap-x-2">
                                    <Alert className="flex items-center">
                                      Saldo a pagar: {data.saldo_disponible}.
                                    </Alert>
                                    <Copy
                                      content={data.saldo_disponible.toString()}
                                    />
                                  </div>
                                  <div className="flex justify-start items-center gap-x-2">
                                    <Alert className="flex items-center">
                                      Binance ID: {data.binance_id}.
                                    </Alert>
                                    <Copy content={data.binance_id} />
                                  </div>
                                </div>

                                  <div className="flex justify-start items-center gap-x-2 py-4">
                                    <div
                                      className="flex items-center gap-x-2"
                                      onClick={() =>
                                        document
                                          .getElementById("upload-file")
                                          .click()
                                      }
                                    >
                                      <p className="text-sm">Subir comprobante:</p>
                                      <IconButton>
                                        <PlusMini />
                                      </IconButton>
                                      <Input
                                        type="file"
                                        id="upload-file"
                                        className="hidden"
                                      />
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <Checkbox
                                        className="flex items-center gap-x-2"
                                        id="billing-shipping"
                                        checked={isConfirmed}
                                        onCheckedChange={(checked) =>
                                          setIsConfirmed(checked === true)
                                        }
                                      />
                                      <Label
                                        htmlFor="billing-shipping"
                                        className="flex items-center"
                                      >
                                        Estoy seguro de esta operación
                                      </Label>
                                    </div>

                                    <div>
                                      <Prompt>
                                        <Prompt.Trigger asChild>
                                          <Button
                                            className="bg-green-500 border-green-500 shadow-md text-white rounded-md px-4 py-2 "
                                            disabled={!isConfirmed}
                                          >
                                            Confirmar pago
                                          </Button>
                                        </Prompt.Trigger>
                                        <Prompt.Content>
                                          <Prompt.Header>
                                            <Prompt.Title className="text-xl font-extrabold">
                                              ¡Por favor confirma esta
                                              transacción!
                                            </Prompt.Title>
                                            <Container className="bg-ui-bg-component mt-4">
                                              <Prompt.Description>
                                                <Alert className="text-l">
                                                  Vas a pagar $:{" "}
                                                  <span className="font-extrabold">
                                                    {data.saldo_disponible}
                                                  </span>{" "}
                                                  a la tienda:{" "}
                                                  <span className="font-extrabold">
                                                    {data.storeName}
                                                  </span>
                                                </Alert>
                                              </Prompt.Description>
                                            </Container>

                                            <Textarea placeholder="Agregar notas de esta transacción ..." />
                                          </Prompt.Header>
                                          <Prompt.Footer>
                                            <Prompt.Cancel className="bg-[#a697f7] border-none hover:bg-[#6659ac] text-white">
                                              Cancelar
                                            </Prompt.Cancel>
                                            <Button className="bg-green-500 border-green-500 shadow-md text-white rounded-md px-4 py-2">
                                              Confirmar
                                            </Button>
                                          </Prompt.Footer>
                                        </Prompt.Content>
                                      </Prompt>
                                    </div>
                                  </div>
                                </Container>
                                
                                
                                <Container className=" mt-4">
                                  <h3 className="my-4">Histórico de pagos</h3>
                                 <ListPayStore />


                                </Container>
                              </div>
                            </Drawer.Body>

                            <Drawer.Footer><p>Tienda: <span className="font-extrabold">{data.storeName}</span></p></Drawer.Footer>
                          </Drawer.Content>
                        </Drawer>
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
