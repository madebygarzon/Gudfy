import { StoreGetProductsParams } from "@medusajs/medusa"
import { ProductCategory } from "@medusajs/medusa"
import clsx from "clsx"
import ButtonLigth from "@modules/common/components/button_light"
import { useContext, useState, useEffect } from "react"
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
  const categories: ProductCategory[] = category?.childCategory() || []
  const [isSelect, setIsSelect] = useState<string>("")

  useEffect(() => {
    handleAllCategories()
  }, [category?.selectedCategory])

  const handleAllCategories = () => {
    const idCategory = category?.selectedCategory || ""
    setRefinementList({
      ...refinementList,
      category_id: [idCategory],
    })
    return
  }
  const handleSelectCategories = (id: string) => {
    setRefinementList({
      ...refinementList,
      category_id: [id],
    })
    return
  }

  return categories.length ? (
    <div className="flex flex-wrap flex-col  h-[300px] pl-5">
      <ButtonLigth
        type="button"
        onClick={() => {
          handleAllCategories()
          setIsSelect("")
        }}
        className={clsx(
          "border-solid  border-[1px] w-[100px]  text-[14px] text-uppercase rounded-[5px] py-2 px-2",
          { "border-slate-200 text-slate-200": isSelect !== "" },
          { "border-white text-white": isSelect == "" }
        )}
      >
        Todos
      </ButtonLigth>

      {categories.map((category) => (
        <ButtonLigth
          key={category.id}
          type="button"
          onClick={() => {
            handleSelectCategories(category.id)
            setIsSelect(category.id)
          }}
          className={clsx(
            "border-solid  border-[1px] w-[100px] text-[14px] text-uppercase rounded-[5px] py-2 px-2 ",
            {
              "border-slate-300 text-slate-300": isSelect !== category.id,
            },
            { "border-white text-white": isSelect == category.id }
          )}
        >
          {category.name}
        </ButtonLigth>
      ))}
    </div>
  ) : (
    <></>
  )
}

export default Category
