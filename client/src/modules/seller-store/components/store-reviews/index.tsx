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

interface ModalProps {
  store_id: string
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
      size="5xl"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalBody>
              <div className="p-6 bg-gray-50 rounded-md shadow-md">
                <h2 className="text-2xl font-bold mb-4">Reseñas</h2>
                {reviews.length > 0 ? (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div
                        key={review.id}
                        className="p-4 bg-white rounded-md shadow-sm border"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <div>
                            <p className="font-semibold">
                              {review.customer_name}
                            </p>
                            <p className="text-gray-500 text-sm">
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
                              " font-bold"
                            )}
                          >
                            Rating: {review.rating}
                          </p>
                        </div>
                        <p className="text-gray-700">{review.content}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No hay reseñas disponibles.</p>
                )}
              </div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}

export default ModalSellerStoreReviews
