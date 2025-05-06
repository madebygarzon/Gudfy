import React, { useState, useEffect, SetStateAction } from "react"
import Image from "next/image"
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  Spinner,
} from "@heroui/react"

import { ArrayCountries } from "@lib/util/array-country-data"

interface CountryData {
  name: string
  flags: string
  callingCodes: string
}
interface PropsChildren {
  setCodeFlag: React.Dispatch<SetStateAction<number>>
}

const Country: React.FC<PropsChildren> = ({ setCodeFlag }) => {

  const [dataFlag, setDataFlag] = useState<CountryData>({
    name: "Colombia",
    flags: "https://flagcdn.com/co.svg",
    callingCodes: "57",
  })
 
  useEffect(() => {
    setDataFlag(ArrayCountries.filter((country) => country.callingCodes === "57")[0])
  }, [])

  return (
    <>
      <Dropdown>
        <DropdownTrigger>
          <Button variant="flat" className="flex bg-white px-0 gap-0">
            <Image src={dataFlag.flags} alt="" width={40} height={35} />
            <svg
              className=" h-5 w-5 text-blue-gf"
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
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          className="h-[250px] max-w-[300px] overflow-y-auto "
          aria-label="Action event example"
        >
          {
            ArrayCountries.map((coun, i) => (
              <DropdownItem
                key={i}
                onPress={(e) => {
                  setDataFlag(coun)
                  setCodeFlag(parseInt(coun.callingCodes))
                }}
                textValue={coun.name}
              >
                <div className="flex w-full ">
                  <Image
                    src={coun.flags}
                    alt=""
                    width={35}
                    height={30}
                    className="border-solid border"
                  />
                  <span className="">{`(+${coun.callingCodes}) ${coun.name}`}</span>
                </div>
              </DropdownItem>
            ))
          }
        </DropdownMenu>
      </Dropdown>
    </>
  )
}

export default Country
