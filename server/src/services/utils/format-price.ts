export function formatPrice(price: number): number {
  let num = Number(price);
  if (isNaN(num)) {
    return 0; // Retornamos 0 en lugar de "Valor inválido"
  }

  if (Number.isInteger(price)) {
    return num;
  }

  // Convertimos el resultado a número antes de retornarlo
  return Number(num.toFixed(2));
}
