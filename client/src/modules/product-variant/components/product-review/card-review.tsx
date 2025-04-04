import React from "react"
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Image,
} from "@heroui/react"

import { useAccount } from "@lib/context/account-context"
import DropdownCard from "./dropdown-card"

interface propsReviews {
  reviews: Array<{
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
  }>
  handlerReviews: () => void
}

const CardReview: React.FC<propsReviews> = ({ reviews, handlerReviews }) => {
  const { customer } = useAccount()
  function decoFecha(fechaIso: string) {
    const fecha = new Date(fechaIso)
    const day = fecha.getDay() + 1
    const month = fecha.getMonth() + 1
    const year = fecha.getFullYear()
    const hours = fecha.getHours()
    const minute = fecha.getMinutes()
    return `${day}/${month}/${year} ${hours}:${minute}`
  }

  return (
    <div className="w-full px-8 ">
      {reviews?.map((reviews) => {
        return (
          <>
            <Card className="w-full my-2 ">
              <CardHeader className="flex gap-3 relative">
                {customer && customer.id === reviews.customer_id ? (
                  <div className="flex absolute right-0 top-[25%]">
                    {" "}
                    <DropdownCard
                      data={reviews}
                      handlerReviews={handlerReviews}
                    />
                  </div>
                ) : (
                  ""
                )}
                <Image
                  alt="nextui logo"
                  height={40}
                  radius="sm"
                  src="https://avatars.githubusercontent.com/u/86160567?s=200&v=4"
                  width={40}
                />
                <div className="flex flex-col">
                  <div className="flex items-center gap-5">
                    <h3 className="capitalize">{reviews.customer_name} </h3>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          className={`text-2xl px-1 ${
                            star <= reviews.rating
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>
                  <p className="text-small text-default-500">
                    {` ${decoFecha(reviews.created_at)}`}
                  </p>
                </div>
              </CardHeader>
              <Divider />
              <CardBody>
                <h3 className="font-black capitalize">
                  {`${reviews.display_name}:`}
                </h3>
                <p>{reviews.content}</p>
              </CardBody>
            </Card>
          </>
        )
      })}
    </div>
  )
}

export default CardReview
