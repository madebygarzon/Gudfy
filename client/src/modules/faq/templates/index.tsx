"use client"
import Button from "@modules/common/components/button"
import { usePathname } from "next/navigation"
import React, { useState } from "react"
import { FaSearch } from "react-icons/fa"

const FaqLayout: React.FC = ({ children }) => {
  const [page, setpage] = useState()
  const phat = usePathname()

  return (
    <div>
      <div className="w-full h-[50vh] bg-slate-600 flex flex-col items-center justify-center">
        <h1 className="text-2xl text-white my-10">
          {" "}
          ¿Como pódemos ayudarte ?{" "}
        </h1>
        <div className="flex">
          <Button
            variant="selected"
            href="/faq/marketplace"
            route={phat}
            className="rounded-none"
          >
            Soy Comprador
          </Button>
          <Button
            variant="selected"
            href="/faq/seller"
            route={phat}
            className="rounded-none"
          >
            Soy Vendedor
          </Button>
        </div>
        <div className="flex bg-white w-[60%] h-[40px] p-2 my-10  rounded-lg border border-blue-gf">
          <div>
            <FaSearch color={"#475569"} size={20} />
          </div>
          <input
            className=" bg-white w-full active::border-none "
            alt="buscar"
          />
        </div>
      </div>
      <div className="w-full py-10 px-20">{children}</div>
    </div>
  )
}

export default FaqLayout
