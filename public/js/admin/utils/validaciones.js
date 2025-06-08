// Funciones de validación reutilizables
export function esEnteroPositivo(valor) {
  return /^\d+$/.test(valor) && Number(valor) > 0;
}

export function campoNoVacio(valor) {
  return valor && valor.trim() !== '';
}
