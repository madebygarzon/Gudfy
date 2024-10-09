import { Table, Tooltip  } from "@medusajs/ui"
import { InformationCircleSolid } from "@medusajs/icons"

type Order = {
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
    producto: "Nintendo USA",
    
    num_pedido: "NUM-7898",
    cliente: "Luis Fernando Botero",
    valor: "126.00",
    comision: "12",
  },
  {
    id: 2,
    producto: "Netflix Colombia",
    
    num_pedido: "NUM-1245",
    cliente: "Yuliana Sosa",
    valor: "126.00",
    comision: "12",
  },
  {
    id: 3,
    producto: "Netflix Brasil",
    
    num_pedido: "NUM-2398",
    cliente: "Luis Fernando Botero",
    valor: "126.00",
    comision: "12",
  },
  {
    id: 4,
    producto: "Netflix Turquía",
    
    num_pedido: "NUM-2398",
    cliente: "Luis Fernando Botero",
    valor: "126.00",
    comision: "12",
  },
  {
    id: 5,
    producto: "Premiun",
    
    num_pedido: "NUM-4755",
    cliente: "Carolina Mejía",
    valor: "126.00",
    comision: "12",
  },
]

export function StorePaymentDetails() {
  const subtotal = fakeData.reduce((sum, order) => sum + parseFloat(order.valor), 0).toFixed(2);
  const comisionTotal = fakeData.reduce((sum, order) => sum + parseFloat(order.comision), 0).toFixed(2);
  const total = (parseFloat(subtotal) - parseFloat(comisionTotal)).toFixed(2);
  return (
    <Table>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell className="font-extrabold">Producto</Table.HeaderCell>        
          <Table.HeaderCell className="font-extrabold">Numero de pedido</Table.HeaderCell>
          <Table.HeaderCell className="font-extrabold">Cliente</Table.HeaderCell>
          <Table.HeaderCell className="font-extrabold">Valor</Table.HeaderCell>
          <Table.HeaderCell className="font-extrabold">Comisión</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
     
      <Table.Body className="overflow-y-auto">
        
          {fakeData.map((order) => {
            return (
              <Table.Row
                key={order.id}
                className="[&_td:last-child]:w-[1%] [&_td:last-child]:whitespace-nowrap"
              >
                <Table.Cell>{order.producto}</Table.Cell>                
                <Table.Cell>{order.num_pedido}</Table.Cell>
                <Table.Cell>{order.cliente}</Table.Cell>
                <Table.Cell>{order.valor}</Table.Cell>
                <Table.Cell>{order.comision}</Table.Cell>
              </Table.Row>
            )
          })}
          <Table.Row>
            <Table.Cell></Table.Cell>
            <Table.Cell></Table.Cell>
            <Table.Cell></Table.Cell>
            <Table.Cell className="font-bold">Subtotal</Table.Cell>
            <Table.Cell>{subtotal}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell></Table.Cell>
            <Table.Cell></Table.Cell>
            <Table.Cell></Table.Cell>
            <Table.Cell className="font-bold">Comisión Total</Table.Cell>
            <Table.Cell>{comisionTotal}</Table.Cell>
          </Table.Row>
          <Table.Row className="bg-ui-bg-subtle-pressed">
            <Table.Cell></Table.Cell>
            <Table.Cell></Table.Cell>
            <Table.Cell></Table.Cell>
            <Table.Cell className="font-bold">Total</Table.Cell>
            <Table.Cell className="font-bold">{total}</Table.Cell>
          </Table.Row>
      </Table.Body>
      
    </Table>
  )
}