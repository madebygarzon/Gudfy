

/**
 * Corrige errores de precisión en números de punto flotante en JavaScript
 * @param numero - El número con posible error de precisión
 * @returns El número con la precisión corregida
 */
export function formatPrice(numero: number): number {
  // Método 1: Redondeo a 4 decimales (más simple y efectivo para la mayoría de casos)
  // return Math.round(numero * 10000) / 10000;
  
  // Método 2: Análisis de patrones en decimales (más sofisticado)
  const numStr = numero.toString();
  
  // Si no tiene decimales, devolver el número tal cual
  if (!numStr.includes('.')) {
    return numero;
  }
  
  // Separar parte entera y decimal
  const [parteEntera, parteDecimal] = numStr.split('.');
  
  // Caso especial para multiplicaciones como 6.5751 * 71 = 466.83209999999997
  // Verificar si termina en 99999... o 00000...
  if (parteDecimal.length > 10) {
    // Buscar patrones como '00000' o '99999' al final
    const patronCeros = /0{5,}$/;
    const patronNueves = /9{5,}$/;
    
    if (patronCeros.test(parteDecimal)) {
      // Si termina en muchos ceros, truncar
      const pos = parteDecimal.search(patronCeros);
      return parseFloat(`${parteEntera}.${parteDecimal.substring(0, pos)}`);
    } 
    else if (patronNueves.test(parteDecimal)) {
      // Si termina en muchos nueves, redondear hacia arriba
      const pos = parteDecimal.search(patronNueves);
      
      // Si son todos nueves, incrementar la parte entera
      if (pos === 0) {
        return parseInt(parteEntera) + 1;
      }
      
      // Si el dígito anterior es 9, necesitamos propagar el incremento
      if (parteDecimal.charAt(pos - 1) === '9') {
        // Encontrar cuántos 9s hay antes del patrón
        let i = pos - 1;
        while (i >= 0 && parteDecimal.charAt(i) === '9') {
          i--;
        }
        
        // Si llegamos al inicio, incrementar parte entera
        if (i < 0) {
          return parseInt(parteEntera) + 1;
        }
        
        // Incrementar el dígito no-9 y poner ceros después
        const decimalCorregido = 
          parteDecimal.substring(0, i) + 
          (parseInt(parteDecimal.charAt(i)) + 1) + 
          '0'.repeat(pos - i - 1);
        
        return parseFloat(`${parteEntera}.${decimalCorregido}`);
      }
      
      // Incrementar el último dígito antes de los nueves
      const decimalCorregido = 
        parteDecimal.substring(0, pos - 1) + 
        (parseInt(parteDecimal.charAt(pos - 1)) + 1);
      
      return parseFloat(`${parteEntera}.${decimalCorregido}`);
    }
  }
  
  // Para casos más simples, redondear a 4 decimales
  return Math.round(numero * 10000) / 10000;
}

