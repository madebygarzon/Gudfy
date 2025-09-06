"use client"
import React, { useEffect, useState } from "react"
import { useAccount } from "@lib/context/account-context"
import { useMobileMenu } from "@lib/context/mobile-menu-context"
import CartDropdown from "@modules/layout/components/cart-dropdown"
import MobileMenu from "@modules/mobile-menu/templates"
import ProductSearch from "@modules/search/components/product-search"
import clsx from "clsx"
import Image from "next/image"
import { usePathname } from "next/navigation"
import CountrySelect from "../../components/country-select"
import DropdownGudFy from "@modules/layout/components/dropdown-gf"
import DropdownGudFyLog from "@modules/layout/components/dropdown-gf-log"
// import Link from "next/link"
import Wallet from "@modules/layout/components/wallet-nav"
import NavList from "@modules/layout/components/nav-list"
import NavListSimple from "@modules/layout/components/nav-list/nav-list-simple"
import NavListSimpleMobile from "@modules/layout/components/nav-list/nav-list-simple-mobile"
import CategoryProducts from "@modules/layout/components/category-products"

import { useTranslation } from "react-i18next"
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Link,
  Button,
} from "@heroui/react"

const Nav = () => {

  const [isMenuOpen, setIsMenuOpen] = React.useState(false)
  const menuItems = [
    "Profile",
    "Dashboard",
    "Activity",
    "Analytics",
    "System",
    "Deployments",
    "My Settings",
    "Team Settings",
    "Help & Feedback",
    "Log Out",
  ]


  const { t } = useTranslation("common")
  const { customer } = useAccount()
  const [isScrolled, setIsScrolled] = useState<boolean>(true)
  const propsDropDown = {
    name: t("log_in"),
    items: [
      { label: t("log_in"), href: "/account/login" },
      { label: t("sign_up"), href: "/account/register" },
    ],
  }

  const propsDropDownLog = {
    name: "Name user",
    href: "/account/orders",
    items: [
      { label: t("account_menu_cp"), href: "/account" },
      { label: t("account_menu_mo"), href: "/account/orders" },
      { label: t("account_menu_ep"), href: "/account/profile" },
      { label: t("account_menu_mc"), href: "/cart" },
      { label: t("account_menu_lg"), href: "/" },
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
    <>
      <div
        className={clsx("hidden sm:block sticky top-0 inset-x-0 z-50 group")}
      >
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
                    src="/header/gudfy_logo.png"
                    width={220}
                    height={70}
                  />
                </Link>
              </div>

              <div className="hidden sm:flex ml-4 items-center h-full">
                <ProductSearch />
              </div>
              <div className="min-w-[350px]">{/* <CountrySelect /> */}</div>
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
                  <DropdownGudFyLog name={customer?.first_name} />
                )}
              </div>
              <div>
                <CartDropdown />
              </div>
            </div>
          </nav>
          <MobileMenu />
        </header>
        {/* <NavList /> */}
        <NavListSimple />
        {/* <CategoryProducts /> */}
      </div>

      <div className={clsx("block sm:hidden sticky top-0 inset-x-0 z-50")}>
        <header className="relative h-[70px] px-4 mx-auto my-0 transition-colors bg-blue-gf border-transparent duration-500 shadow-gf border-b-1">
          <nav
            className={clsx(
              "text-white flex items-center justify-between w-full h-full text-sm transition-colors duration-200",
              {
                "text-white": !isScrolled,
              }
            )}
          >
            <div className="flex items-center gap-3">
              <NavListSimpleMobile />
              <div className="mt-2 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300">
                <Link href="/">
                  <Image
                    alt="gudfy"
                    src="/header/gudfy_logo.png"
                    width={110}
                    height={38}
                  />
                </Link>

                {/* <div className="flex sm:hidden">
            <ProductSearch />
          </div> */}
              </div>
            </div>

            <div className="ml-[-20px] flex items-center ">
              {/* <CountrySelect
              // className="w-24"
              /> */}

              <div className="ml-[-10px]">
                {!customer ? (
                  <DropdownGudFy
                    name={propsDropDown.name}
                    items={propsDropDown.items}
                  />
                ) : (
                  <DropdownGudFyLog name={customer?.first_name} />
                )}
              </div>
            </div>
            <CartDropdown />
          </nav>
          <MobileMenu />
        </header>
      </div>
    </>
  )
}

export default Nav
