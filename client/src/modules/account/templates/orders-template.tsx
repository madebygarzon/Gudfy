import OrderOverview from "../components/order-overview"

const OrdersTemplate = () => {
  return (
    <div className="w-full">
      <div className="mb-8 flex flex-col gap-y-4">
        <h1 className="text-2xl-semi">Compras</h1>
        <p className="text-base-regular">
          Vea sus pedidos anteriores y su estado. También puedes crear
          devoluciones o cambios para sus pedidos si es necesario.
        </p>
      </div>
      <div>
        <OrderOverview />
      </div>
    </div>
  )
}

export default OrdersTemplate
