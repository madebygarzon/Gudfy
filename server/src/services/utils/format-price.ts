
export function formatPrice(numero: number): number {
  if (Number.isInteger(numero)) {
    return numero;
  }
  
  const numStr = numero.toString();
  
  if (numStr.includes('.')) {
    const [_, parteDecimal] = numStr.split('.');
    
    if (parteDecimal.length > 2) {
      return Math.round(numero * 100) / 100;
    }
  }
  return numero;
}

