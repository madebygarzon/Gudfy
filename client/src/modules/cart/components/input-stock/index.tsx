import React, { useState } from "react"
import { Input } from "@nextui-org/react"

type InputSelectStock = {
  currentQuantity: number
  itemId: string
  currentStock: number
  unitPrice: number
  updateLineItem: (lineItemId: string, quantity: number) => void
}

const InputSelectStock: React.FC<InputSelectStock> = ({
  currentQuantity,
  itemId,
  currentStock,
  unitPrice,
  updateLineItem,
}) => {
  const [quantity, setQuantity] = useState<number>(currentQuantity)
  const [price, setPrice] = useState<number>(currentQuantity * unitPrice)
  const handlerAmount = (value: string) => {
    const numberAmount = parseInt(value)
    if (numberAmount > currentStock) {
      setQuantity(currentStock)
      setPrice(currentStock * unitPrice)
      updateLineItem(itemId, currentStock)
    } else if (numberAmount <= 0) {
      setQuantity(1)
      setPrice(unitPrice)
      updateLineItem(itemId, 1)
    } else {
      setQuantity(numberAmount)
      setPrice(numberAmount * unitPrice)
      updateLineItem(itemId, numberAmount)
    }
  }

  return (
    <div className="flex flex-col items-center justify-between ">
      <span className="flex items-center gap-x-2">
        <span>Cantidad: </span>

        <Input
          className="max-w-[70px] "
          color="primary"
          value={`${quantity}`}
          type="number"
          labelPlacement="outside"
          onChange={(e) => handlerAmount(e.target.value)}
        />
      </span>
      <span className="text-lg mt-5  text-center font-bold">
        Total: ${price.toFixed(2)}
      </span>
    </div>
  )
}

export default InputSelectStock
