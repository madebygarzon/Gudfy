import React, { useEffect, useState } from "react"
import Link from "next/link"
import clsx from "clsx"
import { usePathname } from "next/navigation"

const NavList: React.FC = () => {
  const listItems = [
    { label: "Inicio", href: "/" },
    { label: "Tienda", href: "/store" },
    { label: "Juegos", href: "/blog" },
    { label: "Terjetas de regalos", href: "/card" },
    { label: "Xbox", href: "/xbox" },
  ]
  const [isSelect, setIsSelect] = useState<string>("/")
  const pathname = usePathname()

  useEffect(() => {
    setIsSelect(pathname)
  }, [pathname])

  return (
    <nav className="text-[#FFFFFF] font-[500] text-[14px] flex py-4 justify-center gap-x-7 bg-[#3F1C7A] duration-500">
      {listItems.map((item) => {
        return (
          <div
            className={clsx(
              "px-2 m-0 border-b-2  hover:border-[#ffffff]",
              { "border-[#ffffff]": isSelect == item.href },
              {"border-transparent": isSelect !== item.href}
            )}
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
