export function formatPrice(price: number) {
  let num = Number(price);
  if (isNaN(num)) {
    return "Valor inválido";
  }

  if (Number.isInteger(price)) {
    return num;
  }

  return num.toFixed(2).replace(/\.?0+$/, "");
}
