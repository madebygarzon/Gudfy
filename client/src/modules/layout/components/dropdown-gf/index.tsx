'use client'
import React, { useState } from "react"
import Link from "next/link"

type DropdownProps = {
  name: string, 
  items: {label: string; href: string; }[]
}

const DropdownGudFy: React.FC<DropdownProps> = ({name, items}) =>{
  
  const [isOpen, setIsOpen] = useState(false)
  return (
    <div>
    <div onMouseEnter={() => setIsOpen(!isOpen)}
        onMouseLeave={() => setIsOpen(!isOpen)}>
      <div
        className="flex text-[#FFFFFF] font-[500] text-[14px]"
        >
        {name}
        <svg
          className="-mr-1 h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M6.293 6.293a1 1 0 011.414 0L10 8.586l2.293-2.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      {isOpen && (
        <div className="absolute  shadow-lg gap-x-4 gap-y-2 bg-blue-gf">
          {items?.map((item,index)=>{
            return (
            <Link
            key={index}
            href={item.href}
            className="block px-7 py-2  text-[#FFFFFF] font-[400] text-[14px] hover:bg-gray-100 hover:text-gray-900"
            >
            {item.label}
          </Link>
          )})}
            
        </div>
      )}
    </div>
  </div>)
}

export default DropdownGudFy;