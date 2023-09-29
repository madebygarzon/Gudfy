import React from "react"
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Image,
} from "@nextui-org/react"

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
}

const CardReview: React.FC<propsReviews> = ({ reviews }) => {
  function decoFecha(fechaIso: string) {
    const fecha = new Date(fechaIso)
    const day = fecha.getDay()
    const month = fecha.getMonth() + 1
    const year = fecha.getFullYear()
    const hours = fecha.getHours()
    const minute = fecha.getSeconds()
    return `${day}/${month}/${year} ${hours}:${minute}`
  }

  return (
    <div className="w-full h-[25%] overflow-hidden px-8 py-4">
      {reviews?.map((reviews) => {
        return (
          <>
            <Card className="w-[90%] m-2 ">
              <CardHeader className="flex gap-3 relative">
                <Image
                  alt="nextui logo"
                  height={40}
                  radius="sm"
                  src="https://avatars.githubusercontent.com/u/86160567?s=200&v=4"
                  width={40}
                />
                <div className="flex flex-col">
                  <h3 className="capitalize">{reviews.customer_name} </h3>
                  <div className="flex absolute right-5 top-[27%]">
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
              <CardFooter></CardFooter>
            </Card>
          </>
        )
      })}
    </div>
  )
}

export default CardReview
