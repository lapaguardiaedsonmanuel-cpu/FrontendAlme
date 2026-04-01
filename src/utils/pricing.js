const toNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const getOfertaPrecioUnidad = (product) => {
  if (!product?.ofertaDestacada) return null;
  return Math.max(toNumber(product.precioMenor) - 4, 0);
};

export const getPrecioUnitarioAplicable = (product, cantidad = 1) => {
  const qty = toNumber(cantidad, 1);
  const cantidadMayorMinima = toNumber(product?.cantidadMayorMinima, 0);
  const precioMayor = toNumber(product?.precioMayor, 0);

  if (cantidadMayorMinima > 0 && qty >= cantidadMayorMinima && precioMayor > 0) {
    return precioMayor;
  }

  const precioOferta = getOfertaPrecioUnidad(product);
  if (precioOferta !== null) return precioOferta;

  const precioLegacy = Number(product?.precio);
  if (Number.isFinite(precioLegacy)) {
    return precioLegacy;
  }

  return toNumber(product?.precioMenor, 0);
};
