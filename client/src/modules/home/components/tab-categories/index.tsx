import { useProductCategories } from "medusa-react"
import { StoreGetProductsParams } from "@medusajs/medusa"
import { ProductCategory } from "@medusajs/medusa"
import clsx from "clsx"
import ButtonLigth from "@modules/common/components/button_light"
import { useContext, useState } from "react"
import { categoryContext } from "@lib/context/category-context"

type RefinementListProps = {
  refinementList: StoreGetProductsParams
  setRefinementList: (refinementList: StoreGetProductsParams) => void
}

const Category = ({
  refinementList,
  setRefinementList,
}: RefinementListProps) => {
  const category = useContext(categoryContext)
  const categories: ProductCategory[] = category?.categoriesChildren() || []
  const [isSelect, setIsSelect] = useState<string>("")

  const handleAllCategories = (id: string) => {
    setRefinementList({
      ...refinementList,
      category_id: [id],
    })
    return
  }

  return (
    <>
      <div className="px-8 pb-10 pt-5 mt-[-50px]">
        <div className="flex gap-x-4">
          {category ? (
            <>
              {" "}
              <ButtonLigth
                type="button"
                onClick={() => {
                  setIsSelect("")
                }}
                className={clsx(
                  "border-solid  border-[1px] w-[100px] h-[48px] text-[14px] font-semibold rounded-[5px] py-2 px-2",
                  { "border-[#707070] text-[#707070]": isSelect !== "" },
                  { "border-blue-gf text-blue-gf": isSelect == "" }
                )}
              >
                Todos
              </ButtonLigth>
              <div className="flex gap-x-4">
                {categories.map((category) => (
                  <ButtonLigth
                    key={category.id}
                    type="button"
                    onClick={() => {
                      handleAllCategories(category.id)
                      setIsSelect(category.id)
                    }}
                    className={clsx(
                      "border-solid  border-[1px] w-[100px] h-[48px] text-[14px] font-semibold rounded-[5px] py-2 px-2",
                      {
                        "border-[#707070] text-[#707070]":
                          isSelect !== category.id,
                      },
                      { "border-blue-gf text-blue-gf": isSelect == category.id }
                    )}
                  >
                    {category.name}
                  </ButtonLigth>
                ))}
              </div>
            </>
          ) : (
            <></>
          )}
        </div>
      </div>
    </>
  )
}

export default Category
