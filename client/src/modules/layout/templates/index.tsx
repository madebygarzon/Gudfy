"use client"
import Footer from "@modules/layout/templates/footer"
import Nav from "@modules/layout/templates/nav"
import React, { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import io, { Socket } from "socket.io-client"
import { useNotificationContext } from "@lib/context/notification-context"
import { useMeCustomer } from "medusa-react"
import { useAccount } from "@lib/context/account-context"
import { useSellerStoreGudfy } from "@lib/context/seller-store"

const restrictHeader = [
  // Podemos agregar las urls en las que no querramos mostar footer o Header
  { url: "/account/login" },
  { url: "/account/register" },
  { url: "/account/reset-password" },
]

const Layout: React.FC = ({ children }) => {
  const pathname = usePathname()
  const [isLogin, setIsLogin] = useState(false)
  const { customer } = useAccount()
  const { handlerLowStock } = useSellerStoreGudfy()
  const [socket, setSocket] = useState<Socket | null>(null)
  const { handlerRetriverNotification } = useNotificationContext()
  function isRestric(path: String): boolean {
    return restrictHeader.some((restric) => path.includes(restric.url))
  }

  useEffect(() => {
    if (customer){ handlerRetriverNotification(); handlerLowStock()}
  }, [customer])

  useEffect(() => {
    const socketIo = io(process.env.PORT_SOKET || "http://localhost:3001")
    socketIo.on("new_notification", () => {
      handlerRetriverNotification(customer?.id)
    })

    setSocket(socketIo)

    return () => {
      socketIo.disconnect()
    }
  }, [customer])

  useEffect(() => {
    const restricPathname = isRestric(pathname)
    restricPathname ? setIsLogin(false) : setIsLogin(true)
  }, [pathname])

  return isLogin ? (
    <div>
      <Nav />
      <main className="relative">{children}</main>
      <Footer />
    </div>
  ) : (
    <div>
      <main className="relative">{children}</main>
    </div>
  )
}

export default Layout
