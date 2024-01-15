import Button from "@modules/common/components/button"
import Image from "next/image"

const Banner = () => {
  return (
    <div className=" flex relative h-[400px] w-full items-center 2xl:my-12  ">
      <div className="text-white  w-full flex flex-col ml-[8%] ">
        <h1 className="text-[60px] w-[542px] drop-shadow-md shadow-black leading-[65px] font-[900] ">
          Explora, Conecta y Crea en Gudfy:
        </h1>
        <p className="text-[40px] text-[#9B48ED] w-auto drop-shadow-md shadow-black my-2 font-black">
          Tu Marketplace de productos digitales.
        </p>
        <div className="flex items-center gap-4">
          <Button className="w-[181.5px] bg-[#9B48ED] rounded-[5px] tracking-tight text-[18px] font-bold px-2 ">
            ¡COMPRA YA!
          </Button>
          <p className="text-[16px] text-white font-bold">
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
  )
}

export default Banner
