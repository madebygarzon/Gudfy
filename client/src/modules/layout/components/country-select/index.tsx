"use client"
import { Listbox, Transition } from "@headlessui/react"
import { useStore } from "@lib/context/store-context"
import useToggleState from "@lib/hooks/use-toggle-state"
import { useRegions } from "medusa-react"
import { Fragment, useEffect, useMemo, useState } from "react"
import ReactCountryFlag from "react-country-flag"
import i18n from "../../../../lib/i18n"

type CountryOption = {
  country: string
  region: string
  label: string
}

const CountrySelect = () => {
  const { countryCode, setRegion } = useStore()
  const { regions } = useRegions()
  const [current, setCurrent] = useState<CountryOption | undefined>(undefined)
  const { state, open, close } = useToggleState()
  const [selectedLanguage, setSelectedLanguage] = useState<string>("en")

  const options: CountryOption[] | undefined = useMemo(() => {
    return regions
      ?.map((r) => {
        return r.countries.map((c) => ({
          country: c.iso_2,
          region: r.id,
          label: c.display_name,
        }))
      })
      .flat()
      .filter((c) => c.country === "us" || c.country === "es")
  }, [regions])

  useEffect(() => {
    if (countryCode) {
      const option = options?.find((o) => o.country === countryCode)
      if (!option) {
        setCurrent(options?.find((o) => o.country === "es"))
        setSelectedLanguage("es")
      } else {
        setCurrent(option)
        setSelectedLanguage("en")
      }
    }
  }, [countryCode, options])

  const handleChange = (option: CountryOption) => {
    setRegion(option.region, option.country)
    close()
    setSelectedLanguage(option.country === "es" ? "es" : "en")
  }
  useEffect(() => {
    document.documentElement.lang = selectedLanguage
  }, [selectedLanguage])

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng) // Cambia el idioma con i18next
  }

  return (
    <div onMouseEnter={open} onMouseLeave={close}>
      <Listbox
        onChange={handleChange}
        defaultValue={
          countryCode
            ? options?.find((o) => o.country === countryCode)
            : undefined
        }
      >
        <Listbox.Button className="py-1 w-auto">
          <div className="text-small-regular flex items-center gap-x-2 ">
            <span> </span>
            {current && (
              <span className=" text-[#FFFFFF] font-[400] text-[14px]  flex items-center gap-x-2">
                <ReactCountryFlag
                  svg
                  className="rounded-[50%] object-cover"
                  style={{
                    width: "30px",
                    height: "30px",
                  }}
                  countryCode={current.country}
                />
                {current.label == "Spain" ? <p>Español</p> : <p>English</p>}
                <div className=" flex pl-2 w-auto h-[30px] border-l-[1px] border-l-white items-center">
                  {current.label == "Spain" ? <p>COP</p> : <p>USD</p>}
                </div>
              </span>
            )}
          </div>
        </Listbox.Button>
        <div className="relative w-auto">
          <Transition
            show={state}
            as={Fragment}
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="absolute">
              <Listbox.Options
                className="relative top-[25px] bg-blue-gf text-[14px] text-[#FFFFFF] "
                static
              >
                {options?.map((o, index) => {
                  return (
                    <Listbox.Option
                      key={index}
                      value={o}
                      className="py-2 px-7 hover:bg-white hover:text-blue-gf text-center cursor-pointer flex items-center gap-x-2"
                    >
                      <ReactCountryFlag
                        svg
                        style={{
                          width: "16px",
                          height: "16px",
                        }}
                        countryCode={o.country}
                      />{" "}
                      {o.label == "Spain" ? (
                        <p onClick={() => changeLanguage("es")}>Español</p>
                      ) : (
                        <p onClick={() => changeLanguage("en")}>English</p>
                      )}
                    </Listbox.Option>
                  )
                })}
              </Listbox.Options>
            </div>
          </Transition>
        </div>
      </Listbox>
    </div>
  )
}

export default CountrySelect
