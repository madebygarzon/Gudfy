import Button from "@modules/common/components/button"
import React from "react"

const MissingItemsAlert = () => {
  return (
    <div className="bg-violet-100  text-blue-gf p-4 rounded-lg shadow-md max-w-2xl mx-auto">
      <h2 className="text-lg font-bold">
        ¿Hiciste una compra pero falta algún artículo?
      </h2>
      <p className="mt-2">
        Esto puede ocurrir si el vendedor se quedó sin stock justo al finalizar
        tu pedido, razón por la cual solo recibiste una parte de los productos.
      </p>
      <p className="mt-2">
        Si no has recibido todos los artículos de tu pedido, por favor
        infórmanos creando un ticket. Revisaremos tu caso y te ayudaremos a
        solucionarlo lo antes posible.
      </p>
      <Button
        href="/account/ticket"
        className="inline-block mt-4  text-white px-4 py-2 rounded-lg font-medium  transition duration-300"
      >
        Crear Ticket
      </Button>
    </div>
  )
}

export default MissingItemsAlert
