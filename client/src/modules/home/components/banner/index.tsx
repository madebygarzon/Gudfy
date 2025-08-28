"use client"
import Button from "@modules/common/components/button"
import Image from "next/image"
import { useTranslation } from "react-i18next"
import Link from "next/link"

const Banner = () => {
  const { t } = useTranslation("common")

  return (
    <>
      <div className="hidden sm:flex relative h-[400px] w-full items-center 2xl:my-12  ">
        <div className="text-white  w-full flex flex-col ml-[8%] ">
          <h1 className="text-2xl sm:text-[60px] sm:w-[700px] drop-shadow-md shadow-black leading-[65px] font-[900] ">
            {/* {t("firts_banner_text")}: */}
            Explora, Conecta y Crea en Gudfy:
          </h1>
          <p className="text-[40px] text-[#9B48ED] w-auto drop-shadow-md shadow-black my-2 font-black">
            {/* {t("second_banner_text")}. */}
            Tu Marketplace de productos digitales.
          </p>
          <div className="flex items-center gap-4">
            <Link href={"/tienda"}>
              <Button
                href="/"
                className="w-[181.5px] bg-[#9B48ED] rounded-[5px] tracking-tight text-[18px] font-bold px-2 "
              >
                {/* ¡{t("text_button_banner")}! */}
                ¡COMPRA YA!
              </Button>
            </Link>
            <p className="text-[16px] text-white font-bold">
              {/* {t("text_buy_banner")}. */}
              Paga con Criptomonedas.
            </p>
            <div className="flex justify-start gap-2">
              <Image
                src="/image_coins/ethereum_icon.svg"
                alt="You can pay with litecoin"
                width={30}
                height={30}
                className="transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300 cursor-pointer"
              />
              <Image
                src="/image_coins/bitcoin_icon.svg"
                alt="You can pay with ethereum"
                width={30}
                height={30}
                className="transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300 cursor-pointer"
              />
              <Image
                src="/image_coins/litecoin_icon.svg"
                alt="You can pay with bitcoin"
                width={30}
                height={30}
                className="transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300 cursor-pointer"
              />
              <Image
                src="/image_coins/binance_icon.svg"
                alt="You can pay with tether"
                width={30}
                height={30}
                className="transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300 cursor-pointer"
              />
              <Image
                src="/image_coins/tether_icon.svg"
                alt="You can pay with tether"
                width={30}
                height={30}
                className="transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300 cursor-pointer"
              />
            </div>
          </div>
        </div>

        <div className="absolute z-[-1] px-10">
          <Image
            src="/home/baner_fondo.svg"
            loading="eager"
            priority={true}
            alt="fondo_banner_gudfy_home"
            width={2825}
            height={642}
          />
          <Image
            className="absolute top-[-9%] right-[24%]"
            src="/home/bookgamer.webp"
            alt="gudfy"
            width={180}
            height={200}
          />
          <Image
            className="absolute top-[-18px] right-[1%]"
            src="/home/excell.svg"
            alt="gudfy"
            width={120}
            height={165}
          />
          <Image
            className="absolute bottom-[-24%] right-[7%]"
            src="/home/Jostick.svg"
            alt="gudfy"
            width={193}
            height={172}
          />
        </div>
      </div>
      <div className="px-2 bg-gradient-to-br from-[#1F0046] to-[#2F3B72] flex sm:hidden flex-col sm:flex-row relative h-[500px] sm:h-auto w-full justify-center items-center sm:items-start 2xl:my-12">
        <div className="text-white w-full flex flex-col items-center sm:items-start sm:ml-[8%]">
          <h1 className="text-5xl drop-shadow-md shadow-black   font-[900] text-center sm:text-left">
            {/* {t("firts_banner_text")}: */}
            Explora, Conecta y Crea en Gudfy:
          </h1>
          <p className="text-2xl  text-[#9B48ED] w-auto drop-shadow-md shadow-black my-2 font-black text-center sm:text-left">
            {/* {t("second_banner_text")}. */}
            Tu Marketplace de productos digitales.
          </p>
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <Link href={"/store"}>
              <Button
                href="/"
                className=" my-4 bg-[#9B48ED] rounded-[5px] tracking-tight text-[16px] font-bold px-4"
              >
                {/* ¡{t("text_button_banner")}! */}
                ¡COMPRA YA!
              </Button>
            </Link>
            <p className="text-1xl  text-white font-bold text-center sm:text-left">
              {/* {t("text_buy_banner")}. */}
              Paga con Criptomonedas.
            </p>
            <div className="flex justify-center sm:justify-start gap-2">
              <Image
                src="/image_coins/ethereum_icon.svg"
                alt="You can pay with litecoin"
                width={50}
                height={50}
                className="transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300 cursor-pointer"
              />
              <Image
                src="/image_coins/bitcoin_icon.svg"
                alt="You can pay with ethereum"
                width={50}
                height={50}
                className="transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300 cursor-pointer"
              />
              <Image
                src="/image_coins/litecoin_icon.svg"
                alt="You can pay with bitcoin"
                width={50}
                height={50}
                className="transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300 cursor-pointer"
              />
              <Image
                src="/image_coins/binance_icon.svg"
                alt="You can pay with tether"
                width={50}
                height={50}
                className="transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300 cursor-pointer"
              />
              <Image
                src="/image_coins/tether_icon.svg"
                alt="You can pay with tether"
                width={50}
                height={50}
                className="transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300 cursor-pointer"
              />
            </div>
          </div>
        </div>

        <div className="sm:absolute hidden z-[-1] px-6 sm:px-10 mt-4 sm:mt-0">
          <Image
            src="/home/baner_fondo.svg"
            loading="eager"
            priority={true}
            alt="fondo_banner_gudfy_home"
            width={2825}
            height={642}
          />
          <Image
            className="absolute top-[-9%] sm:top-[-9%] right-[10%] sm:right-[24%]"
            src="/home/bookgamer.webp"
            alt="gudfy"
            width={120}
            height={130}
          />
          <Image
            className="absolute top-[0] right-[5%] sm:top-[-18px] sm:right-[1%]"
            src="/home/excell.svg"
            alt="gudfy"
            width={100}
            height={125}
          />
          <Image
            className="absolute bottom-[-14%] sm:bottom-[-24%] right-[7%]"
            src="/home/Jostick.svg"
            alt="gudfy"
            width={150}
            height={130}
          />
        </div>
      </div>
    </>
  )
}

export default Banner
