/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react"
import axios from "axios"
import { PricedProduct } from "@medusajs/medusa/dist/types/pricing"
import { useAccount } from "@lib/context/account-context"
import Input from "@modules/common/components/input"
import { FieldValues, useForm } from "react-hook-form"
import Textarea from "@modules/common/components/textarea"
import CardReview from "./card-review"
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Divider,
} from "@nextui-org/react"
import ButtonLigth from "@modules/common/components/button_light"
import StarsReview from "./stars-review"
import LoginComponente from "@modules/account/components/login"

type props = {
  product: PricedProduct
}

const ReviewProduct: React.FC<props> = ({ product }) => {
  const [dataNext, setDataNext] = useState<number>(1)
  const [arrayReviews, setArrayReviews] = useState([])
  const [title, setTitle] = useState<string>()
  const [content, setContent] = useState<string>()
  const { customer } = useAccount()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [rating, setRating] = useState(0)
  const [falseRating, setFalseRating] = useState(0)

  const handlerGetProducsReviews = (next?: boolean) => {
    let data
    if (next) {
      data = { id: product.id || " ", next: dataNext + 1 }
      setDataNext(dataNext + 1)
    } else {
      data = { id: product.id || " ", next: dataNext }
    }
    axios
      .get(`http://localhost:9000/store/products/${product.id}/reviews/`, {
        params: data,
      })
      .then((e) => {
        setArrayReviews(e.data.product_reviews)
      })
      .catch((e) => {
        console.log("no se logro", e)
      })
  }

  useEffect(() => {
    handlerGetProducsReviews()
  }, [])

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm()

  const handleRatingChange = (newRating: number) => {
    setRating(newRating)
  }
  const handleFalceRatingChange = (newRating: number) => {
    setFalseRating(newRating)
  }

  const Open = () => {
    onOpen()
  }
  const onSubmit = handleSubmit(async () => {
    const params = {
      id: product.id,
      customer_id: customer?.id,
      customer_name: `${customer?.first_name} ${customer?.last_name}`,
      display_name: title,
      content: content,
      rating: rating,
    }
    axios
      .post(
        `http://localhost:9000/store/products/${product.id}/reviews/`,
        params
      )
      .then((e) => {
        onClose()
        handlerGetProducsReviews()
        setTitle("")
        setContent("")
        setRating(0)
      })
      .catch((e) => {
        console.log(e, "error en axios")
      })
  })

  return (
    <>
      <StarsReview id={product.id || " "} review={arrayReviews} />
      <Divider className="" />
      <div className="flex flex-wrap ">
        <Button
          onPress={Open}
          className="bg-[#402e72] hover:bg-blue-gf text-white rounded-[5px]"
        >
          {" "}
          Añadir Reseña
        </Button>
      </div>
      {/* Promedio de estrellas y progreso */}
      {arrayReviews.length ? (
        <div className="mt-[-20px]">
          {/* Card para las reseñas */}
          <CardReview
            reviews={arrayReviews}
            handlerReviews={handlerGetProducsReviews}
          />
          <div className="w-full flex justify-center mt-[20px]">
            {/* Boton para agrefar mas */}
            <ButtonLigth
              onClick={async () => {
                handlerGetProducsReviews(true)
              }}
              variant="secondary"
            >
              Cargar mas reseñas
            </ButtonLigth>
          </div>
        </div>
      ) : (
        <div> ¡Se el primero en comentar!</div>
      )}
      <Divider className="" />
      <Modal backdrop={"opaque"} isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              {!customer ? (
                <div>
                  <ModalBody>
                    <LoginComponente />
                  </ModalBody>
                </div>
              ) : (
                <>
                  <ModalHeader className="flex flex-col gap-1 items-center">
                    <h2 className="text-[28px]">Añadir una valoración</h2>
                  </ModalHeader>
                  <ModalBody>
                    <div className="bg-white p-2 rounded-lg w-96">
                      <form onSubmit={onSubmit}>
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700">
                            Puntuación
                          </label>
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                className={`text-2xl px-1 ${
                                  falseRating
                                    ? star <= falseRating
                                      ? "text-blue-gf"
                                      : "text-gray-300"
                                    : star <= rating
                                    ? "text-yellow-400"
                                    : "text-gray-300"
                                }`}
                                onClick={() => handleRatingChange(star)}
                                onMouseEnter={() =>
                                  handleFalceRatingChange(star)
                                }
                                onMouseLeave={() => handleFalceRatingChange(0)}
                              >
                                ★
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="">
                          <span>Titulo</span>
                          <Input
                            label="titulo del comentario"
                            required
                            name="title"
                            onChange={(e) => {
                              setTitle(e.target.value)
                            }}
                            errors={errors}
                          />
                          <div>
                            <span>Comentario</span>
                            <Textarea
                              label="Comenta el producto"
                              name="content"
                              required
                              onChange={(e) => {
                                setContent(e.target.value)
                              }}
                              errors={errors}
                            />
                          </div>
                        </div>
                        <div className="text-center pt-[10px]">
                          <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded-[5px] hover:bg-blue-600"
                          >
                            Enviar
                          </button>
                        </div>
                      </form>
                    </div>
                  </ModalBody>
                  <ModalFooter>
                    <Button color="danger" variant="light" onPress={onClose}>
                      Close
                    </Button>
                  </ModalFooter>
                </>
              )}
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}

export default ReviewProduct
