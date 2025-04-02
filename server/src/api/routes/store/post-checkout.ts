import { Request, Response } from "express";
import axios from "axios";
import crypto from "crypto";
import coinpal from "coinpal-sdk";

// Configuración de CoinPal

export default async (req: Request, res: Response): Promise<void> => {
  const { payment_method, order_id } = req.body;
  const cartId = req.params.id;
  const cartMarketService = req.scope.resolve("cartMarketService");
  const cartItems = await cartMarketService.recoveryCart(cartId);
  var result = null;
  try {
    switch (payment_method) {
      case "automatic_binance_pay":
        result = await autoCoinPalPay(cartItems, order_id);
        break;
      case "coinpal_pay":
        result = await autoCoinPalPay(cartItems, order_id);
        break;
      default:
        throw new Error(`Método de pago no soportado: ${payment_method}`);
    }
    res.status(200).json({ result });
  } catch (error) {
    console.log("Error en el endpoint de pago:", error);
    res.status(500).json({
      error: error.message,
      details: error.response?.data || error.details,
    });
  }
};

// Función para Binance Pay (existente)
const autoBinancePay = async (cartItems, order_id) => {
  const timestamp = new Date().getTime();
  const nonce = generateRandomString(32);
  const goods = cartItems.map((item) => {
    return {
      goodsType: "01",
      goodsCategory: "D000",
      referenceGoodsId: item.variant_id,
      goodsName: item.title,
      goodsDetail: item.description,
    };
  });

  const data = {
    env: {
      terminalType: "WEB",
    },
    merchantTradeNo: timestamp,
    fiatAmount: handlerTotalPrice(cartItems),
    fiatCurrency: "USD",
    goodsDetails: goods,
    webhookUrl: `${
      process.env.BACKEND_URL.includes("localhost")
        ? "http://gudfyp2p.com:9000"
        : process.env.BACKEND_URL
    }/store/binance_pay/webhook/${order_id}/order`,
    returnUrl: `${
      process.env.FRONT_URL.includes("localhost")
        ? "http://gudfyp2p.com/"
        : process.env.FRONT_URL
    }/account/orders`,
    description: "Buy Order",
    supportPayCurrency: "USDT,BNB,BTC",
  };

  const body = JSON.stringify(data);
  const payload = `${timestamp}\n${nonce}\n${body}\n`;
  const hmac = crypto.createHmac("sha512", process.env.BINANCE_PAY_SECRET_KEY);
  hmac.update(payload);
  const signature = hmac.digest("hex").toUpperCase();

  return axios
    .post("https://bpay.binanceapi.com/binancepay/openapi/v3/order", body, {
      headers: {
        "content-type": "application/json",
        "BinancePay-Timestamp": timestamp,
        "BinancePay-Nonce": nonce,
        "BinancePay-Certificate-SN": process.env.BINANCE_PAY_API_KEY,
        "BinancePay-Signature": signature,
      },
    })
    .then((res) => res.data)
    .catch((e) => {
      console.log("ERROR EN BINANCE:", e.response?.data);
      throw e.response?.data || e;
    });
};

const generateSing = async (requestId, orderNo, orderAmount, orderCurrency) => {
  const crypto = require("crypto");
  const apiKey = process.env.COINPAL_API_KEY;
  const merchantNo = process.env.COINPAL_MCH_ID;
  const input =
    apiKey + requestId + merchantNo + orderNo + orderAmount + orderCurrency;

  const sign = crypto.createHash("sha256").update(input).digest("hex");
  return sign;
};

// Nueva función para CoinPal usando el SDK
const autoCoinPalPay = async (cartItems, order_id) => {
  coinpal
    .setMchId(process.env.COINPAL_MCH_ID)
    .setApiKey(process.env.COINPAL_API_KEY);
  const totalAmount = handlerTotalPrice(cartItems);
  const requestId = `${order_id}${Date.now()}`;
  const orderNo = `${order_id}`;
  const paymentInfo = {
    version: "2.1",
    requestId: requestId,
    merchantNo: process.env.COINPAL_MCH_ID,
    orderNo,
    orderCurrencyType: "crypto",
    orderCurrency: "USDT",
    orderAmount: totalAmount.toString(),
    accessToken: process.env.ACCESS_TOKEN,
    notifyURL: `${
      process.env.BACKEND_URL.includes("localhost")
        ? "http://gudfyp2p.com:9000"
        : process.env.BACKEND_URL
    }/store/coinpal/webhook/${order_id}${Date.now()}/order`,
    redirectURL: `${
      process.env.FRONT_URL.includes("localhost")
        ? "http://gudfyp2p.com:8000"
        : process.env.FRONT_URL
    }/account/orders`,
    sign: await generateSing(requestId, orderNo, totalAmount, "USDT"),
  };

  // try {
  //   const result = await coinpal.createPayment(paymentInfo);
  //   console.log("resultado de createPaymentttt", result);
  //   if (result.nextStepContent) {
  //     return {
  //       nextStepContent: result.nextStepContent,
  //       reference: result.reference,
  //       status: result.status,
  //       orderAmount: result.orderAmount,
  //       orderCurrency: result.orderCurrency,
  //       orderNo: result.orderNo,
  //     };
  //   }

  //   throw new Error("No se recibió URL de pago de CoinPal");
  // } catch (error) {
  //   console.error("Error en CoinPal:", error);
  //   throw {
  //     message: "Error al procesar pago con CoinPal",
  //     details: error.response?.data || error.message,
  //     code: error.code,
  //   };
  // }

  try {
    const result = await coinpal.createPayment(paymentInfo);

    if (result && result.nextStepContent) {
      return {
        nextStepContent: result.nextStepContent,
        reference: result.reference,
        status: result.status,
        orderAmount: result.orderAmount,
        orderCurrency: result.orderCurrency,
        orderNo: result.orderNo,
      };
    }
    throw new Error("No se recibió URL de pago de CoinPal");
  } catch (error) {
    console.error("Error en CoinPal:", error);
    throw {
      message: "Error al procesar pago con CoinPal",
      details: error.response?.data || error.message,
      code: error.code,
    };
  }
};

// Funciones auxiliares (existentes)
const handlerTotalPrice = (items) => {
  let total: number = 0;
  if (items?.length) {
    items?.forEach((item) => {
      total = total + item.unit_price * item.quantity;
    });
  }
  total = total + total * 0.01; // Comisión de binance free y Gudfy free
  return total + total * 0.01; // Comisión de y Gudfy free
};

const generateRandomString = (length) => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  let result = "";
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
};
