import Image from "next/image"
import Button from "@modules/common/components/button"

const BannerSecondary = () => {
  return (
    <div
      className="w-[90%] rounded bg-cover bg-center relative text-center pb-8 pt-16 ml-auto mr-auto"
      style={{
        backgroundImage: `url('home/background_banner_home.svg')`,
      }}
    >
      <div className="">
        <h1 className="text-5xl font-black text-white">¡NO TE ENREDES!</h1>
      </div>

      <div className="">
        <p className="text-purple-600 text-6xl not-italic font-extrabold">
          PAGA CON CRIPTOMONEDAS.
        </p>
      </div>

      <div className=" space-x-4 flex justify-center mx-auto p-4">
        <Image
          src="/image_coins/ethereum_icon.svg"
          alt="You can pay with litecoin"
          width={64}
          height={64}
          className="transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300 cursor-pointer"
        />
        <Image
          src="/image_coins/bitcoin_icon.svg"
          alt="You can pay with ethereum"
          width={64}
          height={64}
          className="transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300 cursor-pointer"
        />
        <Image
          src="/image_coins/litecoin_icon.svg"
          alt="You can pay with bitcoin"
          width={64}
          height={64}
          className="transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300 cursor-pointer"
        />
        <Image
          src="/image_coins/binance_icon.svg"
          alt="You can pay with tether"
          width={64}
          height={64}
          className="transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300 cursor-pointer"
        />
        <Image
          src="/image_coins/tether_icon.svg"
          alt="You can pay with tether"
          width={64}
          height={64}
          className="transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300 cursor-pointer"
        />
      </div>
    </div>
  )
}

export default BannerSecondary
