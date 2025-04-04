import React from "react"
import { useDisclosure } from "@heroui/react"
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  cn,
} from "@heroui/react"

import { EditDocumentIcon } from "./icons/edit-icon"
import { DeleteDocumentIcon } from "./icons/delete-icon"
import { AiOutlineBars } from "react-icons/ai"
import axios from "axios"
import ModalReview from "./modal-review"

interface props {
  data: {
    approved: boolean
    content: string
    created_at: string
    customer_id: string
    customer_name: string
    display_name: string
    id: string
    product_id: string
    rating: number
    updated_at: string
  }
  handlerReviews: () => void
}

const DropdownCard: React.FC<props> = ({ data, handlerReviews }) => {
  const iconClasses =
    "text-xl text-default-500 pointer-events-none flex-shrink-0"
  const { isOpen, onOpen, onClose } = useDisclosure()

  const handlerEdit = () => {
    onOpen()
  }
  // const handlerDelete = () => {
  //   axios
  //     .delete(`http://localhost:9000/store/reviews/${data.id}`)
  //     .then((e) => {
  //       console.log(e)
  //       handlerReviews()
  //     })
  //     .catch((e) => {
  //       console.log(e)
  //     })
  // }

  return (
    <>
      <Dropdown>
        <DropdownTrigger className="border-none">
          <Button variant="bordered">
            <AiOutlineBars color="#1F0054" size={30} />
          </Button>
        </DropdownTrigger>
        <DropdownMenu variant="faded" aria-label="Dropdown menu with icons">
          <DropdownItem
            key="edit"
            startContent={<EditDocumentIcon className={iconClasses} />}
            onClick={handlerEdit}
          >
            Editar Comentario
          </DropdownItem>
          <DropdownItem
            key="delete"
            className="text-danger"
            color="danger"
            startContent={
              <DeleteDocumentIcon className={cn(iconClasses, "text-danger")} />
            }
          >
            Borrar Comentario
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <ModalReview
        isOpen={isOpen}
        onClose={onClose}
        data={data}
        handlerReviews={handlerReviews}
      />
    </>
  )
}

export default DropdownCard
