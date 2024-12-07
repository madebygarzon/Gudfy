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
} from "@nextui-org/react"
import ButtonLigth from "@modules/common/components/button_light"
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

type store = {
  id: string
  name: string
  parameters: {
    numberSales: number
    productCount: number
  }
}

const CustomerStore: React.FC<store> = (store) => {
  const { customer } = useMeCustomer()
  return (
    <div className="w-full pb-5">
      <div className="text-xl-semi flex justify-between items-start ">
        <span>
          ¡Tu tienda{" "}
          <span className=" text-xl-semi capitalize">
            {customer?.first_name}
          </span>
          !
        </span>
        <span className="text-small-regular text-gray-700"></span>
      </div>
      <div className="flex min-h-[230px] my-4 gap-2">
        <div className="w-[40%] flex justify-center ">
          <CardPrefileDashboard customer={customer} store={store} />
        </div>
        <div className=" w-[60%] flex justify-center ">
          <CardReviewProductDashboard />
        </div>
      </div>
      <div className=" w-full grid grid-cols-4 gap-2 py-1   ">
        <CardItemsDashboard
          image="/account/product.svg"
          title="Productos"
          description=" Crea, edita y gestiona tus productos"
          href="/account/seller/products"
          store={store}
        />

        <CardItemsDashboard
          image="/account/metricas.svg"
          title="Ordenes"
          description=" Mira el proseso de tus ordenes"
          href="/account/seller/orders"
          store={store}
        />

        <CardItemsDashboard
          image="/account/cart.svg"
          title="Ventas"
          description="Gestiona y analisa tus ventas"
          href="/account/profile"
          store={store}
        />

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
        <div className=" relative flex flex-col py-5 px-2  h-full shadow-card rounded-[10px] items-center  justify-center">
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
    <div className=" min-h-[200px] w-full flex flex-col py-2 px-2  h-full shadow-card rounded-[10px] items-center  justify-center">
      <div className="flex items-center justify-between border-b-1 w-full border-b-[#9B48ED] p-4 ">
        <h3 className="text-xl font-bold">Mis Valoraciones</h3>
        <p className="text-ms text-[#9B48ED]">
          Reviews: {dataReview.totalReviews}{" "}
        </p>
        <p
          className="text-ms text-[#9B48ED] cursor-pointer"
          onClick={() => onOpen()}
        >
          Ver mas reviews
        </p>
      </div>
      <div className="pt-4 w-full">
        <div className="text-center">
          <h3 className="text-4xl font-bold -mb-2 ">{dataReview?.rating}%</h3>
          <p className="text-sm " onClick={() => {}}>
            Valoraciones Positivas
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
  }>({
    stateEdit: false,
    storeName: store.name.replace("GF-", ""),
  })
  const handlerEditNameStore = () => {
    updateStoreName(nameEdit.storeName).then(() => {
      setNameEdit((old) => ({ ...old, stateEdit: false }))
    })
  }
  return (
    <div className="flex flex-col w-full  py-5 px-2  h-full shadow-card rounded-[10px] items-center  justify-center">
      <Avatar
        src="https://i.pravatar.cc/150?u=a04258114e29026708c"
        className=" w-[100px]  h-[100px] border-solid border-5 border-[#9B48ED]"
      />
      {nameEdit.stateEdit ? (
        <div className="flex items-center">
          <Input
            size="sm"
            value={nameEdit.storeName}
            onChange={(e) =>
              setNameEdit((old) => ({
                ...old,
                storeName: e.target.value,
              }))
            }
          />

          <CiCircleCheck
            className={"cursor-pointer"}
            size={25}
            onClick={handlerEditNameStore}
          />
        </div>
      ) : (
        <div className="flex">
          <p className=" text-xl-semi capitalize">
            {"GF-" + nameEdit.storeName}
          </p>{" "}
          <Edit
            className={"cursor-pointer"}
            size={18}
            onClick={() => setNameEdit((old) => ({ ...old, stateEdit: true }))}
          />
        </div>
      )}

      <span className="font-semibold text-gray-500">{customer?.email}</span>
      <div className="flex gap-2 my-4">
        <div className="flex text-gray-400 text-xs ">
          <Cart size={16} />{" "}
          <p className="text-[10px]">{`(${store.parameters.numberSales}) Ventas`}</p>
        </div>
        <div className="flex text-gray-400 text-xs ">
          <Product size={16} />{" "}
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
export default CustomerStore
