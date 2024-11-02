import { Table, Tooltip } from "@medusajs/ui";
import { InformationCircleSolid } from "@medusajs/icons";

type DetailsPay = {
  name: string;
  price: number;
  quantity: number;
  total_price: string;
  store_order_id: string;
  customer_name: string;
};

type props = {
  products: DetailsPay[];
};

export function StorePaymentDetails({ products }: props) {
  const subtotal = products?.reduce(
    (sum, prod) => sum + Number(prod.total_price),
    0
  );
  const comisionTotal = products?.reduce(
    (sum, prod) => sum + Number(prod.total_price) * 0.1,
    0
  );
  const total = subtotal - comisionTotal;

  return (
    <Table>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell className="font-extrabold">
            Producto
          </Table.HeaderCell>
          <Table.HeaderCell className="font-extrabold">
            Numero de pedido
          </Table.HeaderCell>
          <Table.HeaderCell className="font-extrabold">
            Cliente
          </Table.HeaderCell>
          <Table.HeaderCell className="font-extrabold">
            Cantidad
          </Table.HeaderCell>
          <Table.HeaderCell className="font-extrabold">Valor</Table.HeaderCell>
          <Table.HeaderCell className="font-extrabold">total</Table.HeaderCell>
          <Table.HeaderCell className="font-extrabold">
            Comisión
          </Table.HeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body className="overflow-y-auto">
        {products?.map((product, i) => {
          return (
            <Table.Row
              key={i}
              className="[&_td:last-child]:w-[1%] [&_td:last-child]:whitespace-nowrap"
            >
              <Table.Cell>{product.name}</Table.Cell>
              <Table.Cell>{product.store_order_id}</Table.Cell>
              <Table.Cell>{product.customer_name}</Table.Cell>
              <Table.Cell>{product.quantity}</Table.Cell>
              <Table.Cell>{product.price}</Table.Cell>
              <Table.Cell>{product.total_price}</Table.Cell>
              <Table.Cell>
                {(Number(product.total_price) * 0.1).toFixed(2)}
              </Table.Cell>
            </Table.Row>
          );
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
          <Table.Cell>{comisionTotal.toFixed(2)}</Table.Cell>
        </Table.Row>
        <Table.Row className="bg-ui-bg-subtle-pressed">
          <Table.Cell></Table.Cell>
          <Table.Cell></Table.Cell>
          <Table.Cell></Table.Cell>
          <Table.Cell className="font-bold">Total</Table.Cell>
          <Table.Cell className="font-bold">{total.toFixed(2)}</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  );
}
