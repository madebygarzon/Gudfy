
export function formatPrice(numero: number): number {
  if (numero == null || isNaN(numero)) {
    return 0;
  }
  
  if (Number.isInteger(numero)) {
    return numero;
  }
  
  const numStr = numero.toString();
  
  if (numStr.includes('.')) {
    const [parteEntera, parteDecimal] = numStr.split('.');
    
    if (parteDecimal.length > 2) {
      // Truncar a 2 decimales sin redondear
      const dosDecimales = parteDecimal.substring(0, 2);
      return parseFloat(`${parteEntera}.${dosDecimales}`);
    }
  }
  return numero;
}

