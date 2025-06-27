import { formatPrice }       from "@lib/util/formatPrice"
import { fetchCommission }   from "@lib/commission"

// Binance cobra 1 % fijo (parametrizable)
const BINANCE_FEE = Number(process.env.NEXT_PUBLIC_BINANCE_FEE ?? 0.01)

/**
 * Devuelve desglose formateado:
 * - commissionGudfy   → comisión de Gudfy (string formateado)
 * - commissionBinance → tarifa Binance Pay   (string formateado)
 * - totalPrice        → total final          (string formateado)
 * - rateGudfy         → número decimal (ej. 0.015)
 */
export const calculeCommissionCoinpal = async (
  variantId: string,
  basePrice: number
) => {
  // 1. Comisión variable de Gudfy
  const gudfyRate = await fetchCommission(variantId)
  const gudfyFee  = basePrice * gudfyRate
  const subTotal  = basePrice + gudfyFee

  // 2. Tarifa fija de Binance Pay
  const binanceFee = subTotal * BINANCE_FEE
  const total      = subTotal + binanceFee

  return {
    commissionGudfy   : formatPrice(gudfyFee),
    commissionBinance : formatPrice(binanceFee),
    totalPrice        : formatPrice(total),
    rateGudfy         : gudfyRate,
  }
}
