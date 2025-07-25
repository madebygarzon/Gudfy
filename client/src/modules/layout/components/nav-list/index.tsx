import { Popover, Transition } from "@headlessui/react"
import React, { useContext, useState } from "react"
import { ProductCategory } from "@medusajs/medusa"
import clsx from "clsx"
import { categoryContext } from "@lib/context/category-context"
import { Fragment } from "react"
import SelectedProducts from "@modules/home/components/slector-products"
import Loader from "@lib/loader"

const NavList: React.FC = () => {
  const categories = useContext(categoryContext)
  const [isOpen, setIsOpen] = useState<boolean>(false)

  return (
    <>
      {categories ? (
        <nav className="text-[#FFFFFF] relative font-[500] text-[14px] flex py-4 justify-center bg-[#3F1C7A] -z-10">
          <div
            className="  "
            onMouseEnter={() => setIsOpen(!isOpen)}
            onMouseLeave={() => setIsOpen(!isOpen)}
          >
            {categories.product_categories &&
            categories.product_categories.length > 0 ? (
              <Popover className=" flex justify-center h-full gap-x-7 ">
                {categories.product_categories.map(
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
                )}
                <Transition
                  show={isOpen}
                  as={Fragment}
                  enter="transition ease-out duration-200"
                  enterFrom="opacity-0 translate-y-1"
                  enterTo="opacity-100 translate-y-0"
                  leave="transition ease-in duration-150"
                  leaveFrom="opacity-100 translate-y-0"
                  leaveTo="opacity-0 translate-y-1"
                >
                  <Popover.Panel
                    static
                    className="py-2 px-2 absolute top-[38px]  bg-[#3F1C7A] w-[100%] text-gray-900"
                  >
                    <SelectedProducts />
                  </Popover.Panel>
                </Transition>
              </Popover>
            ) : (
              <Loader size={10} />
            )}
          </div>
        </nav>
      ) : (
        <> <Loader size={10} /></>
      )}
    </>
  )
}

// +

// const NavDropdown: React.FC<DropdpwnProps> = ({
//   category,
//   categories,
//   setSelectedCategory,
//   selectedCategory,
// }) => {
//   const [isOpen, setIsOpen] = useState(false)
//   return (
//     <div
//       className="relative flex items-center gap-x-1 "
//       onMouseEnter={() => setIsOpen(!isOpen)}
//       onMouseLeave={() => setIsOpen(!isOpen)}
//     >
//       <Popover className="relative h-full">
//         <button
//           key={category.id}
//           onClick={() => setSelectedCategory(category.id)}
//           className={clsx(
//             "px-2 m-0 border-b-2 hover:border-white",
//             {
//               "border-white": selectedCategory === category.id,
//             },
//             {
//               "border-transparent": selectedCategory !== category.id,
//             }
//           )}
//         >
//           {category.name}
//         </button>
//         <Transition
//           show={isOpen}
//           as={Fragment}
//           enter="transition ease-out duration-200"
//           enterFrom="opacity-0 translate-y-1"
//           enterTo="opacity-100 translate-y-0"
//           leave="transition ease-in duration-150"
//           leaveFrom="opacity-100 translate-y-0"
//           leaveTo="opacity-0 translate-y-1"
//         >
//           <Popover.Panel
//             static
//             className="hidden py-2 px-2 small:block absolute bot-0 left-[-10px] bg-[#3F1C7A] min-w-[280] text-gray-900"
//           >
//             {categories?.map((c) => (
//               <button className="block px-4 py-1 text-[#FFFFFF] font-[400] text-[14px] hover:bg-gray-100 hover:text-gray-900">
//                 {c.name}
//               </button>
//             ))}
//           </Popover.Panel>
//         </Transition>
//       </Popover>
//     </div>
//   )
// }

export default NavList
