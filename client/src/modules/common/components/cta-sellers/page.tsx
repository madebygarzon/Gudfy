import Link from "next/link"
import Image from "next/image"

const BotonSellIvitation = () => {
  return (
    <div>
      <Link
        href="/account/seller"
        className="fixed right-8 bottom-8 rounded-full p-3 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300 "
      >
        <Image
          src="/footer/sell_whith_us.png"
          alt="sell with ussd"
          width={80}
          height={80}
        />
      </Link>
    </div>
  )
}
export default BotonSellIvitation
