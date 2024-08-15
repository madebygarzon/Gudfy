import React, { useEffect, useState } from "react"
import { useOrderGudfy } from "@lib/context/order-context"

interface TimerProps {
  creationTime: string
}

const Timer: React.FC<TimerProps> = ({ creationTime }) => {
  const [timeLeft, setTimeLeft] = useState<number>(600) // 10 minutos en segundos
  const [isCancelled, setIsCancelled] = useState<boolean>(false)
  const { handlerListOrder } = useOrderGudfy()

  useEffect(() => {
    const calculateTimeLeft = () => {
      const creationDate = new Date(creationTime)
      const currentDate = new Date()
      const timeDifference = Math.floor(
        (currentDate.getTime() - creationDate.getTime()) / 1000
      ) // diferencia en segundos

      if (timeDifference >= 600) {
        setIsCancelled(true)
        //handlerListOrder()
      } else {
        setTimeLeft(600 - timeDifference)
      }
    }

    calculateTimeLeft()

    const interval = setInterval(() => {
      calculateTimeLeft()
    }, 1000)

    return () => clearInterval(interval)
  }, [creationTime])

  if (isCancelled) {
    return <div>Cancelado</div>
  }

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  return (
    <div className="text-red-500">
      {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
    </div>
  )
}

export default Timer
