import { Request, Response } from "express";
import axios from "axios";
import crypto from "crypto";

export default async (req: Request, res: Response): Promise<void> => {
  const { payment_method, order_id } = req.body;

  const cartId = req.params.id;
  const cartMarketService = req.scope.resolve("cartMarketService");
  const cartItems = await cartMarketService.recoveryCart(cartId);
  var result = null;
  try {
    switch (payment_method) {
      case "automatic_binance_pay":
        result = await autoBinancePay(cartItems, order_id);
        break;

      default:
        break;
    }
    res.status(200).json({ result });
  } catch (error) {
    console.log("error en el endpoint dew la solicito a binance:", error);
    res.status(500).json({ error });
  }
};

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
        ? "http://179.61.219.62:9000"
        : process.env.BACKEND_URL
    }/store/binance_pay/webhook/${order_id}/order`,
    returnUrl: `${
      process.env.FRONT_URL.includes("localhost")
        ? "http://179.61.219.62:8000"
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

  // const response = await axios.post(
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
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      console.log("ERROR EN BINANCE:", e.response.data);
      throw e.response.data;
    });
};

const handlerTotalPrice = (items) => {
  let total: number = 0;
  if (items?.length) {
    items?.forEach((item) => {
      total = total + item.unit_price * item.quantity;
    });
  }
  total = total + total * 0.01; //Comicion de binance free y Gudfy free
  return total + total * 0.01; //Comicion de y Gudfy free
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
