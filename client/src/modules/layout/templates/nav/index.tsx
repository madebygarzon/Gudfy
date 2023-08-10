"use client"
import { useAccount } from "@lib/context/account-context"
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
import DropdownGudFy from "@modules/layout/components/dropdown-gf"

const Nav = () => {
  const {customer} = useAccount();
  const pathname = usePathname()
  const [isHome, setIsHome] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const propsDropDown ={name:"Account", items: [{label:"Log In",  href:"/account/login"},{label:"Register",  href:"/account/login"}]}
  const propsDropDownLog ={name:"Name user", items: [{label:"dashboard",  href:"/account"},{label:"edit",  href:"/account"}]}
  

  //useEffect that detects if window is scrolled > 5px on the Y axis
  

  useEffect(() => {
    pathname === "/" ? setIsHome(true) : setIsHome(false)
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

  return (
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
              {/* {process.env.FEATURE_SEARCH_ENABLED && <DesktopSearchModal />} */ console.log(customer)}
              {!customer?
                 <DropdownGudFy name={propsDropDown.name} items={propsDropDown.items}/>:
                <DropdownGudFy name={propsDropDownLog.name} items={propsDropDownLog.items}/>
                }
              
            </div>
            <CartDropdown />
          </div>
        </nav>
        <MobileMenu />
      </header>
      {!isScrolled ? (
        <nav className={clsx("text-[#FFFFFF] font-[500] text-[14px] flex py-2 justify-center gap-x-6 hover:bg-blue-gf duration-500" ,
         {"!bg-blue-gf": !isHome})}>
          <Link href="/"> Home </Link>
          <Link href="/"> Blog </Link>
          <Link href="/"> Shop </Link>
        </nav>
      ) : (
        ""
      )}
    </div>
  )
}

export default Nav
