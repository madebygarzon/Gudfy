import React, { useState, useEffect, SetStateAction } from "react"
import Image from "next/image"
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@nextui-org/react"
import { getContries } from "@modules/account/actions/get-data-contryes"
import Loader from "@lib/loader"

interface CountryData {
  name: string
  flags: string
  callingCodes: string
}
interface PropsChildren {
  setCodeFlag: React.Dispatch<SetStateAction<number>>
  setSelectCountry: (e: string) => void
}

const NumberCountry: React.FC<PropsChildren> = ({
  setCodeFlag,
  setSelectCountry,
}) => {
  const [dataCuntries, setDataCountres] = useState<Array<CountryData>>()
  const [dataFlag, setDataFlag] = useState<CountryData>({
    name: "Colombia",
    flags: "https://flagcdn.com/co.svg",
    callingCodes: "57",
  })
  useEffect(() => {
    getContries().then((e) => setDataCountres(e))
  }, [])

  return (
    <>
      <Dropdown>
        <DropdownTrigger className="justify-start border rounded-[50px] py-[22px]  px-5">
          <Button variant="flat" className="flex bg-white gap-0">
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
            {dataFlag.name}
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          className="h-[450px] max-w-[300px] overflow-y-auto justify-start "
          aria-label="Action event example"
        >
          {dataCuntries ? (
            dataCuntries.map((coun, i) => (
              <DropdownItem
                key={i}
                onPress={(e) => {
                  setDataFlag(coun)
                  setCodeFlag(parseInt(coun.callingCodes))
                  setSelectCountry(coun.name)
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
          ) : (
            <><Loader /></>
          )}
        </DropdownMenu>
      </Dropdown>
    </>
  )
}

export default NumberCountry
