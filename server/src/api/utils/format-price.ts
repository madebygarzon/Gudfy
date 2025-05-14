export function formatPrice(price: number): number {
  let num = Number(price);
  if (isNaN(num)) {
    return 0; // Retornamos 0 en lugar de "Valor inválido"
  }

  // Si es un número entero, retornarlo sin cambios
  if (Number.isInteger(price)) {
    return num;
  }

  // Convertir a string para trabajar con los decimales
  const strNum = num.toString();
  
  // Encontrar la posición del punto decimal
  const decimalIndex = strNum.indexOf('.');
  if (decimalIndex === -1) return num; // Si no hay punto decimal, retornar el número original
  
  // Obtener la parte decimal
  const parteDecimal = strNum.substring(decimalIndex + 1);
  
  // Si tiene más de 4 decimales, redondear a 4 decimales
  if (parteDecimal.length > 4) {
    return Math.round(num * 10000) / 10000;
  }
  
  // Buscar dos ceros consecutivos en la parte decimal
  for (let i = decimalIndex + 1; i < strNum.length - 1; i++) {
    if (strNum[i] === '0' && strNum[i + 1] === '0') {
      // Si encontramos dos ceros consecutivos, recortar hasta la posición anterior
      return parseFloat(strNum.substring(0, i));
    }
  }
  
  // Si no hay dos ceros consecutivos, eliminar ceros al final
  let endIndex = strNum.length - 1;
  while (endIndex > decimalIndex && strNum[endIndex] === '0') {
    endIndex--;
  }
  
  // Si solo quedan ceros después del punto, retornar la parte entera
  if (endIndex === decimalIndex) {
    return parseInt(strNum.slice(0, decimalIndex));
  }
  
  // Retornar el número con los decimales significativos
  return parseFloat(strNum.slice(0, endIndex + 1));
}
