import React, { useContext, useState } from "react"
import { ProductCategory } from "@medusajs/medusa"
import clsx from "clsx"
import { categoryContext } from "@lib/context/category-context"

const NavList: React.FC = () => {
  const categories = useContext(categoryContext)

  return (
    <>
      {categories ? (
        <nav className="text-[#FFFFFF] font-[500] text-[14px] flex py-4 justify-center gap-x-7 bg-[#3F1C7A] duration-500">
          {categories.product_categories &&
          categories.product_categories.length > 0
            ? categories.product_categories.map(
                (category: ProductCategory) =>
                  !category.parent_category_id && (
                    <button
                      key={category.id}
                      onClick={() =>
                        categories.setSelectedCategory(category.id)
                      }
                      className={clsx(
                        "px-2 m-0 border-b-2 hover:border-white",
                        {
                          "border-white":
                            categories.selectedCategory === category.id,
                        },
                        {
                          "border-transparent":
                            categories.selectedCategory !== category.id,
                        }
                      )}
                    >
                      {category.name}
                    </button>
                  )
              )
            : "loading.."}
        </nav>
      ) : (
        <> loading...</>
      )}
    </>
  )
}

export default NavList
