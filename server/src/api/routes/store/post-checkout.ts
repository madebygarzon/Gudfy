import { Request, Response } from "express"
import axios from "axios"
import crypto from "crypto"
import coinpal from "coinpal-sdk"

// ──────────────────────────────────────────────────────────────────────────
//  ROUTE:   POST /store/checkout/:id
//  PURPOSE: Procesar pago (Binance Pay o CoinPal) con comisión dinámica
// ──────────────────────────────────────────────────────────────────────────

export default async (req: Request, res: Response): Promise<void> => {
  const { payment_method, order_id } = req.body
  const cartId = req.params.id

  // Services
  const cartMarketService   = req.scope.resolve("cartMarketService")
  const commissionService   = req.scope.resolve("commissionService")
  const productVariantSvc   = req.scope.resolve("productVariantService")
  const storeOrderService   = req.scope.resolve("storeOrderService")

  // Recupera ítems del carrito
  const cartItems = await cartMarketService.recoveryCart(cartId)

  try {
    let result = null

    switch (payment_method) {
      case "automatic_binance_pay":
        result = await autoBinancePay(
          cartItems,
          order_id,
          commissionService,
          productVariantSvc
        )
        break

      case "coinpal_pay":
        result = await autoCoinPalPay(
          cartItems,
          order_id,
          commissionService,
          productVariantSvc
        )
        break

      default:
        throw new Error(`Método de pago no soportado: ${payment_method}`)
    }

    // Guarda método y referencia externa en la orden
    await storeOrderService.postMethodPaymentOrder(
      order_id,
      payment_method,
      result.nextStepContent
    )

    res.status(200).json({ result })
  } catch (error: any) {
    console.error("Error en el endpoint de pago:", error)
    res.status(500).json({
      error: error.message,
      details: error.response?.data || error.details,
    })
  }
}

// ──────────────────────────────
// Binance Pay
// ──────────────────────────────
const autoBinancePay = async (
  cartItems,
  orderId: string,
  commissionService,
  variantSvc
) => {
  const timestamp = Date.now()
  const nonce     = generateRandomString(32)

  const goods = cartItems.map((item) => ({
    goodsType:       "01",
    goodsCategory:   "D000",
    referenceGoodsId:item.variant_id,
    goodsName:       item.title,
    goodsDetail:     item.description,
  }))

  const fiatAmount = await handlerTotalPrice(
    cartItems,
    commissionService,
    variantSvc
  )

  const data = {
    env: { terminalType: "WEB" },
    merchantTradeNo: timestamp,
    fiatAmount,
    fiatCurrency: "USD",
    goodsDetails: goods,
    webhookUrl: `${
      process.env.BACKEND_URL.includes("localhost")
        ? "http://gudfyp2p.com:9000"
        : process.env.BACKEND_URL
    }/store/binance_pay/webhook/${orderId}/order`,
    returnUrl: `${
      process.env.FRONT_URL.includes("localhost")
        ? "http://gudfyp2p.com/"
        : process.env.FRONT_URL
    }/account/orders`,
    description: "Buy Order",
    supportPayCurrency: "USDT,BNB,BTC",
  }

  const body     = JSON.stringify(data)
  const payload  = `${timestamp}\n${nonce}\n${body}\n`
  const hmac     = crypto.createHmac("sha512", process.env.BINANCE_PAY_SECRET_KEY)
  hmac.update(payload)
  const signature = hmac.digest("hex").toUpperCase()

  return axios
    .post("https://bpay.binanceapi.com/binancepay/openapi/v3/order", body, {
      headers: {
        "content-type": "application/json",
        "BinancePay-Timestamp":   timestamp,
        "BinancePay-Nonce":       nonce,
        "BinancePay-Certificate-SN": process.env.BINANCE_PAY_API_KEY,
        "BinancePay-Signature":   signature,
      },
    })
    .then((r) => r.data)
}

// ──────────────────────────────
// CoinPal
// ──────────────────────────────
const autoCoinPalPay = async (
  cartItems,
  orderId: string,
  commissionService,
  variantSvc
) => {
  coinpal
    .setMchId(process.env.COINPAL_MCH_ID)
    .setApiKey(process.env.COINPAL_API_KEY)

  const totalAmount = await handlerTotalPrice(
    cartItems,
    commissionService,
    variantSvc
  )

  const requestId = `${orderId}${Date.now()}`

  const paymentInfo = {
    version:   "2.1",
    requestId,
    merchantNo: process.env.COINPAL_MCH_ID,
    orderNo:    orderId,
    orderCurrencyType: "crypto",
    orderCurrency: "USDT",
    orderAmount: totalAmount.toString(),
    accessToken: process.env.ACCESS_TOKEN,
    notifyURL: `${
      process.env.BACKEND_URL.includes("localhost")
        ? "http://gudfyp2p.com:9000"
        : process.env.BACKEND_URL
    }/store/coinpal/webhook/${orderId}${Date.now()}/order`,
    redirectURL: `${
      process.env.FRONT_URL.includes("localhost")
        ? "http://gudfyp2p.com:8000"
        : process.env.FRONT_URL
    }/account/orders`,
    sign: await generateSign(
      requestId,
      orderId,
      totalAmount,
      "USDT"
    ),
  }

  const result = await coinpal.createPayment(paymentInfo)

  if (!result?.nextStepContent)
    throw new Error("No se recibió URL de pago de CoinPal")

  return {
    nextStepContent: result.nextStepContent,
    reference:       result.reference,
    status:          result.status,
    orderAmount:     result.orderAmount,
    orderCurrency:   result.orderCurrency,
    orderNo:         result.orderNo,
  }
}

// ──────────────────────────────
// Helper: total con comisión dinámica
// ──────────────────────────────
const handlerTotalPrice = async (
  items,
  commissionService,
  variantSvc
): Promise<number> => {
  let total = 0

  for (const item of items) {
    // Aseguramos product_id
    const productId =
      item.product_id ??
      (
        await variantSvc.retrieve(item.variant_id, { select: ["product_id"] })
      ).product_id

    const rate = await commissionService.getRate({ productId })
    total += item.unit_price * item.quantity * (1 + rate)
  }

  return Number(total.toFixed(2))
}

// ──────────────────────────────
// Utils
// ──────────────────────────────
const generateSign = async (
  requestId: string,
  orderNo: string,
  orderAmount: number,
  orderCurrency: string
) => {
  const apiKey     = process.env.COINPAL_API_KEY
  const merchantNo = process.env.COINPAL_MCH_ID
  const input      = apiKey + requestId + merchantNo + orderNo + orderAmount + orderCurrency
  return crypto.createHash("sha256").update(input).digest("hex")
}

const generateRandomString = (len: number): string => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
  let result  = ""
  for (let i = 0; i < len; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}
