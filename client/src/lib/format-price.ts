export function formatPrice(price: number) {
  let num = Number(price)
  if (isNaN(num)) {
    return 0
  }

  if (Number.isInteger(price)) {
    return num
  }

  return parseFloat(num.toFixed(2).replace(/\.?0+$/, ""))
}
