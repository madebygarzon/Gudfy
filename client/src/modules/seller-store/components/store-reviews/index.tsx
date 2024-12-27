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
} from "@nextui-org/react"
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
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalBody>
              <div className=" flex py-3 bg-white rounded-lg px-2 ">
                <div className="w-60 flex flex-col items-center justify-center">   
                  <Avatar
                    size="lg"
                    src={store_avatar || " "}
                    className=" w-[100px] h-[100px] border-solid border-3 border-[#9B48ED] text-3xl text-lila-gf font-extrabold"
                  />               
                    <h3 className="text-xl font-bold text-gray-700">
                      {store_name}
                    </h3>     
                    <p className="text-sm font-bold text-gray-800">
                      Reseñas
                    </p>             
                </div>
                <div className="ml-6 w-full ">
               
                {reviews.length > 0 ? (
                  <div className=" max-h-[300px] space-y-4 overflow-y-auto">
                    {reviews.map((review) => (
                      <div
                        key={review.id}
                        className="p-4 bg-gray-50 rounded-lg shadow-md border border-gray-200"
                      >
                        <div className="flex justify-between items-center mb-3">
                          <div>
                            <p className="font-bold text-gray-800">
                              {review.customer_name}
                            </p>
                            <p className="text-sm text-gray-500">
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
                              "text-lg font-bold"
                            )}
                          >
                            {review.rating}★
                          </p>
                        </div>
                        <p className="text-gray-700 leading-relaxed">
                          {review.content}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <Image
                      alt="user_gudfy"
                      src="/account/comments.svg"
                      title="Ordenes"
                      width={80}
                      height={80}
                    />
                    <h3 className="text-xl font-semibold">
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
