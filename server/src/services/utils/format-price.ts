export function formatPrice(numero: number | null | undefined): number {
  if (numero === null || numero === undefined || Number.isNaN(numero)) {
    return 0;
  }

  const numeroNormalizado =
    typeof numero === "string" ? Number(numero) : numero;

  if (Number.isInteger(numeroNormalizado)) {
    return numeroNormalizado;
  }

  try {
    const numStr = numeroNormalizado.toString();

    if (numStr.includes(".")) {
      const [_, parteDecimal] = numStr.split(".");

      if (parteDecimal.length > 2) {
        const thirdDecimal = parseInt(parteDecimal[2]);

        if (thirdDecimal === 5) {
          return Math.floor(numeroNormalizado * 1000) / 1000;
        } else if (thirdDecimal < 5) {
          return Math.floor(numeroNormalizado * 100) / 100;
        } else {
          return Math.ceil(numeroNormalizado * 100) / 100;
        }
      }
    }

    return numeroNormalizado;
  } catch (error) {
    console.error("Error al formatear precio:", error);
    return 0;
  }
}
