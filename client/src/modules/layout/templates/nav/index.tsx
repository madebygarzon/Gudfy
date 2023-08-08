"use client"

import { useMobileMenu } from "@lib/context/mobile-menu-context"
import Hamburger from "@modules/common/components/hamburger"
import CartDropdown from "@modules/layout/components/cart-dropdown"
import DropdownMenu from "@modules/layout/components/dropdown-menu"
import MobileMenu from "@modules/mobile-menu/templates"
import DesktopSearchModal from "@modules/search/templates/desktop-search-modal"
import clsx from "clsx"
import Link  from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import CountrySelect from "../../components/country-select"

const Nav = () => {
  const pathname = usePathname()
  const [isHome, setIsHome] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  //useEffect that detects if window is scrolled > 5px on the Y axis
  useEffect(() => {
    if (isHome) {
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
    }
  }, [isHome])

  useEffect(() => {
    pathname === "/" ? setIsHome(true) : setIsHome(false)
  }, [pathname])

  const { toggle } = useMobileMenu()

  return (
    <div
      className={clsx("sticky top-0 inset-x-0 z-50 group", {
        "!fixed": isHome,
      })}
    >
      <header
        className={clsx(
          "relative h-20 px-8 mx-auto my-0 transition-colors bg-transparent border-transparent duration-500 hover:bg-blue-gf shadow-gf border-b-1",
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
          <div className="flex-1 basis-0 h-full flex items-center">
            <Link href="/">
            <Image src="/g71.webp" width={150} height={50} alt="GUDFY" />
            </Link>

            <div className="flex ml-7 items-start h-full">
          <DesktopSearchModal />

          </div>

          </div>

          <div className="flex items-center gap-x-6 h-full flex-1 basis-0 justify-end">
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
              
              <Link href="/account">Account</Link>
            </div>
            <CartDropdown />
          </div>
        </nav>
        <MobileMenu />
        
      </header>
      {!isScrolled 
      ?<nav className="text-white flex py-2 relative  justify-center gap-x-6 text-base hover:bg-blue-gf duration-500">
          <Link href="/">  Home </Link>
          <Link href="/">  Blog </Link>
          <Link href="/">  Shop </Link>
        </nav> : ""}
    </div>
  )
}

export default Nav
