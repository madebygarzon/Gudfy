import React, { useState, useEffect, SetStateAction, useRef } from "react"
import Image from "next/image"
import { getContries } from "@modules/account/actions/get-data-contryes"
import { ArrayCountries } from "@lib/util/array-country-data"


interface CountryData {
  name: string
  flags: string
  callingCodes: string
}

interface CustomSelectCountryProps {
  initialCode?: number | string
  setCodeFlag: React.Dispatch<SetStateAction<number>>
  setSelectCountry: (e: string) => void
}

const CustomSelectCountry: React.FC<CustomSelectCountryProps> = ({
  initialCode, 
  setCodeFlag,
  setSelectCountry,
}) => {

  const [selectedCountry, setSelectedCountry] = useState<CountryData>(ArrayCountries.filter((country) => country.callingCodes === initialCode?.toString())[0])
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const handleCountrySelect = (country: CountryData) => {
    setSelectedCountry(country)
    setCodeFlag(parseInt(country.callingCodes))
    setSelectCountry(country.name)
    setIsOpen(false)
  }

  useEffect(() => {
    setSelectedCountry(ArrayCountries.filter((country) => country.callingCodes === initialCode?.toString())[0])
  }, [initialCode])

  return (
    <div className="relative" ref={dropdownRef}>
     
      <button
        type="button"
        className="flex items-center gap-2 bg-white border rounded-[50px] py-[8px] px-5 w-full"
        onClick={() => setIsOpen(!isOpen)}
      > 
            <Image src={selectedCountry.flags} alt="" width={40} height={35} />
        <span className="flex-grow text-left">{selectedCountry.name}</span>
        <svg
          className="h-5 w-5 text-blue-gf"
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
      </button>

     
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-lg max-h-[450px] overflow-y-auto">
          
            <ul className="py-2">
              {ArrayCountries.map((country, index) => (
                <li
                  key={index}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleCountrySelect(country)}
                >
                  <div className="flex items-center gap-2">
                    <Image
                      src={country.flags}
                      alt=""
                      width={35}
                      height={30}
                      className="border-solid border"
                    />
                    <span>{`(+${country.callingCodes}) ${country.name}`}</span>
                  </div>
                </li>
              ))}
            </ul>
          
    
        </div>
      )}
    </div>
  )
}

export default CustomSelectCountry
