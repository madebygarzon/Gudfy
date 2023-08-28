import React from "react"
import Image from "next/image";

const Wallet: React.FC = () =>{
  return <div className="flex items-center gap-x-1 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300">
    <Image alt="wallet_gudfy" src="/header/wallet-icon.svg" width={32} height={32}/>
    <span>$0.00</span>
  </div>
}

export default Wallet;