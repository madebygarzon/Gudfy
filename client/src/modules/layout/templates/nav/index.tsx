"use client"
import React, { useEffect, useState } from "react"
import { useAccount } from "@lib/context/account-context"
import { useMobileMenu } from "@lib/context/mobile-menu-context"
import CartDropdown from "@modules/layout/components/cart-dropdown"
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
  const [isScrolled, setIsScrolled] = useState<boolean>(true)
  const propsDropDown = {
    name: "Ingresar",
    items: [
      { label: "Ingresar", href: "/account/login" },
      { label: "Registrarse", href: "/account/register" },
    ],
  }

  const propsDropDownLog = {
    name: "Name user",
    href: "/account/orders",
    items: [
      { label: "Mis pedidos", href: "/account/orders" },
      { label: "Editar perfil", href: "/account/profile" },
      { label: "Mi carrito", href: "/cart" },
      { label: "wallet", href: "/" },
      { label: "Cerrar sesión", href: "/" },
    ],
  }

  useEffect(() => {
    const detectScrollY = () => {
      if (window.scrollY > 0 && isScrolled) {
        setIsScrolled(false)
      } else if (window.scrollY === 0 && !isScrolled) {
        setIsScrolled(true)
      }
    }
    window.addEventListener("scroll", detectScrollY)
    return () => {
      window.removeEventListener("scroll", detectScrollY)
    }
  }, [isScrolled])

  const { toggle } = useMobileMenu()

  return (
    <div className={clsx("sticky top-0 inset-x-0 z-50 group")}>
      <header className="relative h-[92px] px-8  mx-auto my-0 transition-colors bg-blue-gf border-transparent duration-500  shadow-gf border-b-1">
        <nav
          className={clsx(
            "text-white flex items-center justify-between w-full h-full text-base transition-colors duration-200",
            {
              "text-white": !isScrolled,
            }
          )}
        >
          <div className="gap-x-5  h-full flex items-center">
            <div className=" min-w-[167.84px] min-h-[54.42] transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300">
              <Link href="/">
                <Image
                  alt="gudfy"
                  src="/header/gudfy_logo.svg"
                  width={167.84}
                  height={54.42}
                />
              </Link>
            </div>

            <div className="hidden sm:flex ml-4 items-center h-full">
              <DesktopSearchModal />
              {/* {process.env.FEATURE_SEARCH_ENABLED && <DesktopSearchModal />} */}
            </div>
            <div>
              <CountrySelect />
            </div>
          </div>
          <div className="flex items-center gap-x-4 sm:gap-x-8 ">
            <div>{/* <Wallet /> */}</div>
            <div>
              {!customer ? (
                <DropdownGudFy
                  name={propsDropDown.name}
                  items={propsDropDown.items}
                />
              ) : (
                <DropdownGudFy
                  name={customer?.first_name}
                  items={propsDropDownLog.items}
                />
              )}
            </div>
            <div>
              <CartDropdown />
            </div>
          </div>
        </nav>
        <MobileMenu />
      </header>

      {isScrolled ? <NavList /> : <div className="h-[1px] bg-blue-gf"></div>}
    </div>
  )
}

export default Nav
