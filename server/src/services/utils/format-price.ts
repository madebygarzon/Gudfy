export function formatPrice(valor: number | string | null): number {
  if (valor === null || valor === undefined) {
    return 0;
  }

  const numero = typeof valor === 'string' ? parseFloat(valor) : valor;
  

  if (isNaN(numero)) {
    return 0;
  }
  

  if (Number.isInteger(numero)) {
    return numero;
  }
  

  return Math.round(numero * 100) / 100;
}
