import React, { useEffect, useState } from "react"
import Link from "next/link"
import clsx from "clsx"
import { usePathname } from "next/navigation"

const NavList: React.FC = () => {
  const listItems = [
    { id: "1", label: "Inicio", href: "/" },
    { id: "2", label: "Tienda", href: "/store" },
    { id: "3", label: "Juegos", href: "/blog" },
    { id: "4", label: "Terjetas de regalos", href: "/card" },
    { id: "5", label: "Xbox", href: "/xbox" },
  ]
  const [isSelect, setIsSelect] = useState<string>("/")
  const pathname = usePathname()

  useEffect(() => {
    setIsSelect(pathname)
  }, [pathname])

  return (
    <nav className="text-[#FFFFFF] font-[500] text-[14px] flex py-4 justify-center gap-x-7 bg-[#3F1C7A] duration-500">
      {listItems.map((item) => {
        const isSelected = isSelect === item.href
        return (
          <div
            key={item.id}
            className={`px-2 m-0 border-b-2 hover:border-white ${
              isSelected ? "border-white" : "border-transparent"
            }`}
          >
            <Link href={item.href} className="">
              {item.label}
            </Link>
          </div>
        )
      })}
    </nav>
  )
}

export default NavList
