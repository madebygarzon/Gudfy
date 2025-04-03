import { formatPrice } from "@lib/format-price"

export const calculeCommissionCoinpal = (price: number) => {
  const comissionGudfy = 0.01 * price + price
  const commissionBinance = 0.01 * comissionGudfy

  return {
    commission: formatPrice(commissionBinance),
    totalPrice: formatPrice(commissionBinance + comissionGudfy),
  }
}
