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
} from "@nextui-org/react"
import ButtonLigth from "@modules/common/components/button_light"
import StarsReview from "./stars-review"

type props = {
  product: PricedProduct
}
interface RegisterCredentials extends FieldValues {
  first_name: string
  last_name: string
  email: string
  password: string
  phone?: string
}

const ReviewProduct: React.FC<props> = ({ product }) => {
  const [dataNext, setDataNext] = useState<number>(1)
  const [arrayReviews, setArrayReviews] = useState([])
  const { customer } = useAccount()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [rating, setRating] = useState(0)
  const [falseRating, setFalseRating] = useState(0)

  const handlerGetProducsReviews = (next?: number) => {
    const data = { id: product.id || " ", next }
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
    handlerGetProducsReviews(dataNext)
  }, [])

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<RegisterCredentials>()

  const handleRatingChange = (newRating: number) => {
    setRating(newRating)
  }
  const handleFalceRatingChange = (newRating: number) => {
    setFalseRating(newRating)
  }

  const Open = () => {
    if (!customer) return alert("Inicia Sesion")
    onOpen()
  }
  const onSubmit = handleSubmit(async (data) => {
    const params = {
      id: product.id,
      customer_id: customer?.id,
      customer_name: `${customer?.first_name} ${customer?.last_name}`,
      display_name: data.name,
      content: data.comment,
      rating: rating,
    }
    axios
      .post(
        `http://localhost:9000/store/products/${product.id}/reviews/`,
        params
      )
      .then((e) => {
        onClose()
        handlerGetProducsReviews(dataNext)
      })
      .catch((e) => {
        console.log(e, "error en axios")
      })
  })

  return (
    <>
      <div className="flex flex-wrap gap-3">
        <Button
          onPress={Open}
          className="bg-[#402e72] hover:bg-blue-gf text-white rounded-[5px]"
        >
          {" "}
          Añadir Reseña
        </Button>
      </div>
      <StarsReview id={product.id || " "} />
      {arrayReviews.length ? (
        <div>
          <CardReview reviews={arrayReviews} />
          <ButtonLigth
            onClick={async () => {
              await setDataNext(dataNext + 1)
              handlerGetProducsReviews()
            }}
            variant="secondary"
          >
            {" "}
            Cargar mas reseñas{" "}
          </ButtonLigth>
        </div>
      ) : (
        <div> Se el primero en comentar!</div>
      )}
      <Modal backdrop={"opaque"} isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
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
                            onMouseEnter={() => handleFalceRatingChange(star)}
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
                        {...register("name", {
                          required: "Se requiere un titulo",
                        })}
                        autoComplete="¡Excelente Producto!"
                        errors={errors}
                      />
                      <div>
                        <span>Comentario</span>
                        <Textarea
                          label="Comenta el producto"
                          {...register("comment", {
                            required: "Se requiere un comentario",
                          })}
                          autoComplete="El mejor producto de la historia"
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
        </ModalContent>
      </Modal>
    </>
  )
}

export default ReviewProduct
