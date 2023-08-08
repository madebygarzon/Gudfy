"use client"
import { useCollections } from "medusa-react"
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa"

const FooterCTA = () => {
  const { collections } = useCollections()
  return (
    <div className="bg-blue-gf text-white content-container flex flex-col gap-y-8 pt-[50px] pb-8">
      <div className="footer-menu">
        <div className="grid grid-cols-4 gap-x-10">
          <div className="flex flex-col gap-y-7">
            <span className="text-[#FFFFFF] font-[500] text-[14px]">
              Sobre Gudfy
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
            </ul>
          </div>

          <div className="flex flex-col gap-y-7">
            <span className="text-[#FFFFFF] font-[500] text-[14px]">Ayuda</span>
            <ul className="text-[#C7C7C7] font-[300] text-sm/[14px] grid grid-cols-1 gap-y-4">
              <li>
                <a
                  href="https://gudfy.com/preguntas-frecuentes/"
                  target="_blank"
                  rel="noreferrer"
                >
                  FAQ
                </a>
              </li>
              <li>
                <a href="" target="_blank" rel="noreferrer">
                  ¿Cómo comprar?
                </a>
              </li>
              <li>
                <a href="" target="_blank" rel="noreferrer">
                  Aprende a usar nuestra Wallet
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
                  Crear un ticket
                </a>
              </li>
              <li>
                <a
                  href="https://gudfy.com/sorteos/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Sorteos
                </a>
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-y-7">
            <span className="text-[#FFFFFF] font-[500] text-[14px]">
              Seguirnos
            </span>
            <div className="flex justify-between w-28">
              <a
                className="transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300"
                href="https://www.facebook.com/profile.php?id=100087656820749"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaFacebook color="white" size={22} />
              </a>
              <a
                className="transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300"
                href="https://instagram.com/gudfycom?igshid=YmMyMTA2M2Y="
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaInstagram color="white" size={22} />
              </a>
              <a
                className="transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300"
                href="https://www.youtube.com/@Gudfydotcom/featured?sub_confirmation=1"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaYoutube color="white" size={22} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FooterCTA
