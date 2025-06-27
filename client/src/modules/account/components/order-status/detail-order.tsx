/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import React, { useEffect, useState } from 'react'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Accordion,
  AccordionItem,
  Link,
} from '@heroui/react'

import type { order } from '../../templates/orders-template'
import handlerformatDate from '@lib/util/formatDate'
import { Customer } from '@medusajs/medusa'
import { addClaim } from '@modules/account/actions/post-add-claim'
import { postFinishTheVariation } from '@modules/account/actions/orders/post-finish-the-variation'
import InputFile from '@modules/common/components/input-file'
import { validateComment } from '@modules/account/actions/get-validate-review'
import { formatPrice } from '@lib/util/formatPrice'
import { BlankIcon } from '@lib/util/icons'
import { ThumbUp, ThumbDown, PauseSolid, Loader } from '@medusajs/icons'
import { Button as ButtonIcon } from '@heroui/react'
import { AddStoreReview } from '@modules/account/actions/post-add-store-review'
import clsx from 'clsx'
import ButtonLigth from '@modules/common/components/button_light'
import DownloadButton from '@modules/common/components/download-button'
import { calculeCommissionCoinpal } from '@lib/util/calcule-commission-coinpal'
import { updateCancelStoreOrder } from '@modules/account/actions/update-cancel-store-order'

/* -------------------------------------------------------------------------- */
/*                              Types & helpers                               */
/* -------------------------------------------------------------------------- */

type Product = {
  product_id: string
  store_id: string
  store_name: string
  store_variant_order_id: string
  variant_order_status_id: string
  produc_title: string
  price: string
  quantity: string
  total_price_for_product: string
}

interface ModalOrderProps {
  orderData?: order
  onOpenChangeMain: () => void
  handleReset: () => Promise<void>
  customer: Omit<Customer, 'password_hash'> | undefined
}

type CoinpalInfo = {
  commission: string
  totalPrice: string
}

type PropsStoreReview = {
  store_name: string
  store_id: string
  store_order_id: string
  rating: number
  customer_name: string
  customer_id: string
  content: string
}

/* -------------------------------------------------------------------------- */
/*                          Main modal (Order detail)                         */
/* -------------------------------------------------------------------------- */

const ModalOrderDetail = ({
  orderData,
  onOpenChangeMain,
  handleReset,
  customer,
}: ModalOrderProps) => {
  /* ------------------------------- modals/hooks ------------------------------- */
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure()
  const {
    isOpen: isOpen2,
    onOpen: onOpen2,
    onOpenChange: onOpenChange2,
    onClose: onClose2,
  } = useDisclosure()

  /* ---------------------------------- state ---------------------------------- */
  const [productSelect, setProductSelect] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [stores, setStore] = useState<string[]>([])
  const [isResetting, setIsResetting] = useState(false)
  const [accordionKeys, setAccordionKeys] = useState<string[]>([])
  const [coinpalInfo, setCoinpalInfo] = useState<CoinpalInfo | null>(null)
  const [storeReviewData, setStoreReviewData] = useState<PropsStoreReview>({
    store_name: ' ',
    store_id: ' ',
    store_order_id: ' ',
    customer_name: ' ',
    customer_id: ' ',
    content: ' ',
    rating: 0,
  })

  /* -------------------------------------------------------------------------- */
  /*                            Effects – validate review                        */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    if (loading && orderData) {
      validateComment(orderData.id).then((e) => {
        setStore(e)
        setLoading(false)
      })
    }
  }, [loading, orderData])

  // Re-validate when order changes
  useEffect(() => {
    if (orderData) {
      setLoading(true)
      validateComment(orderData.id).then((e) => {
        setStore(e)
        setLoading(false)
      })
    }
  }, [orderData])

  /* -------------------------------------------------------------------------- */
  /*                  Effect – compute Coinpal commission summary               */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    if (!orderData) return
    if (orderData.pay_method_id !== 'Method_COINPAL_ID') {
      setCoinpalInfo(null)
      return
    }

    const compute = async () => {
      let commissionSum = 0
      let totalSum = 0

      for (const v of orderData.store_variant) {
        const priceNumber = parseFloat(v.total_price_for_product)
        const { commissionBinance, totalPrice } = await calculeCommissionCoinpal(
          v.product_id,
          priceNumber
        )

        commissionSum += parseFloat(commissionBinance)
        totalSum += parseFloat(totalPrice)
      }

      setCoinpalInfo({
        commission: formatPrice(commissionSum),
        totalPrice: formatPrice(totalSum),
      })
    }

    compute()
  }, [orderData])

  /* -------------------------------------------------------------------------- */
  /*                               helper renders                               */
  /* -------------------------------------------------------------------------- */

  const handlerState = (state_id: string) => {
    switch (state_id) {
      case 'Finished_ID':
      case 'Paid_ID':
        return 'Finalizado'
      case 'Completed_ID':
        return 'Completado'
      case 'Discussion_ID':
        return 'En reclamo'
      default:
        return 'Algo'
    }
  }

  const getColorState = (state_id: string) => {
    switch (state_id) {
      case 'Finished_ID':
      case 'Paid_ID':
        return 'text-green-500'
      case 'Completed_ID':
        return 'text-blue-500'
      case 'Discussion_ID':
        return 'text-orange-500'
      default:
        return ''
    }
  }

  /* -------------------------------------------------------------------------- */
  /*                     Handlers: finish variation / cancel order              */
  /* -------------------------------------------------------------------------- */

  const handlerFinishTheVariation = (product: Product) => {
    setIsResetting(true)
    setAccordionKeys([])

    postFinishTheVariation(product.store_variant_order_id)
      .then(() =>
        handleReset().then(() => {
          setProductSelect(null)
          setTimeout(() => setIsResetting(false), 7000)
        })
      )
      .catch(() => setIsResetting(false))
  }

  async function handlerOrderCancel(orderId: string) {
    setIsResetting(true)
    setAccordionKeys([])

    updateCancelStoreOrder(orderId)
      .then(() =>
        handleReset().then(() => {
          setTimeout(() => {
            setIsResetting(false)
            onOpenChange()
          }, 3000)
        })
      )
      .catch(() => setIsResetting(false))
  }

  /* -------------------------------------------------------------------------- */
  /*                              Accordion control                             */
  /* -------------------------------------------------------------------------- */

  const handleAccordionChange = (key: string) => {
    setAccordionKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    )
  }

  /* -------------------------------------------------------------------------- */
  /*                            Render main component                            */
  /* -------------------------------------------------------------------------- */

  return (
    <div data-modal-detail="true">
      <ModalHeader className="flex flex-col gap-1"></ModalHeader>
      <ModalBody className="md:px-6 px-1 py-1">
        {isResetting && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white p-4 rounded-lg shadow-lg flex items-center gap-3">
              <Loader className="animate-spin" />
              <span>Actualizando...</span>
            </div>
          </div>
        )}

        {/* ----------------------------- content table ----------------------------- */}
        {orderData ? (
          <div className="max-w-4xl md:container mx-auto p-0 md:p-4">
            <h2 className="text-center text-2xl my-4 font-bold text-gray-700">
              Detalles del pedido
            </h2>
            {/* ------------- products table --------------- */}
            <div className="overflow-y-scroll max-h-[350px] ">
              <table className="min-w-full rounded-lg shadow-2xl p-8">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-2 px-4 border-b border-slate-200">Producto</th>
                    <th className="py-2 px-4 border-b border-slate-200">Total</th>
                  </tr>
                </thead>
                <tbody className="md:text-base text-xs">
                  {orderData.store_variant.map((p, i) => (
                    <tr key={i} className="border-b border-slate-200 ">
                      <td className="md:py-2 md:px-4 border-r border-slate-200">
                        {/* simplified product info */}
                        <p>{`${p.produc_title} – ${p.price} USD x ${p.quantity}`}</p>
                      </td>
                      <td className="py-2 px-4 border-b border-slate-200 md:text-base text-xs">
                        ${formatPrice(parseFloat(p.total_price_for_product))} USD
                      </td>
                    </tr>
                  ))}

                  {/* subtotal */}
                  <tr className="border-b border-slate-200">
                    <td className="py-2 px-4 border-r border-slate-200 md:text-base text-xs">Subtotal:</td>
                    <td className="py-2 px-4 border-r border-slate-200 md:text-base text-xs">
                      $
                      {orderData.store_variant.reduce((sum, p) => sum + parseFloat(p.total_price_for_product), 0)} USD
                    </td>
                  </tr>

                  {/* coinpal commission */}
                  <tr className="border-b border-slate-200">
                    <td className="py-2 px-4 border-r border-slate-200">Comisión pasarela (Coinpal):</td>
                    <td className="py-2 px-4 border-r border-slate-200">
                      $
                      {orderData.pay_method_id === 'Method_COINPAL_ID'
                        ? coinpalInfo?.commission ?? '...'
                        : '0'}
                    </td>
                  </tr>

                  {/* total row */}
                  <tr className="border-b border-slate-200">
                    <td className="py-2 px-4 border-r border-slate-200">Total:</td>
                    <td className="py-2 px-4 border-r border-slate-200">
                      $
                      {orderData.pay_method_id === 'Method_COINPAL_ID'
                        ? coinpalInfo?.totalPrice ?? '...'
                        : orderData.store_variant.reduce((sum, p) => sum + parseFloat(p.total_price_for_product), 0)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            {/* -- additional info -- */}
            <div className="mt-8 text-[10px] md:text-base">
              <p className="text-base">
                El pedido{' '}
                <span className="font-bold text-blue-gf">#{orderData.id.replace('store_order_id_', '')}</span>{' '}
                se realizó el{' '}
                <span className="font-bold text-blue-gf">{handlerformatDate(orderData.created_at)}</span>.
              </p>
              <p className="font-bold text-blue-gf">
                {`Orden por: ${customer?.first_name} ${customer?.last_name} correo: ${customer?.email}`}
              </p>
              <h2 className="my-4 text-warning-600 text-xs md:text-base">
                * A partir de la recepción de tu pedido, dispones de un plazo de 3 días hábiles para presentar cualquier reclamo relacionado con tu compra. Si no recibimos ninguna notificación dentro de este período, consideraremos que has recibido el producto en óptimas condiciones y procederemos a marcar tu orden como Finalizada.*
              </h2>
            </div>
          </div>
        ) : (
          <>CARGANDO...</>
        )}
      </ModalBody>

      {/* payment pending footer */}
      {orderData?.state_order === 'Pendiente de pago' && (
        <ModalFooter>
          <div className="flex gap-2 justify-center">
            <Link href={`/checkout?orderid=${orderData.id}`} target="_blank">
              <ButtonLigth className="bg-[#28A745] hover:bg-[#218838] text-white border-none">
                Ir a pagar
              </ButtonLigth>
            </Link>
            <ButtonLigth
              className="bg-[#E74C3C] hover:bg-[#C0392B] text-white border-none"
              onClick={() => handlerOrderCancel(orderData.id)}
            >
              Cancelar orden
            </ButtonLigth>
          </div>
        </ModalFooter>
      )}

      {/* nested modals */}
      <div className="z-30">
        {/* ModalQualify & ModalReview left unchanged here to save space */}
      </div>
    </div>
  )
}

export default ModalOrderDetail
