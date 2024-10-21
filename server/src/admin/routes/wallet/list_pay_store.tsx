import { Table, Button, Drawer, Text, Container } from "@medusajs/ui";
import { Eye, ArrowDown } from "@medusajs/icons";
import { StorePaymentDetails } from "./store_payment_details";
import { useState, useEffect } from "react";
import { getListOrderPayments } from "../../actions/payments/get-list-order-payments";

type Order = {
  payment_id: string;
  amoun_paid: number;
  payment_note: string;
  voucher: string;
  commission: number;
  subtotal: number;
  payment_date: string;
  products: DetailsPay[];
};

type DetailsPay = {
  name: string;
  price: number;
  quantity: number;
  total_price: number;
  store_order_id: string;
  customer_name: string;
};

type props = {
  idStore: string;
};

const ListPayStore = ({ idStore }: props) => {
  const [dataOrderPay, setDataOrderPay] = useState<Order[]>();

  useEffect(() => {
    getListOrderPayments(idStore).then((data) => {
      setDataOrderPay(data);
    });
  }, []);

  return (
    <Table className="">
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell className="font-extrabold">
            ID de pago
          </Table.HeaderCell>
          <Table.HeaderCell className="font-extrabold">
            Fecha de pago
          </Table.HeaderCell>
          <Table.HeaderCell className="font-extrabold">Monto</Table.HeaderCell>
          <Table.HeaderCell className="font-extrabold">
            Detalles
          </Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {dataOrderPay?.length ? (
          dataOrderPay?.map((order) => {
            return (
              <Table.Row
                key={order.payment_id}
                className="[&_td:last-child]:w-[1%] [&_td:last-child]:whitespace-nowrap"
              >
                <Table.Cell>{order.payment_id}</Table.Cell>
                <Table.Cell>{order.payment_date}</Table.Cell>
                <Table.Cell>{order.amoun_paid}</Table.Cell>
                <Table.Cell>
                  <Drawer>
                    <Drawer.Trigger asChild>
                      <Eye className="text-ui-fg-subtle cursor-pointer" />
                    </Drawer.Trigger>
                    <Drawer.Content className="w-6/12 right-0">
                      <Drawer.Header>
                        <Drawer.Title>
                          Detalles de pago con ID: {order.payment_id}
                        </Drawer.Title>
                      </Drawer.Header>
                      <Drawer.Body className="overflow-y-auto p-4">
                        <Text className="">
                          Este es el detalle de los productos pagados en esta
                          transacción.
                        </Text>
                        <Container className="container1 my-4">
                          <StorePaymentDetails products={order.products} />
                        </Container>
                        <Container className="my-4">
                          <Text className="font-extrabold">Notas de pago:</Text>
                          <Table.Cell className="description">
                            <Text>{order.payment_note}</Text>
                          </Table.Cell>
                        </Container>
                        <Container className="bg-ui-bg-subtle-pressed">
                          <Text>
                            Id de pago: {order.payment_id} | Fecha de pago:{" "}
                            {order.payment_date}
                          </Text>
                        </Container>
                      </Drawer.Body>
                      <Drawer.Footer>
                        <Drawer.Close asChild>
                          <Button variant="secondary">
                            {" "}
                            <Eye />
                            Ver comprobante
                          </Button>
                        </Drawer.Close>
                        <Button>
                          <ArrowDown />
                          Descargar comprobante
                        </Button>
                      </Drawer.Footer>
                    </Drawer.Content>
                  </Drawer>
                </Table.Cell>
              </Table.Row>
            );
          })
        ) : (
          <>Cargadon...</>
        )}
      </Table.Body>
    </Table>
  );
};

export default ListPayStore;
