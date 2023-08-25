"use client"
import React, { useEffect, useState } from "react"
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
import Wallet from "@modules/layout/components/wallet-nav"
import NavList from "@modules/layout/components/nav-list"

const Nav = () => {
  const { customer } = useAccount()
  const pathname = usePathname()
  const [isHome, setIsHome] = useState(false)
  const [isLogin, setIsLogin] = useState(false)
  const [isScrolled, setIsScrolled] = useState<boolean>()
  const propsDropDown = {
    name: "Cuenta",
    items: [
      { label: "Ingresar", href: "/account/login" },
      { label: "Registrarse", href: "/account/register" },
    ],
  }
  const propsDropDownLog = {
    name: "Name user",
    items: [
      { label: "Mis pedidos", href: "/" },
      { label: "Editar perfil", href: "/" },
      { label: "Mi carrito", href: "/" },
      { label: "wallet", href: "/" },
      { label: "Cerrar sesión", href: "/" },
    ],
  }

  //useEffect that detects if window is scrolled > 5px on the Y axis

  useEffect(() => {
    pathname === "/" ? setIsHome(true) : setIsHome(false)
    pathname === "/account/login" || pathname === "/account/register"
      ? setIsLogin(false)
      : setIsLogin(true)
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
      <header className="relative h-[92px] px-8  mx-auto my-0 transition-colors bg-blue-gf border-transparent duration-500  shadow-gf border-b-1">
        <nav
          className={clsx(
            "text-white flex items-center justify-between w-full h-full text-base transition-colors duration-200",
            {
              "text-white": isHome && !isScrolled,
            }
          )}
        >
          <div className="flex-1 gap-x-5  h-full flex items-center">
            <Link href="/">
              <Image
                alt="gudfy"
                src="/header/gudfy_logo.svg"
                width={167.84}
                height={54.42}
              />
            </Link>

            <div className="flex ml-4 items-center h-full">
              <DesktopSearchModal />
              {/* {process.env.FEATURE_SEARCH_ENABLED && <DesktopSearchModal />} */}
            </div>

            <CountrySelect />
          </div>
          <div className="flex items-center gap-x-8 ">
            <Wallet />
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
            <CartDropdown />
          </div>
        </nav>
        <MobileMenu />
      </header>
      {!isScrolled ? <NavList /> : <div></div>}
    </div>
  ) : (
    <div></div>
  )
}

export default Nav
