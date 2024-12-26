import React, { useEffect, useState } from "react"
import { Customer, Order } from "@medusajs/medusa"
import Link from "next/link"
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
import ButtonGF from "@modules/common/components/button"
import Cart from "@modules/common/icons/cart"
import Edit from "@modules/common/icons/edit"
import Product from "@modules/common/icons/package"
import { CiCircleCheck } from "react-icons/ci"
import Image from "next/image"
import { useCustomerOrders, useMeCustomer } from "medusa-react"
import { Progress } from "@nextui-org/react"
import { useNotificationContext } from "@lib/context/notification-context"
import Notification from "@modules/common/components/notification"
import { getDataReviews } from "@modules/account/actions/reviews/get-data-reviews"
import handlerformatDate from "@lib/util/formatDate"
import { getStoreReviews } from "@modules/account/actions/reviews/get-store-revioews"
import clsx from "clsx"
import { updateStoreName } from "@modules/account/actions/seller/update-name-store"
import { Select, SelectItem } from "@nextui-org/react"
import { adjectives, animals } from "@lib/util/list-name-store"
import { Alert } from "@nextui-org/react"
import { Popover, PopoverTrigger, PopoverContent } from "@nextui-org/react"
import { listSellersAvatar } from "@lib/util/list-sellers-avatar"
import { updateSellerAvatar } from "@modules/account/actions/seller/update-seller-avatar"

type store = {
  id: string
  name: string
  change_name: boolean
  avatar: string
  parameters: {
    numberSales: number
    productCount: number
  }
}

const CustomerStore: React.FC<store> = (store) => {
  const { customer } = useMeCustomer()
  return (
    <div className="w-full pb-5">
      <div className="text-xl-semi flex flex-col md:flex-row justify-between items-start ">
        <span>¡Bienvenido a tu tienda!</span>
        <span className="text-small-regular text-gray-700"></span>
      </div>

      <div className="flex flex-col md:flex-row min-h-[230px] my-4 gap-2">
        <div className="w-full md:w-[40%] flex justify-center rounded-lg shadow-2xl p-2">
          <CardPrefileDashboard customer={customer} store={store} />
        </div>
        <div className="w-full md:w-[60%] flex justify-center rounded-lg shadow-2xl p-2">
          <CardReviewProductDashboard />
        </div>
      </div>

      <div className="rounded-lg shadow-2xl p-8 w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 py-1 ">
        <CardItemsDashboard
          image="/account/product.svg"
          title="Productos"
          description="Crea, edita y gestiona tus productos"
          href="/account/seller/products"
          store={store}
        />
        <CardItemsDashboard
          image="/account/metricas.svg"
          title="Ordenes"
          description="Mira el proceso de tus ordenes y ventas"
          href="/account/seller/orders"
          store={store}
        />
        {/* <CardItemsDashboard
      image="/account/cart.svg"
      title="Ventas"
      description="Gestiona y analiza tus ventas"
      href="/account/profile"
      store={store}
    /> */}
        <CardItemsDashboard
          image="/account/wallet.svg"
          title="Tu Billetera"
          description="¡Ten el control de tus ingresos!"
          href="/account/seller/wallet"
          store={store}
        />
      </div>
    </div>
  )
}

interface CardDasboard {
  image: string
  alt?: string
  title: string
  description: string
  href: string
  store: store
}

const CardItemsDashboard: React.FC<CardDasboard> = ({
  image,
  title,
  description,
  href,
}) => {
  const { notifications } = useNotificationContext()
  return (
    <div className="min-h-[230px] ">
      <Link href={href}>
        <div className=" relative flex flex-col py-5 px-2  h-full items-center  justify-center">
          <Image alt="user_gudfy" src={image} width={80} height={80} />
          {notifications.map((n) => {
            if (
              n.notification_type_id === "NOTI_CLAIM_SELLER_ID" &&
              title == "Ordenes"
            ) {
              return <Notification />
            }
          })}
          <h3 className="text-2xl font-bold ">{title}</h3>
          <p className="text-sm text-center">{description}</p>
        </div>
      </Link>
    </div>
  )
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

const CardReviewProductDashboard: React.FC = () => {
  const [dataReview, setDataReview] = useState<{
    totalReviews: number
    rating: number
    latestComment: dataReview | null
  }>({
    totalReviews: 0,
    rating: 0,
    latestComment: null,
  })
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure()

  const handlerGetReview = () => {
    getDataReviews().then((e) => {
      setDataReview(e)
    })
  }
  useEffect(() => {
    handlerGetReview()
  }, [])

  return (
    <div className=" min-h-[200px] w-full flex flex-col py-2 px-2  h-full items-center  justify-center">
      {!(
        dataReview.rating ||
        dataReview.totalReviews ||
        dataReview.latestComment
      ) ? (
        <div className="flex items-center justify-center gap-2">
          <Image
            alt="user_gudfy"
            src="/account/comments.svg"
            title="Ordenes"
            width={80}
            height={80}
          />
          <h3 className="text-xl font-bold">Aún no tienes valoraciones</h3>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between border-b-1 w-full border-b-[#9B48ED] p-4 ">
            <h3 className="text-xl font-bold">Mis valoraciones</h3>
            <p className="text-ms text-[#9B48ED]">
              Reviews: {dataReview.totalReviews}{" "}
            </p>
            <p
              className="text-ms text-[#9B48ED] cursor-pointer"
              onClick={() => onOpen()}
            >
              Ver más reviews
            </p>
          </div>
          <div className="pt-4 w-full">
            <div className="text-center">
              <h3 className="text-4xl font-bold -mb-2 ">
                {dataReview?.rating.toFixed(2)}%
              </h3>
              <p className="text-sm " onClick={() => {}}>
                Valoraciones positivas
              </p>
            </div>
            <div className="flex w-[100%]  justify-center mt-2">
              <div className={`w-[${dataReview?.rating}%] z-20`}>
                <Progress color={"secondary"} value={dataReview?.rating} />
              </div>
            </div>
          </div>
          <div className=" flex w-full  justify-center px-2 mt-4">
            {dataReview?.latestComment ? (
              <div
                key={dataReview?.latestComment?.id}
                className="p-2 bg-white rounded-md shadow-sm border w-[70%]"
              >
                <div className="flex  relative justify-between items-center mb-2">
                  <div>
                    <p className="font-semibold text-sm mr-4">
                      {dataReview?.latestComment.customer_name}
                    </p>
                    <p className="text-gray-300 text-xs">
                      {handlerformatDate(dataReview?.latestComment.created_at)}
                    </p>
                  </div>
                  <p className="text-yellow-500 font-bold text-xs absolute top-0 right-0">
                    Valor : {dataReview?.latestComment.rating}
                  </p>
                </div>
                <p className="text-gray-700 text-sm font-sans">
                  "{dataReview?.latestComment.content}"
                </p>
              </div>
            ) : (
              <></>
            )}
          </div>
          <ModalReviews
            isOpen={isOpen}
            onClose={onClose}
            onOpenChange={onOpenChange}
          />
        </>
      )}
    </div>
  )
}
interface CardPrefileDashboard {
  customer: Omit<Customer, "password_hash"> | undefined
  store: store
}

const CardPrefileDashboard: React.FC<CardPrefileDashboard> = ({
  customer,
  store,
}) => {
  const [nameEdit, setNameEdit] = useState<{
    stateEdit: boolean
    storeName: string
    adjective: string
    animal: string
    change: boolean
  }>({
    stateEdit: false,
    storeName: store.name,
    adjective: "",
    animal: "",
    change: store.change_name,
  })
  const [selectedAvatar, setSelectedAvatar] = useState<{
    name: string
    src: string
  }>({
    name: "",
    src: store.avatar || "/account/avatars/avatar_aguila.png",
  });

  useEffect(() => {
    if (nameEdit.animal) {
      const avatar = listSellersAvatar.find(
        (item) => item.name.toLowerCase() === nameEdit.animal.toLowerCase()
      );
      if (avatar) {
        setSelectedAvatar(avatar);
      }
    }
  }, [nameEdit.animal]);

  const [isOpen, setIsOpen] = React.useState(false)

  const handlerEditNameStore = () => {
    updateStoreName(nameEdit.adjective + " " + nameEdit.animal).then(() => {
      setNameEdit((old) => ({
        ...old,
        stateEdit: false,
        storeName: old.adjective + " " + old.animal,
        change: true,
      }))
    })
  }

  // const handlerUpdateAvatar = () => {
  //   updateSellerAvatar(selectedAvatar.src).then(() => {
  //     setIsOpen((open) => !isOpen)
  //   })
  // }

  return (
    <div className=" relative flex flex-col w-full  py-5 px-2  h-full items-center  justify-center">
      <Avatar
        size="lg"
        src={selectedAvatar.src}
        className=" w-[180px] h-[180px] border-solid border-5 border-[#9B48ED] text-3xl text-lila-gf font-extrabold"
      />
      {/* <div className="absolute top-10 right-10 z-20">
        <div>
          <Popover
            placement={"right"}
            isOpen={isOpen}
            onOpenChange={(open) => {
              setSelectedAvatar({
                name: "",
                src: store.avatar || "/account/avatars/avatar_aguila.png",
              })
              setIsOpen(open)
            }}
          >
            <PopoverTrigger>
              <Button className="bg-transparent">
                <Edit color="#9b48ed" className={"cursor-pointer"} size={30} />
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <div className="p-4">
                <h2 className="text-center text-lg font-bold mb-4">
                  Selecciona un Avatar
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {listSellersAvatar.map((avatar, i) => (
                    <div
                      key={i}
                      onClick={() => setSelectedAvatar(avatar)}
                      className={`relative cursor-pointer border-2 rounded-lg overflow-hidden ${
                        selectedAvatar.name === avatar.name
                          ? "border-lila-gf"
                          : "border-transparent"
                      }`}
                    >
                      <Image
                        alt={avatar.name}
                        src={avatar.src}
                        width={80}
                        height={80}
                      />
                      <span
                        className={`absolute bottom-0 left-0 w-full text-center text-white bg-black/50 py-1 ${
                          selectedAvatar.name === avatar.name
                            ? "bg-lila-gf/80"
                            : ""
                        }`}
                      >
                        {avatar.name}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-center w-full flex justify-end">
                  <ButtonGF
                    color="primary"
                    onClick={() => {
                      handlerUpdateAvatar()
                    }}
                  >
                    Guardar
                  </ButtonGF>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div> */}

      <div className="flex">
        {nameEdit.stateEdit ? (
          <div className="flex-col justify-center w-full">
            <div className="flex w-full justify-center gap-4 pt-2 ">
            <Select
                className="w-[45%] border-lila-gf border rounded-[9px] text-lila-gf"
                placeholder="Selecciona un adjetivo"
                size="sm"
                onChange={(e) => {
                  setNameEdit((old) => ({ ...old, adjective: e.target.value }))
                }}
              >
                {adjectives.map((adjective) => (
                  <SelectItem key={adjective.key}>{adjective.label}</SelectItem>
                ))}
              </Select>

              <Select
                className="w-[45%] border-lila-gf border rounded-[9px] text-lila-gf"
                placeholder="Selecciona un animal"
                size="sm"
                onChange={(e) => {
                  setNameEdit((old) => ({ ...old, animal: e.target.value }))
                }}
              >
                {animals.map((animal) => (
                  <SelectItem key={animal.key}>{animal.label}</SelectItem>
                ))}
              </Select>

              
            </div>
            <div className="flex items-center justify-center w-full my-2 p-2 text-sm">
              <Alert
                color="secondary"                
                closeButton
                description={
                  "Ten en cuenta que solo podrás modificar el nombre una única vez."
                }
                title={
                  <h3 className="font-bold">
                    Actualiza el nombre de tu tienda
                  </h3>
                }
                endContent={
                  <div className="h-full my-auto ml-2 ">
                    <Button
                      className="bg-[#28A745] hover:bg-[#218838] text-white rounded-md border-none w-full"
                      isDisabled={!(nameEdit.adjective && nameEdit.animal)}
                      // color="secondary"
                      // size="sm"
                      // variant="flat"
                      onPress={handlerEditNameStore}
                    >
                      Guardar
                    </Button>
                    <Button
                      className="mt-1 bg-[#E74C3C] hover:bg-[#C0392B] text-white rounded-md border-none w-full"
                      // color="danger"
                      // size="sm"
                      // variant="flat"
                      onPress={() => {
                        setNameEdit((old) => ({ ...old, stateEdit: false }))
                      }}
                    >
                      Cancelar
                    </Button>
                  </div>
                }
                variant="faded"
              />
            </div>
          </div>
        ) : (
          <div className="flex">
            <p className=" text-xl-semi capitalize">{nameEdit.storeName}</p>{" "}
            {!nameEdit.change ? (
              <Tooltip
                className="mt-5 border-2 border-lila-gf w-[350px]"
                content={
                  <div className="px-1 py-2 ">
                    Cambia aquí el nombre de tu tienda
                  </div>
                }
              >
                <div>
                  <Edit
                    color="#9b48ed"
                    className={"cursor-pointer ml-2"}
                    size={20}
                    onClick={() =>
                      setNameEdit((old) => ({ ...old, stateEdit: true }))
                    }
                  />
                </div>
              </Tooltip>
            ) : (
              <></>
            )}
          </div>
        )} 
      </div>
      {/* <span className="font-semibold text-gray-500">{customer?.email}</span> */}
      <div className="flex gap-2 my-4">
        <div className="flex text-gray-400 text-xs ">
          <Cart size={16} color="#9b48ed" />{" "}
          <p className="text-[10px]">{`(${store.parameters.numberSales}) Ventas`}</p>
        </div>
        <div className="flex text-gray-400 text-xs ">
          <Product size={16} color="#9b48ed" />{" "}
          <p className="text-[10px]">{`(${store.parameters.productCount}) Productos`}</p>
        </div>
      </div>
    </div>
  )
}

interface ModalProps {
  isOpen: boolean
  onOpenChange: () => void
  onClose: () => void
}

const ModalReviews = ({ isOpen, onOpenChange, onClose }: ModalProps) => {
  const { customer } = useMeCustomer()
  const [nextPage, setNextPage] = useState<number>(1)
  const [reviews, setReviews] = useState<dataReview[]>([])

  useEffect(() => {
    if (isOpen)
      getStoreReviews(nextPage).then((e) => {
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
              <div className="p-6 bg-gray-50 ">
                <h2 className="text-2xl font-bold mb-4">Reseñas</h2>
                {reviews.length > 0 ? (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div
                        key={review.id}
                        className="p-4 bg-white"
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

const ModalEditAvatar = ({ isOpen, onOpenChange, onClose }: ModalProps) => {
  const [nextPage, setNextPage] = useState<number>(1)
  const [reviews, setReviews] = useState<dataReview[]>([])

  useEffect(() => {}, [isOpen])
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
            <ModalBody></ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
export default CustomerStore
