import { formatPrice } from "@lib/util/formatPrice"

export const calculeCommissionCoinpal = (price: number) => {
  const comissionGudfy = 0.01 * price + price
  const commissionBinance = 0.01 * comissionGudfy

  return {
    commission: formatPrice(commissionBinance),
    totalPrice: formatPrice(commissionBinance + comissionGudfy),
  }
}
