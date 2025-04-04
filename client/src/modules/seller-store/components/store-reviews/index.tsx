import React, { useEffect, useState } from "react"
import {
  Avatar,
  Modal,
  ModalContent,
  useDisclosure,
  ModalBody,
  ModalHeader,
  Button,
  Input,
  Tooltip,
} from "@heroui/react"
import { getSellerStoreReviews } from "@modules/seller-store/actions/get-seller-store-reviews"
import clsx from "clsx"
import Image from "next/image"

interface ModalProps {
  store_id: string
  store_name: string
  store_avatar: string
  isOpen: boolean
  onOpenChange: () => void
  onClose: () => void
}
type dataReview = {
  id: string
  store_order_id: string
  store_id: string
  customer_id: string
  customer_name: string
  rating: number
  content: string
  created_at: string
}

const ModalSellerStoreReviews = ({
  isOpen,
  onOpenChange,
  onClose,
  store_id,
  store_name,
  store_avatar,
}: ModalProps) => {
  const [nextPage, setNextPage] = useState<number>(1)
  const [reviews, setReviews] = useState<dataReview[]>([])

  useEffect(() => {
    if (isOpen)
      getSellerStoreReviews(store_id, nextPage).then((e) => {
        setReviews(e)
      })
  }, [isOpen])

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      onClose={onClose}
      size="2xl"
      className="mx-2" // Añadido margen horizontal para mobile
      placement="center"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalBody className="md:px-6 px-2">
              <div className="flex flex-col md:flex-row py-4 md:py-3 bg-white rounded-lg px-4 md:px-2 items-center md:items-start">
                {/* Sección izquierda (Avatar e información) */}
                <div className="w-full md:w-60 flex flex-col items-center justify-center mb-4 md:mb-0">
                  <Avatar
                    size="lg"
                    src={store_avatar || " "}
                    className="w-[80px] h-[80px] md:w-[100px] md:h-[100px] border-solid border-3 border-[#9B48ED] text-2xl md:text-3xl text-lila-gf font-extrabold"
                  />
                  <h3 className="text-lg md:text-xl font-bold text-gray-700 mt-2 text-center">
                    {store_name}
                  </h3>
                  <p className="text-sm font-bold text-gray-800 mt-1">
                    Reseñas
                  </p>
                </div>

                {/* Sección derecha (Lista de reseñas) */}
                <div className="md:ml-6 w-full">
                  {reviews.length > 0 ? (
                    <div className="max-h-[60vh] md:max-h-[300px] space-y-3 md:space-y-4 overflow-y-auto">
                      {reviews.map((review) => (
                        <div
                          key={review.id}
                          className="p-3 md:p-4 bg-gray-50 rounded-lg shadow-md border border-gray-200"
                        >
                          <div className="flex justify-between items-center mb-2 md:mb-3">
                            <div>
                              <p className="text-base md:text-base font-bold text-gray-800">
                                {review.customer_name}
                              </p>
                              <p className="text-xs md:text-sm text-gray-500">
                                {review.created_at}
                              </p>
                            </div>
                            <p
                              className={clsx(
                                {
                                  "text-yellow-500": review.rating == 3,
                                  "text-green-500": review.rating == 5,
                                  "text-red-500": review.rating == 1,
                                },
                                "text-md md:text-lg font-bold"
                              )}
                            >
                              {review.rating}★
                            </p>
                          </div>
                          <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                            {review.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 p-4">
                      <Image
                        alt="user_gudfy"
                        src="/account/comments.svg"
                        title="Ordenes"
                        width={60}
                        height={60}
                        className="w-16 h-16 md:w-20 md:h-20"
                      />
                      <h3 className="text-base md:text-xl text-center md:text-left font-semibold mt-2 md:mt-0">
                        Esta tienda aún no tiene reseñas.
                      </h3>
                    </div>
                  )}
                </div>
              </div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}

export default ModalSellerStoreReviews
