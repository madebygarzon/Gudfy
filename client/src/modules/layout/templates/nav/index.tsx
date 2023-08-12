"use client"
import React,{ useEffect, useState } from "react"
import { useAccount } from "@lib/context/account-context"
import { useMobileMenu } from "@lib/context/mobile-menu-context"
import Hamburger from "@modules/common/components/hamburger"
import CartDropdown from "@modules/layout/components/cart-dropdown"
import DropdownMenu from "@modules/layout/components/dropdown-menu"
import MobileMenu from "@modules/mobile-menu/templates"
import DesktopSearchModal from "@modules/search/templates/desktop-search-modal"
import clsx from "clsx"
import Image from "next/image"
import { usePathname } from "next/navigation"
import CountrySelect from "../../components/country-select"
import DropdownGudFy from "@modules/layout/components/dropdown-gf"
import Link from "next/link" 

const Nav = () => {
  const { customer } = useAccount()
  const pathname = usePathname()
  const [isHome, setIsHome] = useState(false)
  const [isLogin, setIsLogin]= useState(true)
  const [isScrolled, setIsScrolled] = useState(false)
  const propsDropDown = {
    name: "Cuenta",
    items: [
      { label: "Ingresar", href: "/account/login" },
      { label: "Registrarse", href: "/account/login" },
    ],
  }
  const propsDropDownLog = {
    name: "Name user",
    items: [
      { label: "Mis pedidos", href: "/" },
      { label: "Editar perfil", href: "/" },
      { label: "Mi carrito", href: "/" },
      { label: "wallet", href: "/"},
      { label: "Cerrar sesión", href:"/"}
    ],
  }

  //useEffect that detects if window is scrolled > 5px on the Y axis

  useEffect(() => {
    pathname === "/" ? setIsHome(true) : setIsHome(false)
    pathname === "/account/login" ||  pathname === "/account/register" ?  setIsLogin(false) : setIsLogin(true)
    const detectScrollY = () => {
      if (window.scrollY > 5) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", detectScrollY)

    return () => {
      window.removeEventListener("scroll", detectScrollY)
    }
  }, [pathname])

  const { toggle } = useMobileMenu()

  return isLogin ? (
    <div
      className={clsx("sticky top-0 inset-x-0 z-50 group", {
        "!fixed": isHome,
      })}
    >
      <header
        className={clsx(
          "relative h-[76px] px-8 mx-auto my-0 transition-colors bg-transparent border-transparent duration-500 hover:bg-blue-gf shadow-gf border-b-1",
          {
            "!bg-blue-gf": !isHome || isScrolled,
          }
        )}
      >
        <nav
          className={clsx(
            "text-white flex items-center justify-between w-full h-full text-base transition-colors duration-200",
            {
              "text-white": isHome && !isScrolled,
            }
          )}
        >
          <div className="flex-1  ml-20 basis-0 h-full flex items-center">
            <Link href="/">
              <Image
                alt="gudfy"
                src="/header/logo_gudfy.webp"
                width={132.28}
                height={50}
              />
            </Link>

            <div className="flex ml-4 items-start h-full">
              <DesktopSearchModal />
            </div>
          </div>

          <div className="flex items-center justify-between h-full flex-1 basis-0 ">
            {/* <div className="block small:hidden">
              <Hamburger setOpen={toggle} />
            </div>
          <div className="hidden small:block h-full">
              <DropdownMenu />
          </div> */}
            <div className="min-w-[316px] flex xsmall:justify-end">
              <CountrySelect />
            </div>

            <div className="hidden small:flex items-center gap-x-6 h-full">
              {/* {process.env.FEATURE_SEARCH_ENABLED && <DesktopSearchModal />} */}
              {!customer ? (
                <DropdownGudFy
                  name={propsDropDown.name}
                  items={propsDropDown.items}
                />
              ) : (
                <DropdownGudFy
                  name={propsDropDownLog.name}
                  items={propsDropDownLog.items}
                />
              )}
            </div>
            <CartDropdown />
          </div>
        </nav>
        <MobileMenu />
      </header>
      {!isScrolled ? (
        <nav
          className={clsx(
            "text-[#FFFFFF] font-[500] text-[14px] flex py-4 justify-center gap-x-6 hover:bg-blue-gf duration-500",
            { "!bg-blue-gf": !isHome }
          )}
        >
          <div className="px-2 m-0 border-b-2 border-transparent hover:border-[#ffffff] ">
            <Link href="/" className="">
              Home
            </Link>
          </div>
          <div className="px-2 m-0 border-b-2 border-transparent hover:border-[#ffffff]" >
            <Link href="/" className="">
              {" "}
              <span>Blog</span>{" "}
            </Link>
          </div>
          <div className="px-2 m-0 border-b-2 border-transparent hover:border-[#ffffff]" >
            <Link href="/" className="">
              {" "}
              <span>Store</span>{" "}
            </Link>
          </div>
        </nav>
      ) : (
        ""
      )}
    </div>
  ) : (
    ""
  )   
}

export default Nav
