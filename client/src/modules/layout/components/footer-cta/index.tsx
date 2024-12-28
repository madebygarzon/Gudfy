"use client"
import { useCollections } from "medusa-react"
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa"
import BotonWhatsApp from "@modules/common/components/whatsapp"
import Link from "next/link"
import Image from "next/image"
import CurrentYear from "@lib/util/current-year"
import { useTranslation } from "react-i18next"

const FooterCTA = () => {
  const { collections } = useCollections()
  const { t } = useTranslation()
  return (
    <div className="bg-blue-gf text-white content-container flex flex-col gap-y-8 pt-[50px] pb-8">
      <div className="sm:mx-48">
        <div className="block mx-8">
          <div>
            <Link href="/">
              <Image
                className="ml-auto mr-auto transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300"
                alt="gudfy"
                src="/footer/gudfy_logo_2.svg"
                width={251.76}
                height={81.63}
              />
            </Link>
          </div>
          <div className="text-[#C7C7C7] font-[300] text-sm/[14px] grid grid-cols-1 gap-y-4">
            <p className="ml-auto mr-auto mt-10 ">
              Copyright © <CurrentYear /> | Powered by Gudfy
            </p>
            <div className="ml-auto mr-auto flex items-center justify-between w-28 mb-10">
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

        <div className="hidden sm:grid grid-cols-4 gap-x-10">
          <div className="flex flex-col gap-y-7">
            <span className="text-[#FFFFFF] font-[500] text-[14px]">
              Sobre Gudfy P2P
            </span>
            <ul className="text-[#C7C7C7] font-[300] text-sm/[14px] grid grid-cols-1 gap-y-4">
              <li>
                <a
                  href="https://gudfy.com/sobre-nosotros/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Sobre nosotros
                </a>
              </li>
              <li>
                <a
                  href="https://gudfy.com/contacto/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Contáctanos
                </a>
              </li>
              <li>
                <a
                  href="https://gudfy.com/contacto/"
                  target="_blank"
                  rel="noreferrer"
                >
                  FQA
                </a>
              </li>
            </ul>
          </div>
          <div className="flex flex-col gap-y-7">
            <span className="text-[#FFFFFF] font-[500] text-[14px]">
              Para compradores
            </span>
            <ul className="text-[#C7C7C7] font-[300] text-sm/[14px] grid grid-cols-1 gap-y-4">
              <li>
                <a
                  href="https://gudfy.com/preguntas-frecuentes/"
                  target="_blank"
                  rel="noreferrer"
                >
                  ¿Cómo comprar?
                </a>
              </li>
              <li>
                <a href="" target="_blank" rel="noreferrer">
                  Ayuda al comprar
                </a>
              </li>
              <li>
                <a href="" target="_blank" rel="noreferrer">
                  Tienda
                </a>
              </li>
            </ul>
          </div>
          <div className="flex flex-col gap-y-7">
            <span className="text-[#FFFFFF] font-[500] text-[14px]">
              Para vendedores
            </span>
            <ul className="text-[#C7C7C7] font-[300] text-sm/[14px] grid grid-cols-1 gap-y-4">
              <li>
                <a
                  href="https://gudfy.com/blog/"
                  target="_blank"
                  rel="noreferrer"
                >
                  ¿Cómo vender?
                </a>
              </li>
              <li>
                <a
                  href="https://gudfy.com/crear-un-ticket/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Ayúda al vender
                </a>
              </li>
            </ul>
          </div>
          <div className="flex flex-col gap-y-7">
            <span className="text-[#FFFFFF] font-[500] text-[14px]">
              Comunidad
            </span>
            <ul className="text-[#C7C7C7] font-[300] text-sm/[14px] grid grid-cols-1 gap-y-4">
              <li>
                <a
                  href="https://gudfy.com/blog/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="https://gudfy.com/crear-un-ticket/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Sorteos
                </a>
              </li>
              <li>
                <a
                  href="https://gudfy.com/crear-un-ticket/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Crea un ticket
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="block sm:hidden mx-2">
          <div className="flex w-full">
            <div className="flex flex-col gap-y-7 w-1/2">
              <span className="text-[#FFFFFF] font-[500] text-[14px]">
                Sobre Gudfy P2P
              </span>
              <ul className="text-[#C7C7C7] font-[300] text-sm/[14px] grid grid-cols-1 gap-y-4">
                <li>
                  <a
                    href="https://gudfy.com/sobre-nosotros/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Sobre nosotros
                  </a>
                </li>
                <li>
                  <a
                    href="https://gudfy.com/contacto/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Contáctanos
                  </a>
                </li>
                <li>
                  <a
                    href="https://gudfy.com/contacto/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    FQA
                  </a>
                </li>
              </ul>
            </div>

            <div className="flex flex-col gap-y-7">
              <span className="text-[#FFFFFF] font-[500] text-[14px]">
                Para compradores
              </span>
              <ul className="text-[#C7C7C7] font-[300] text-sm/[14px] grid grid-cols-1 gap-y-4">
                <li>
                  <a
                    href="https://gudfy.com/preguntas-frecuentes/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    ¿Cómo comprar?
                  </a>
                </li>
                <li>
                  <a href="" target="_blank" rel="noreferrer">
                    Ayuda al comprar
                  </a>
                </li>
                <li>
                  <a href="" target="_blank" rel="noreferrer">
                    Tienda
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex w-full mt-20 mb-10">
            <div className="flex flex-col gap-y-7 w-1/2">
              <span className="text-[#FFFFFF] font-[500] text-[14px]">
                Para vendedores
              </span>
              <ul className="text-[#C7C7C7] font-[300] text-sm/[14px] grid grid-cols-1 gap-y-4">
                <li>
                  <a
                    href="https://gudfy.com/blog/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    ¿Cómo vender?
                  </a>
                </li>
                <li>
                  <a
                    href="https://gudfy.com/crear-un-ticket/"
                    target="_blank"
                    rel="noreferrer"
                  >
                   Ayuda al vender
                  </a>
                </li>
              </ul>
            </div>

            <div className="flex flex-col gap-y-7">
              <span className="text-[#FFFFFF] font-[500] text-[14px]">
                Comunidad
              </span>
              <ul className="text-[#C7C7C7] font-[300] text-sm/[14px] grid grid-cols-1 gap-y-4">
                <li>
                  <a
                    href="https://gudfy.com/blog/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="https://gudfy.com/crear-un-ticket/"
                    target="_blank"
                    rel="noreferrer"
                  >
                   Sorteos
                  </a>
                </li>
                <li>
                  <a
                    href="https://gudfy.com/crear-un-ticket/"
                    target="_blank"
                    rel="noreferrer"
                  >
                   Crea un ticket
                  </a>
                </li>
              </ul>
              {/* <div className="flex justify-between w-28">
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
              </div> */}
            </div>
          </div>
        </div>

        <BotonWhatsApp />
      </div>
    </div>
  )
}

export default FooterCTA
