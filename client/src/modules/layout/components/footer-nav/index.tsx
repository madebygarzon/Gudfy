"use client"
import Image from "next/image"

const FooterNav: React.FC = () => {
  return (
    <div className=" bg-blue-gf ">
      <div className="space-x-4 flex justify-center mx-auto p-4">
        <Image
          src="/image_coins/litecoin-coin.webp"
          alt="You can pay with litecoin"
          width={30}
          height={30}
          className="transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300"
        />
        <Image
          src="/image_coins/ethereum-coin.webp"
          alt="You can pay with ethereum"
          width={30}
          height={30}
          className="transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300"
        />
        <Image
          src="/image_coins/bitcoin-coin.webp"
          alt="You can pay with bitcoin"
          width={30}
          height={30}
          className="transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300"
        />
        <Image
          src="/image_coins/tether-coin.webp"
          alt="You can pay with tether"
          width={30}
          height={30}
          className="transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300"
        />
      </div>
      <div className="flex justify-center mt-6">
        <Image
          src="/image_coins/binance-logo.webp"
          alt="You can pay through the binance platform"
          width={150}
          height={150}
          className=" transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300"
        />
      </div>
    </div>
  )
}

export default FooterNav
