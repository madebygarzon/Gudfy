"use client"

import useToggleState from "@lib/hooks/use-toggle-state"
import react, {
  createContext,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react"
import axios from "axios"
import { useMeCustomer } from "medusa-react"

type notification = {
  id: string
  order_claim_id: string
  notification_type_id: string
  customer_id: string
}

interface NotificationContext {
  notifications: notification[]
  setNotifications: (value: react.SetStateAction<notification[]>) => void
  handlerRetriverNotification: () => void
}

export const NotificationContext = createContext<NotificationContext | null>(
  null
)
export const NotificationProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const { customer } = useMeCustomer()
  const [notifications, setNotifications] = useState<notification[]>([])
  const handlerRetriverNotification = async () => {
    if (!customer?.id) return
    await axios
      .get(
        `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/notification/${customer?.id}`,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        const result = res.data
        setNotifications(result)
      })
      .catch((e) => {
        alert(e.error.message)
      })
  }

  useEffect(() => {
  
    handlerRetriverNotification()
  }, [])

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        setNotifications,
        handlerRetriverNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotificationContext = () => {
  const context = useContext(NotificationContext)
  if (context === null) {
    throw new Error(
      "useOrderContext must be used within a CartDropdownProvider"
    )
  }

  return context
}
