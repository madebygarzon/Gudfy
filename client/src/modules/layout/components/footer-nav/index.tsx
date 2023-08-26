"use client"
import Image from "next/image"

const FooterNav: React.FC = () => {
  return (
    <div className=" bg-blue-gf ">
      <div className="space-x-4 flex justify-center mx-auto p-4">
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
  )
}

export default FooterNav
