import React from "react"
import Image from "next/image"

const Wallet: React.FC = () => {
  return (
    <div className="flex items-center gap-x-1  ">
      <Image
        alt="wallet_gudfy"
        src="/header/wallet-icon.svg"
        width={32}
        height={32}
      />
      <span>$0.00</span>
    </div>
  )
}

export default Wallet
