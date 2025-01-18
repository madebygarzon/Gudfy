import { useEffect, useState } from "react";
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
import { Eye, InformationCircleSolid, PlusMini } from "@medusajs/icons";
import Spinner from "../../components/shared/spinner";
import { RouteConfig } from "@medusajs/admin";
import ListPayStore from "./list_pay_store";
import { getListStoresToPay } from "../../actions/payments/get-list-store-to-pay";
import { postDataOrderPay } from "../../actions/payments/post-data-order-pay";
import { formatDate } from "../../utils/format-date";

type dataSotores = {
  store_id: string;
  store_name: string;
  date_order: string;
  outstanding_balance: number;
  available_balance: number;
  balance_paid: number;
  product: [
    {
      svo_id: string;
      order_id: string;
      product_name: string;
      thumbnail: string;
      price: number;
      quantity: number;
      customer_name: string;
      product_order_status: string;
    }
  ];
};

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
  const [dataCustomer, setDataCustomer] = useState<{
    dataStore: dataSotores[];
    dataFilter: dataSotores[];
    dataPreview: dataSotores[];
    count: number;
  }>({
    dataStore: [],
    dataFilter: [],
    dataPreview: [],
    count: 0,
  });
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [pageTotal, setPagetotal] = useState(
    Math.ceil(dataCustomer.dataStore?.length / 5)
  );
  const [page, setPage] = useState(1);
  const [rowsPages, setRowsPages] = useState(5);
  const [isLoading, setIsLoading] = useState(false);

  const handlerNextPage = (action) => {
    if (action === "NEXT")
      setPage((old) => {
        setDataCustomer({
          ...dataCustomer,
          dataPreview: handlerPreviewSellerAplication(
            dataCustomer.dataFilter?.length
              ? dataCustomer.dataFilter
              : dataCustomer.dataStore,
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
            dataCustomer.dataFilter?.length
              ? dataCustomer.dataFilter
              : dataCustomer.dataStore,
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
    setPagetotal(Math.ceil(queryParams?.length / dataRowPage));
    return newArray;
  };

  const handlerFilter = (value, filterType) => {
    setPage(1);
    let dataFilter = dataCustomer.dataStore;
  };

  const handlerRowsNumber = (value) => {
    const valueInt = parseInt(value);
    setRowsPages(valueInt);
    setDataCustomer({
      ...dataCustomer,
      dataPreview: handlerPreviewSellerAplication(
        dataCustomer.dataFilter?.length
          ? dataCustomer.dataFilter
          : dataCustomer.dataStore,
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

  const [dataPay, setDataPay] = useState<{
    amount_paid: number;
    payment_note: string;
    store_id: string;
    subtotal: number;
    commission: number;
    customer_name: string;
  }>();
  const [voucher, setVoucher] = useState<File>();

  const [products, setProducts] = useState<
    {
      svo_id: string;
      product_name: string;
      product_price: number;
      quantity: number;
    }[]
  >();

  const handlerDataOrder = (data: dataSotores) => {
    setDataPay({
      amount_paid: data.available_balance,
      payment_note: " ",
      store_id: data.store_id,
      subtotal: data.available_balance - data.available_balance * 0.1,
      commission: data.available_balance * 0.1,
      customer_name: data.product[0].customer_name,
    });

    const productsPushOrder = data.product.filter(
      (p) => p.product_order_status === "Finished_ID"
    );
    setProducts(
      productsPushOrder.map((p) => ({
        svo_id: p.svo_id,
        product_name: p.product_name,
        product_price: p.price,
        quantity: p.quantity,
      }))
    );
  };

  const handlerSubmitPay = () => {
    postDataOrderPay(dataPay, voucher, products).then(() => {
      alert("hecho");
    });
  };

  const handlerOrderId = (orderId: string) => {
    return orderId.replace("reder_payments_id__", "");
  };

  const handlerRoundDecimals = (value: number) => {
    return Math.floor(value * 1000) / 1000; // Trunca a 3 decimales
  };

  useEffect(() => {
    getListStoresToPay().then((data) => {
      setDataCustomer((oldData) => ({ ...oldData, dataStore: data }));
    });
  }, []);

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
          ) : dataCustomer.dataStore?.length ? (
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
                  {dataCustomer.dataStore?.map((data) => (
                    <Table.Row key={data.store_id}>
                      <Table.Cell>{data.store_name}</Table.Cell>

                      <Table.Cell>{data.outstanding_balance}</Table.Cell>
                      <Table.Cell className="font-extrabold bg-[#54bf784a] flex justify-center items-center mr-12 rounded-2xl">
                        {data.available_balance}
                      </Table.Cell>
                      <Table.Cell>--</Table.Cell>

                      <Table.Cell className="flex gap-x-2 items-center">
                        <Drawer>
                          <Drawer.Trigger>
                            <Eye className="text-ui-fg-subtle" />
                          </Drawer.Trigger>
                          <Drawer.Content className="w-9/12 right-0">
                            <Drawer.Header>
                              <div className="flex justify-center items-center gap-x-2">
                                <Drawer.Title>
                                  Historial de ventas de {data.store_name}
                                </Drawer.Title>
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
                                        Pedido
                                      </Table.HeaderCell>
                                      <Table.HeaderCell>
                                        Cantidad
                                      </Table.HeaderCell>
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
                                      <Table.HeaderCell>
                                        Estado
                                      </Table.HeaderCell>
                                      <Table.HeaderCell>
                                        Neto a pagar
                                      </Table.HeaderCell>
                                      <Table.HeaderCell>
                                        Cliente
                                      </Table.HeaderCell>
                                    </Table.Row>
                                  </Table.Header>
                                  <Table.Body>
                                    {data.product?.map((product) => {
                                      return (
                                        <Table.Row
                                          key={product.order_id}
                                          className="[&_td:last-child]:w-[1%] [&_td:last-child]:whitespace-nowrap"
                                        >
                                          <Table.Cell>
                                            {product.product_name}
                                          </Table.Cell>
                                          <Table.Cell>
                                            {handlerOrderId(product.order_id)}
                                          </Table.Cell>
                                          <Table.Cell>
                                            {product.quantity}
                                          </Table.Cell>
                                          <Table.Cell>
                                            {product.price}
                                          </Table.Cell>
                                          <Table.Cell>--</Table.Cell>
                                          <Table.Cell>
                                            {(
                                              product.price *
                                              product.quantity *
                                              0.1
                                            ).toFixed(2)}
                                          </Table.Cell>
                                          <Table.Cell>
                                            {product.product_order_status ===
                                            "Finished_ID" ? (
                                              <div className="bg-green-500 text-white rounded-md px-2 py-1">
                                                {"DISPONIBLE"}
                                              </div>
                                            ) : product.product_order_status ===
                                                "Completed_ID" ||
                                              product.product_order_status ===
                                                "Discussion_ID" ? (
                                              <div className="bg-[#46679da3] text-white rounded-md px-2 py-1">
                                                {"PENDIENTE"}
                                              </div>
                                            ) : (
                                              <div className="">{"PAGADO"}</div>
                                            )}
                                          </Table.Cell>
                                          <Table.Cell>
                                            {product.price * product.quantity -
                                              product.price *
                                                product.quantity *
                                                0.1}
                                          </Table.Cell>
                                          <Table.Cell>
                                            {product.customer_name}
                                          </Table.Cell>
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
                                  {data.balance_paid - data.balance_paid * 0.1}
                                </Badge>
                                <p>Saldo pendiente:</p>
                                <Badge className="bg-[#578be0a3] text-white shadow-md ">
                                  {data.available_balance -
                                    data.available_balance * 0.1}
                                </Badge>
                                <p>Saldo disponible:</p>
                                <Badge className="bg-green-500 text-white shadow-md ">
                                  {data.outstanding_balance}
                                </Badge>
                              </div>
                            </Drawer.Footer>
                          </Drawer.Content>
                        </Drawer>
                      </Table.Cell>

                      <Table.Cell>
                        <Drawer>
                          <Drawer.Trigger>
                            <Button
                              onClick={() => handlerDataOrder(data)}
                              className="bg-green-500 border-green-500 shadow-md text-white rounded-md px-4 py-2 "
                            >
                              Pagos
                            </Button>
                          </Drawer.Trigger>
                          <Drawer.Content className="w-6/12 right-0">
                            <Drawer.Header>
                              <Drawer.Title>
                                Zona de pagos tienda: {data.store_name}
                              </Drawer.Title>
                            </Drawer.Header>
                            <Drawer.Body className="overflow-y-auto">
                              <div className="w-full px-4">
                                <h3 className="my-4">
                                  Realizar pago de{" "}
                                  <span className="font-extrabold">
                                    {data.available_balance}
                                  </span>{" "}
                                  a la tienda{" "}
                                  <span className="font-extrabold">
                                    {data.store_name}
                                  </span>
                                </h3>
                                <Container className="mt-4">
                                  <div className="mt-4 flex justify-start items-center gap-x-4">
                                    <div className="flex justify-start items-center gap-x-2">
                                      <Alert className="flex items-center">
                                        Saldo a pagar con el 1% de comisión:{" "}
                                        {handlerRoundDecimals(
                                          data.available_balance -
                                            data.available_balance * 0.1
                                        )}
                                        .
                                      </Alert>
                                      <Copy
                                        content={data.available_balance.toString()}
                                      />
                                    </div>
                                    <div className="flex justify-start items-center gap-x-2">
                                      <Alert className="flex items-center">
                                        Binance ID: Binance_ID123AsD01aSd.
                                      </Alert>
                                      <Copy content={"Binance_ID123AsD01aSd"} />
                                    </div>
                                  </div>

                                  <div className="flex justify-start items-center gap-x-2 py-4">
                                    <div className="flex items-center gap-x-2">
                                      <p className="text-sm">
                                        Subir comprobante:
                                      </p>

                                      <label
                                        htmlFor={"upload-file"}
                                        className="cursor-pointer bg-slate-600 text-white text-xs py-2 px-4 rounded-md border border-slate-500"
                                      >
                                        <PlusMini />
                                      </label>
                                      <Input
                                        type="file"
                                        id="upload-file"
                                        className="hidden"
                                        onChange={(e) => {
                                          setVoucher(e.target.files[0]);
                                        }}
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
                                                    {data.available_balance -
                                                      data.available_balance *
                                                        0.1}
                                                  </span>{" "}
                                                  a la tienda:{" "}
                                                  <span className="font-extrabold">
                                                    {data.store_name}
                                                  </span>
                                                </Alert>
                                              </Prompt.Description>
                                            </Container>

                                            <Textarea
                                              placeholder="Agregar notas de esta transacción ..."
                                              onChange={(e) => {
                                                setDataPay((old) => ({
                                                  ...old,
                                                  payment_note: e.target.value,
                                                }));
                                              }}
                                            />
                                          </Prompt.Header>
                                          <Prompt.Footer>
                                            <Prompt.Cancel className="bg-[#a697f7] border-none hover:bg-[#6659ac] text-white">
                                              Cancelar
                                            </Prompt.Cancel>
                                            <Button
                                              onClick={handlerSubmitPay}
                                              className="bg-green-500 border-green-500 shadow-md text-white rounded-md px-4 py-2"
                                            >
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
                                  <ListPayStore idStore={data.store_id} />
                                </Container>
                              </div>
                            </Drawer.Body>

                            <Drawer.Footer>
                              <p>
                                Tienda:{" "}
                                <span className="font-extrabold">
                                  {data.store_name}
                                </span>
                              </p>
                            </Drawer.Footer>
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
