
export function formatPrice(numero: number): number {
  if (Number.isInteger(numero)) {
    return numero;
  }
  
  const numStr = numero.toString();
  
  if (numStr.includes('.')) {
    const [_, parteDecimal] = numStr.split('.');
    
    if (parteDecimal.length > 2) {
      const thirdDecimal = parseInt(parteDecimal[2]);
      
      if (thirdDecimal === 5) {
        // Mantener 3 decimales si el tercer decimal es 5
        return Math.floor(numero * 1000) / 1000;
      } else if (thirdDecimal < 5) {
        // Redondear hacia abajo si es menor que 5
        return Math.floor(numero * 100) / 100;
      } else {
        // Redondear hacia arriba si es mayor que 5
        return Math.ceil(numero * 100) / 100;
      }
    }
  }
  return numero;
}

