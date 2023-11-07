import { StoreGetProductsParams } from "@medusajs/medusa"
import ButtonLigth from "@modules/common/components/button_light"
import { useCollections } from "medusa-react"
import { FormEvent } from "react"
import { useState } from "react"
import clsx from "clsx"

type RefinementListProps = {
  refinementList: StoreGetProductsParams
  setRefinementList: (refinementList: StoreGetProductsParams) => void
}

const ButonSelector = ({
  refinementList,
  setRefinementList,
}: RefinementListProps) => {
  const [isSelect, setIsSelect] = useState<string>("")
  const { collections, isLoading } = useCollections()
  const handleAllCollection = () => {
    const coolesctionsID = collections?.map((c) => c.id)
    setIsSelect("")
    setRefinementList({
      ...refinementList,
      collection_id: coolesctionsID,
    })
  }

  const handleCollectionChange = (
    e: FormEvent<HTMLButtonElement>,
    id: string
  ) => {
    const collectionIds = refinementList.collection_id || []
    const exists = collectionIds.includes(id)
    setIsSelect(id)
    setRefinementList({
      ...refinementList,
      collection_id: [id],
    })
    return
  }

  return (
    <div>
      <div className="px-8 pb-10 pt-5 mt-[-50px]">
        <div className="flex gap-x-4">
          {collections?.length ? (
            // <button
            //   type="button"
            //   onClick={handleAllCollection}
            //   className={clsx(
            //     "border-solid  border-[1px] w-[100px] h-[48px] text-[14px] font-semibold rounded-[5px] py-2 px-2",
            //     { "border-[#707070] text-[#707070]": isSelect !== "" },
            //     { "border-blue-gf text-blue-gf": isSelect == "" }
            //   )}
            // >
            //   Todos
            // </button>
            <ButtonLigth
              type="button"
              onClick={handleAllCollection}
              className={clsx(
                "border-solid  border-[1px] w-[100px] h-[48px] text-[14px] font-semibold rounded-[5px] py-2 px-2",
                { "border-[#707070] text-[#707070]": isSelect !== "" },
                { "border-blue-gf text-blue-gf": isSelect == "" }
              )}
            >
              Todos
            </ButtonLigth>
          ) : (
            ""
          )}
          {collections?.map((c) => (
            <div key={c.id} className="flex items-center gap-x-2">
              <button
                type="button"
                onClick={(e) => handleCollectionChange(e, c.id)}
                className={clsx(
                  "border-solid  border-[1px] w-[100px] h-[48px] text-[14px] font-semibold rounded-[5px] py-2 px-2",
                  { "border-[#707070] text-[#707070]": isSelect !== c.id },
                  { "border-blue-gf text-blue-gf": isSelect == c.id }
                )}
              >
                {c.title}{" "}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ButonSelector
