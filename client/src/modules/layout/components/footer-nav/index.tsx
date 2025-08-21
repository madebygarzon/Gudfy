"use client"
import Image from "next/image"

const FooterNav: React.FC = () => {
  return (
    <div className="bg-blue-gf">
      <div className="flex justify-center items-center mx-auto p-4 px-6 sm:px-4">
        <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4 max-w-xs sm:max-w-none">
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
  )
}

export default FooterNav
