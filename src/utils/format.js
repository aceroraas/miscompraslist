/**
 * Formatea un número como moneda
 * @param {number} value - Valor a formatear
 * @param {boolean} showSign - Si es true, muestra el signo + para valores positivos
 * @returns {string} Valor formateado como moneda
 */
export function formatCurrency(value, showSign = false) {
  // Manejar valores no numéricos
  if (isNaN(value) || value === null || value === undefined) {
    return '$0.00';
  }

  // Redondear a 2 decimales
  const roundedValue = Math.round(value * 100) / 100;
  
  // Formatear como moneda
  const formatter = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  let result = formatter.format(roundedValue);
  
  // Agregar signo + si es positivo y showSign es true
  if (showSign && roundedValue > 0) {
    result = `+${result}`;
  }
  
  return result;
}

/**
 * Formatea un número como porcentaje
 * @param {number} value - Valor entre 0 y 1
 * @returns {string} Porcentaje formateado
 */
export function formatPercentage(value) {
  if (isNaN(value) || value === null || value === undefined) {
    return '0%';
  }
  
  const percentage = Math.round(value * 100);
  return `${percentage}%`;
}
