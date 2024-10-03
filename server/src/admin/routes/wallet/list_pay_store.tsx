import { Table, Button, Drawer, Text, Container } from "@medusajs/ui";
import { Eye, ArrowDown } from "@medusajs/icons";
import { StorePaymentDetails } from "./store_payment_details";



type Order = {
  id: number;
  fecha: string;
  id_de_pago: string;
  monto: string;
  description: string;
  details_pay: DetailsPay[];
}

type DetailsPay = {
    id: number;
    producto: string;
    num_pedido: string;
    cliente: string;
    valor: string;
    comision: string;
}
const fakeData: Order[] = [
    {
        id: 1,
        fecha: "2024-11-01",
        id_de_pago: "897845451212",
        monto: "150.20",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ac quisque eu fusce penatibus nisl primis blandit fermentum justo nisi sociosqu velit. Hac eros lacinia sollicitudin himenaeos risus et nec varius est ad potenti quam. Scelerisque rhoncus eros euismod dui mollis purus sagittis nisl quisque porta vivamus sagittis.",
        details_pay: [ 
            {
                id: 1,
                producto: "Nintendo",
                num_pedido: "NP_45456",
                cliente: "Luis Perez",
                valor: "124.00",
                comision: "21",
            }

        ],
      },
      {
        id: 2,
        fecha: "2024-11-01",
        id_de_pago: "897845451212",
        monto: "150.20",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ac quisque eu fusce penatibus nisl primis blandit fermentum justo nisi sociosqu velit. Hac eros lacinia sollicitudin himenaeos risus et nec varius est ad potenti quam. Scelerisque rhoncus eros euismod dui mollis purus sagittis nisl quisque porta vivamus sagittis.",
          details_pay: [ 
            {
                id: 2,
                producto: "Nintendo",
                num_pedido: "NP_45456",
                cliente: "Luis Perez",
                valor: "124.00",
                comision: "21",
            }

        ],
        },
      {
        id: 3,
        fecha: "2024-11-01",
        id_de_pago: "897845451212",
        monto: "150.20",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ac quisque eu fusce penatibus nisl primis blandit fermentum justo nisi sociosqu velit. Hac eros lacinia sollicitudin himenaeos risus et nec varius est ad potenti quam. Scelerisque rhoncus eros euismod dui mollis purus sagittis nisl quisque porta vivamus sagittis.",
          details_pay: [ 
            {
                id: 3,
                producto: "Nintendo",
                num_pedido: "NP_45456",
                cliente: "Luis Perez",
                valor: "124.00",
                comision: "21",
            }

        ],
        },
      {
        id: 4,
        fecha: "2024-11-01",
        id_de_pago: "897845451212",
        monto: "150.20",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ac quisque eu fusce penatibus nisl primis blandit fermentum justo nisi sociosqu velit. Hac eros lacinia sollicitudin himenaeos risus et nec varius est ad potenti quam. Scelerisque rhoncus eros euismod dui mollis purus sagittis nisl quisque porta vivamus sagittis.",
          details_pay: [ 
            {
                id: 4,
                producto: "Nintendo",
                num_pedido: "NP_45456",
                cliente: "Luis Perez",
                valor: "124.00",
                comision: "21",
            }

        ],
        },

]

export function ListPayStore() {
  return (
    <Table className="">
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell className="font-extrabold">ID de pago</Table.HeaderCell>
          <Table.HeaderCell className="font-extrabold">Fecha de pago</Table.HeaderCell>
          <Table.HeaderCell className="font-extrabold">Monto</Table.HeaderCell>
          <Table.HeaderCell className="font-extrabold">Detalles</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {fakeData.map((order) => {
          return (
            <Table.Row
              key={order.id}
              className="[&_td:last-child]:w-[1%] [&_td:last-child]:whitespace-nowrap"
            >
              <Table.Cell>{order.id_de_pago}</Table.Cell>
              <Table.Cell>{order.fecha}</Table.Cell>
              <Table.Cell>{order.monto}</Table.Cell>
              <Table.Cell>
                <Drawer>
                    <Drawer.Trigger asChild>
                        <Eye className="text-ui-fg-subtle cursor-pointer" />
                    </Drawer.Trigger>
                    <Drawer.Content className="w-6/12 right-0">
                        <Drawer.Header>
                        <Drawer.Title>Detalles de pago con ID: {order.id_de_pago}</Drawer.Title>
                        
                        </Drawer.Header>
                        <Drawer.Body className="overflow-y-auto p-4">
                          <Text className="">Este es el detalle de los productos pagados en esta transacción.</Text>
                            <Container className="container1 my-4">
                                <StorePaymentDetails />
                            </Container>
                            <Container className="my-4">
                              <Text className="font-extrabold">Notas de pago:</Text>
                                <Table.Cell className="description">
                                  <Text>
                                    {order.description}
                                  </Text>
                                </Table.Cell>
                            </Container>
                            <Container className="bg-ui-bg-subtle-pressed">
                              <Text>Id de pago: {order.id_de_pago} | Fecha de pago: {order.fecha}</Text>
                            </Container>
                              
                        </Drawer.Body>
                        <Drawer.Footer>
                        <Drawer.Close asChild>
                            <Button variant="secondary"> <Eye/>Ver comprobante</Button>
                        </Drawer.Close>
                        <Button>
                          <ArrowDown/>
                            Descargar comprobante
                          </Button>
                        </Drawer.Footer>
                    </Drawer.Content>
                </Drawer>

                
              </Table.Cell>
            </Table.Row>
          )
        })}
      </Table.Body>
    </Table>
  )
}