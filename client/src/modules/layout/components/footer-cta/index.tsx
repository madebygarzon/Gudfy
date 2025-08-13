"use client"
import { useCollections } from "medusa-react"
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa"
import BotonWhatsApp from "@modules/common/components/whatsapp"
import Link from "next/link"
import Image from "next/image"
import CurrentYear from "@lib/util/current-year"
import { useTranslation } from "react-i18next"
import BotonSellIvitation from "@modules/common/components/cta-sellers/page"

const FooterCTA = () => {
  const { collections } = useCollections()
  const { t } = useTranslation()
  return (
    <div className="bg-blue-gf text-white content-container flex flex-col gap-y-8 pt-8 sm:pt-[50px] pb-8">
      <div className="mx-4 sm:mx-48">
        <div className="block mx-4 sm:mx-8">
          <div>
            <Link href="/">
              <Image
                className="ml-auto mr-auto transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300"
                alt="gudfy"
                src="/footer/gudfy_logo.png"
                width={280}
                height={72}
                sizes="(max-width: 640px) 280px, 350px"
              />
            </Link>
          </div>
          <div className="text-[#C7C7C7] font-[300] text-sm/[14px] grid grid-cols-1 gap-y-4">
            <p className="ml-auto mr-auto ">
              Copyright © <CurrentYear /> | Powered by Gudfy
            </p>
            <div className="ml-auto mr-auto flex items-center justify-center gap-4 sm:justify-between sm:w-28 mb-6 sm:mb-10">
              <Link
                href="https://www.facebook.com/profile.php?id=100087656820749"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  className="ml-auto mr-auto transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300"
                  alt="gudfy"
                  src="/social/icon_facebook.svg"
                  width={30}
                  height={30}
                />
              </Link>

              <Link
                href="https://instagram.com/gudfycom?igshid=YmMyMTA2M2Y="
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  className="ml-auto mr-auto transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300"
                  alt="gudfy"
                  src="/social/icon_instagram.svg"
                  width={30}
                  height={30}
                />
              </Link>

              <Link
                href="https://www.youtube.com/@Gudfydotcom/featured?sub_confirmation=1"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  className="ml-auto mr-auto transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300"
                  alt="gudfy"
                  src="/social/icon_youtube.svg"
                  width={30}
                  height={30}
                />
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile navigation - accordion style */}
        <div className="sm:hidden space-y-6 mb-8">
          <div className="flex flex-col gap-y-4">
            <span className="text-[#FFFFFF] font-[500] text-[16px] border-b border-gray-400 pb-2">
              Sobre Gudfy P2P
            </span>
            <ul className="text-[#C7C7C7] font-[300] text-sm/[16px] grid grid-cols-1 gap-y-3 pl-2">
              <li>
                <Link href="/about">Sobre nosotros</Link>
              </li>
              <li>
                <Link href="/contact">Contáctanos</Link>
              </li>
              <li>
                <Link href="/faq/marketplace">FAQ</Link>
              </li>
            </ul>
          </div>
          
          <div className="flex flex-col gap-y-4">
            <span className="text-[#FFFFFF] font-[500] text-[16px] border-b border-gray-400 pb-2">
              Para compradores
            </span>
            <ul className="text-[#C7C7C7] font-[300] text-sm/[16px] grid grid-cols-1 gap-y-3 pl-2">
              <li>
                <Link href="/faq/marketplace/como-comprar/">
                  ¿Cómo comprar?
                </Link>
              </li>
              <li>
                <Link href="/faq/marketplace/">
                  Ayuda al comprar
                </Link>
              </li>
              <li>
                <Link href="/store">
                  Tienda
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="flex flex-col gap-y-4">
            <span className="text-[#FFFFFF] font-[500] text-[16px] border-b border-gray-400 pb-2">
              Para vendedores
            </span>
            <ul className="text-[#C7C7C7] font-[300] text-sm/[16px] grid grid-cols-1 gap-y-3 pl-2">
              <li>
                <Link href="/faq/seller/guide-to-selling-digital-products/">
                  ¿Cómo vender?
                </Link>
              </li>
              <li>
                <Link href="/faq/seller/">
                  Ayuda al vender
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="flex flex-col gap-y-4">
            <span className="text-[#FFFFFF] font-[500] text-[16px] border-b border-gray-400 pb-2">
              Comunidad
            </span>
            <ul className="text-[#C7C7C7] font-[300] text-sm/[16px] grid grid-cols-1 gap-y-3 pl-2">
              <li>
                <Link href="/blog/">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/account/tickets">Crea un ticket</Link>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Desktop navigation - original grid */}
        <div className="hidden sm:grid grid-cols-4 gap-x-10">
          <div className="flex flex-col gap-y-7">
            <span className="text-[#FFFFFF] font-[500] text-[14px]">
              Sobre Gudfy P2P
            </span>
            <ul className="text-[#C7C7C7] font-[300] text-sm/[14px] grid grid-cols-1 gap-y-4">
              <li>
                <Link href="/about">Sobre nosotros</Link>
              </li>
              <li>
                <Link href="/contact">Contáctanos</Link>
              </li>
              <li>
                <Link href="/faq/marketplace">FAQ</Link>
              </li>
            </ul>
          </div>
          <div className="flex flex-col gap-y-7">
            <span className="text-[#FFFFFF] font-[500] text-[14px]">
              Para compradores
            </span>
            <ul className="text-[#C7C7C7] font-[300] text-sm/[14px] grid grid-cols-1 gap-y-4">
              <li>
                <Link
                  href="/faq/marketplace/como-comprar/"
                  target="_blank"
                  rel="noreferrer"
                >
                  ¿Cómo comprar?
                </Link>
              </li>
              <li>
                <Link href="/faq/marketplace" target="_blank" rel="noreferrer">
                  Ayuda al comprar
                </Link>
              </li>
              <li>
                <Link href="/store" target="_blank" rel="noreferrer">
                  Tienda
                </Link>
              </li>
            </ul>
          </div>
          <div className="flex flex-col gap-y-7">
            <span className="text-[#FFFFFF] font-[500] text-[14px]">
              Para vendedores
            </span>
            <ul className="text-[#C7C7C7] font-[300] text-sm/[14px] grid grid-cols-1 gap-y-4">
              <li>
                <Link
                  href="/faq/seller/guia-vender-digitales/"
                  target="_blank"
                  rel="noreferrer"
                >
                  ¿Cómo vender?
                </Link>
              </li>
              <li>
                <Link
                  href="/faq/seller/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Ayúda al vender
                </Link>
              </li>
            </ul>
          </div>
          <div className="flex flex-col gap-y-7">
            <span className="text-[#FFFFFF] font-[500] text-[14px]">
              Comunidad
            </span>
            <ul className="text-[#C7C7C7] font-[300] text-sm/[14px] grid grid-cols-1 gap-y-4">
              {/* <li>
                <a
                  href="https://gudfy.com/blog/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Blog
                </a>
              </li> */}
              {/* <li>
                <Link
                  href="/faq/seller/crear-un-ticket/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Sorteos
                </Link>
              </li> */}
              <li>
                <Link href="/account/tickets">Crea un ticket</Link>
              </li>
            </ul>
          </div>
        </div>

        <BotonSellIvitation />
        {/* <BotonWhatsApp /> */}
      </div>
    </div>
  )
}

export default FooterCTA
