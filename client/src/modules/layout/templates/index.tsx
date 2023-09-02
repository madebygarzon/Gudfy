"use client"
import Footer from "@modules/layout/templates/footer"
import Nav from "@modules/layout/templates/nav"
import React, { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

const restrictHeader = [
  // Podemos agregar las urls en las que no querramos mostar footer o Header
  { url: "/account/login" },
  { url: "/account/register" },
  { url: "/account/reset-password" },
]

const Layout: React.FC = ({ children }) => {
  const pathname = usePathname()

  const [isLogin, setIsLogin] = useState(false)

  function isRestric(path: String): boolean {
    return restrictHeader.some((restric) => path.includes(restric.url))
  }

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
