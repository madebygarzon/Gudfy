import React from "react"
import { Progress } from "@nextui-org/react"

type props = {
  stars: Array<{ rating: number; cantidad: string }>
  total: number
}

const ProgressStars: React.FC<props> = ({ stars, total }) => {
  const array: { rating: number; cantidad: string }[] = []

  for (let i = 1; i <= 5; i++) {
    let aux = false
    for (let j = 0; j < stars.length; j++) {
      if (i == stars[j].rating) {
        array.push(stars[j])
        aux = true
      }
    }
    if (!aux) {
      const startOBJ = {
        rating: i,
        cantidad: "0",
      }
      array.push(startOBJ)
    }
  }

  const handlerpercentage = (stars: string): number => {
    if (!stars) return 0
    const porsentaje = (parseInt(stars) * 100) / total
    return parseFloat(porsentaje.toFixed(1))
  }
  return (
    <div>
      {array.reverse().map((a) => {
        return (
          <div key={a.rating} className="flex items-center gap-2">
            <span className=" font-black w-[15%]">{`${a.rating} estrellas`}</span>
            <div className="w-[70%]">
              <Progress
                aria-label={`star ${a.rating}`}
                size="lg"
                color="secondary"
                radius="none"
                value={handlerpercentage(a.cantidad)}
                className="max-w-md"
              />
            </div>
            {a.cantidad === "0" ? (
              `${a.cantidad}%`
            ) : (
              <span className="text-[14 px] text-right  ">{`${handlerpercentage(
                a.cantidad
              )}%`}</span>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default ProgressStars
