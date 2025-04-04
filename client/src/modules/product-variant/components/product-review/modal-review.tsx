import React, { useState, useEffect } from "react"
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react"
import { useForm } from "react-hook-form"
import Textarea from "@modules/common/components/textarea"
import Input from "@modules/common/components/input"
import axios from "axios"

interface props {
  isOpen: boolean
  onClose: () => void
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

interface ReviewCredentials {
  display_name: string
  content: string
  rating: number
}

const ModalReview: React.FC<props> = ({
  isOpen,
  onClose,
  data,
  handlerReviews,
}) => {
  const [valueDisplay, setValueDisplay] = useState<string>(data.display_name)
  const [valueContent, setValueContent] = useState<string>(data.content)
  const [success, setSuccess] = useState<boolean>(false)
  const [authError, setAuthError] = useState<string | undefined>(undefined)
  const [rating, setRating] = useState<number>(data.rating)
  const [falseRating, setFalseRating] = useState(0)
  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm()

  useEffect(() => {
    setSuccess(false)
    setValueDisplay(data.display_name)
    setValueContent(data.content)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  const handleRatingChange = (newRating: number) => {
    setRating(newRating)
  }
  const handleFalceRatingChange = (newRating: number) => {
    setFalseRating(newRating)
  }
  const handleCleanValues = () => {
    setValueDisplay("")
    setValueContent("")
  }

  const onSubmit = handleSubmit(async () => {
    const body = {
      id_review: data.id,
      display_name: valueDisplay,
      content: valueContent,
      rating: rating,
    }
    if (!body.content.length || !body.display_name.length) {
      setAuthError("Ingrese las credenciales correctas")
      return
    } else {
      // axios
      //   .post(`http://localhost:9000/store/reviews/${data.id}`, body)
      //   .then((e) => {
      //     handlerReviews()
      //     setSuccess(true)
      //     handleCleanValues()
      //   })
      //   .catch((e) => {
      //     console.log(e, "no se logro")
      //   })
    }
  })

  return (
    <Modal backdrop={"opaque"} isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        {(onClose) => (
          <>
            {" "}
            {success ? (
              <>
                <ModalHeader className="justify-center">
                  <h2 className=" text-[28px] text-center">
                    ¡Se ha modificado con éxito!
                  </h2>
                </ModalHeader>
                <ModalBody className="justify-center">
                  <p className="text-[18px] text-center">
                    Tu comentario sera público en breve
                  </p>
                </ModalBody>
                <ModalFooter className="flex justify-center">
                  <Button
                    color="danger"
                    variant="light"
                    onPress={onClose}
                    className="bg-red-700 text-white px-4 py-2 rounded-[5px] hover:bg-red-600"
                  >
                    Cerrar
                  </Button>
                </ModalFooter>
              </>
            ) : (
              <>
                <ModalHeader className="flex flex-col gap-1 items-center">
                  <h2 className="text-[28px]">Editar valoración</h2>
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
                          required
                          value={valueDisplay}
                          onChange={(e) => {
                            setValueDisplay(e.target.value)
                          }}
                          label="titulo del comentario"
                          name="title"
                          errors={errors}
                        />
                        <div>
                          <span>Comentario</span>
                          <Textarea
                            required
                            value={valueContent}
                            onChange={(e) => {
                              setValueContent(e.target.value)
                            }}
                            label="Comenta el producto"
                            name="content"
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
                        {authError ? (
                          <div>
                            <span className="text-rose-500 w-full text-small-regular">
                              {`${authError}`}
                            </span>
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                    </form>
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button
                    color="danger"
                    variant="light"
                    onPress={() => {
                      onClose()
                      handleCleanValues()
                    }}
                  >
                    Close
                  </Button>
                </ModalFooter>
              </>
            )}
          </>
        )}
      </ModalContent>
    </Modal>
  )
}

export default ModalReview
